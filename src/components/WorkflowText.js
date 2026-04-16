import React, { useState, useEffect } from 'react';
import { Wand2, Image as ImageIcon, Loader2, ArrowRight, Clock } from 'lucide-react';
import { getEnhancedPrompt, generateImage } from '../utils/apiHelpers';
import ImageCard from './ImageCard';

const WorkflowText = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [retryCountdown, setRetryCountdown] = useState(0);

  useEffect(() => {
    if (retryCountdown <= 0) return;
    const timer = setInterval(() => {
      setRetryCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [retryCountdown]);

  const handleEnhance = async () => {
    if (!userPrompt.trim()) return;

    setIsEnhancing(true);
    setStatusMessage("Analyzing and enhancing your prompt with AI...");
    try {
      // Check if rate limited — show countdown
      const retryMatch = null; // will be set in catch if needed
      const result = await getEnhancedPrompt(userPrompt);
      setEnhancedPrompt(result);
      setStatusMessage("✅ Prompt enhanced! Review and edit it below, then generate.");
    } catch (err) {
      const waitMatch = err.message.match(/(\d+(?:\.\d+)?)s/);
      if (waitMatch) {
        const secs = Math.ceil(parseFloat(waitMatch[1]));
        setRetryCountdown(secs);
        setStatusMessage(`Rate limited. Retrying automatically in ${secs}s...`);
      } else {
        setStatusMessage(`❌ Error: ${err.message}`);
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!enhancedPrompt.trim()) return;

    setIsGenerating(true);
    setStatusMessage("Generating your masterpiece! This might take a few seconds...");
    setGeneratedImage(null); // Clear previous
    try {
      const imageUrl = await generateImage(enhancedPrompt);
      setGeneratedImage(imageUrl);
      setStatusMessage("Image generated successfully!");
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          What do you want to see?
        </h2>
        <textarea
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
          rows="3"
          placeholder="e.g. A flying car in a futuristic city..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          disabled={isEnhancing || isGenerating}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleEnhance}
            disabled={!userPrompt.trim() || isEnhancing || isGenerating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEnhancing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            AI Enhance Prompt
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-lg text-sm font-medium ${statusMessage.startsWith("❌ Error:") ? 'bg-red-50 text-red-700' : statusMessage.includes("Rate limited") || retryCountdown > 0 ? 'bg-orange-50 text-orange-700 flex items-center gap-2' : 'bg-blue-50 text-blue-700'}`}>
          {retryCountdown > 0 && <Clock className="w-5 h-5 animate-pulse" />}
          {retryCountdown > 0 ? `Rate limited. Retrying automatically in ${retryCountdown}s...` : statusMessage}
        </div>
      )}

      {/* 2. Approval Section */}
      {enhancedPrompt && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Review & Edit Prompt
          </h2>
          <textarea
            className="w-full p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-inner"
            rows="5"
            value={enhancedPrompt}
            onChange={(e) => setEnhancedPrompt(e.target.value)}
            disabled={isGenerating}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!enhancedPrompt.trim() || isGenerating}
              className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              Generate Image
              {!isGenerating && <ArrowRight className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>
      )}

      {/* 3. Output Section */}
      {generatedImage && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Your Masterpiece
          </h2>
          <div className="max-w-xl mx-auto">
            <ImageCard imageUrl={generatedImage} prompt={enhancedPrompt} />
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkflowText;
