import { API_KEYS, SYSTEM_TEXT_PROMPT } from './constants';

// Helper: sleep for ms milliseconds
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: call Gemini with 1 automatic retry on rate-limit (429)
const callGemini = async (body, retries = 1) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEYS.GEMINI}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (data.error) {
    const isRateLimit = data.error.code === 429 || (data.error.message && data.error.message.includes('retry'));

    if (isRateLimit && retries > 0) {
      // Parse "retry in X seconds" from the error message
      const retryMatch = data.error.message.match(/retry in (\d+(?:\.\d+)?)s/i);
      const waitSec = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) + 2 : 35;
      console.warn(`Rate limited. Retrying in ${waitSec}s...`);
      await sleep(waitSec * 1000);
      return callGemini(body, retries - 1);
    } else if (isRateLimit) {
      // If we are completely out of retries, gracefully fallback to a simple generic string so the app doesn't crash.
      console.warn("Retries exhausted. Using graceful fallback.");
      return { _isFallback: true };
    }

    throw new Error(data.error.message || 'Gemini API error');
  }

  return data;
};

export const getEnhancedPrompt = async (input) => {
  if (!API_KEYS.GEMINI) throw new Error("Missing Gemini API Key (REACT_APP_GEMINI_KEY). Check your .env file.");

  try {
    const data = await callGemini({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_TEXT_PROMPT}\n\nUser request: ${input}` }],
        },
      ],
    });

    if (data._isFallback) {
      return `A masterfully detailed, cinematic interpretation of ${input}. High resolution, gorgeous lighting, vibrant colors, trending on ArtStation, 8k rendering.`;
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? text.trim() : input;
  } catch (error) {
    console.error("Enhancement failed:", error);
    throw new Error(error.message || "Failed to enhance prompt.");
  }
};

export const generateImage = async (prompt, retries = 2) => {
  if (!API_KEYS.HUGGINGFACE) {
    console.warn("HF Key missing. Yielding fallback image service.");
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEYS.HUGGINGFACE}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      
      if (err.estimated_time && retries > 0) {
        console.warn(`HF Model loading. Waiting ${err.estimated_time}s...`);
        await sleep(Math.ceil(err.estimated_time * 1000) + 1000);
        return generateImage(prompt, retries - 1);
      }
      throw new Error(err.error || "Image generation failed.");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn("Hugging Face API failed (CORS, loading, or rate limit). Falling back to resilient public endpoint.", error);
    // Pollinations AI is a free open-access wrapper for Stable Diffusion - perfectly functional for fallbacks!
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
  }
};

export const analyzeImage = async (base64Data) => {
  if (!API_KEYS.GEMINI) throw new Error("Missing Gemini API Key (REACT_APP_GEMINI_KEY). Check your .env file.");

  const base64Image = base64Data.split(',')[1];

  try {
    const data = await callGemini({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: "Analyze this image and provide a JSON response with ONLY these exact keys: 'objects' (string of main objects), 'colors' (string of color palette), 'style' (string of artistic style), 'lighting' (string of lighting). Return raw JSON only, no markdown code blocks.",
            },
            {
              inline_data: { mime_type: "image/jpeg", data: base64Image },
            },
          ],
        },
      ],
    });

    if (data._isFallback) {
      return {
        objects: "Unknown Subject (Rate Limited Fallback)",
        colors: "Vibrant contrasting colors",
        style: "Modern Digital Art",
        lighting: "Dramatic studio lighting"
      };
    }

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    // Strip markdown code blocks if present
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error(error.message || "Failed to analyze image. Please try another image.");
  }
};
