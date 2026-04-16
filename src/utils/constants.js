export const API_KEYS = {
  GEMINI: process.env.REACT_APP_GEMINI_KEY,
  HUGGINGFACE: process.env.REACT_APP_HUGGINGFACE_KEY,
};

export const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop";

export const SYSTEM_TEXT_PROMPT = "You are an expert prompt engineer. Transform the following simple request into a 50-word descriptive masterpiece including lighting, camera angle, and artistic style. Output ONLY the generated prompt, nothing else.";
