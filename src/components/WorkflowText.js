import React, { useState, useEffect } from 'react';
import { Wand2, Loader2, Clock } from 'lucide-react';
import { getEnhancedPrompt, generateImage } from '../utils/apiHelpers';
import ImageCard from './ImageCard';

const WorkflowText = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [retryCountdown, setRetryCountdown] = useState(0);

  const STYLES = [
    { id: 'cinematic', icon: '🎬', label: 'Cinematic' },
    { id: 'abstract', icon: '🌀', label: 'Abstract' },
    { id: 'hyper-real', icon: '📸', label: 'Hyper-real' },
    { id: 'noir', icon: '🕵️', label: 'Noir' },
    { id: 'surrealist', icon: '👁️', label: 'Surrealist' },
    { id: 'neon-punk', icon: '⚡', label: 'Neon Punk' },
    { id: 'minimalist', icon: '⚪', label: 'Minimalist' }
  ];

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
    setStatusMessage("Crafting advanced prompt with AI...");
    try {
      const result = await getEnhancedPrompt(userPrompt);
      setUserPrompt(result); // Update directly in the box per new UI
      setStatusMessage("✦ Enhancement complete! You can still manually edit it.");
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
    if (!userPrompt.trim() || !selectedStyle) return;

    setIsGenerating(true);
    setStatusMessage("Generating your masterpiece...");
    setGeneratedImage(null);
    try {
      // mix selected style cleanly into the final generation
      const finalPrompt = `${userPrompt}. Style: ${selectedStyle.label}, extremely detailed masterpiece.`;
      const imageUrl = await generateImage(finalPrompt);
      setGeneratedImage(imageUrl);
      setStatusMessage("Image generated successfully!");
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-[0.98] duration-700">
      
      {/* 1. Input Section */}
      <div className="frosted-card p-6 sm:p-8 border-b-0 rounded-t-3xl shadow-2xl relative overflow-hidden">
        <h2 className="text-xl font-syne font-bold mb-5 flex items-center gap-3 text-slate-100 tracking-wide">
          <span className="bg-[#6c3fff] shadow-[0_0_15px_rgba(108,63,255,0.4)] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black">1</span>
          What do you want to see?
        </h2>
        
        <textarea
          className="w-full font-dm font-medium text-[15px] p-5 bg-[#0a0710] text-slate-100 border border-white/5 rounded-xl focus:ring-1 focus:ring-[#00e5b0]/50 focus:border-[#00e5b0]/50 outline-none transition-all resize-none shadow-inner z-10 relative"
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
            className="flex items-center gap-2 bg-[#120a21] border border-[#6c3fff]/20 hover:bg-[#1a0e30] hover:border-[#6c3fff]/40 text-[#6c3fff] px-5 py-2.5 rounded-lg font-dm font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-inner hover:-translate-y-[1px]"
          >
            {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="opacity-80">+</span>}
            AI Enhance Prompt
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-sm font-dm font-medium border frosted-card mx-2 ${statusMessage.startsWith("❌ Error:") ? 'text-red-300 border-red-500/20' : statusMessage.includes("Rate limited") || retryCountdown > 0 ? 'text-orange-300 border-orange-500/20 flex items-center gap-2' : 'text-[#00e5b0] border-[#00e5b0]/20'}`}>
          {retryCountdown > 0 && <Clock className="w-5 h-5 animate-pulse text-orange-400" />}
          {retryCountdown > 0 ? `Rate limited. Retrying automatically in ${retryCountdown}s...` : statusMessage}
        </div>
      )}

      {/* 2. Visual Style Section */}
      <div className="frosted-card p-6 sm:p-8 rounded-b-3xl shadow-2xl relative overflow-hidden -mt-2">
        <h2 className="text-xl font-syne font-bold mb-6 flex items-center gap-3 text-slate-100 tracking-wide relative z-10">
          <span className="bg-[#6c3fff] shadow-[0_0_15px_rgba(108,63,255,0.4)] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black">2</span>
          Choose a visual style
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 mb-8">
          {STYLES.map((style) => {
            const isSelected = selectedStyle?.id === style.id;
            return (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style)}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-dm font-bold transition-all duration-300 hover:-translate-y-[1px] ${
                  isSelected 
                    ? 'bg-[#180d33] border-[#6c3fff] text-white shadow-[0_0_15px_rgba(108,63,255,0.25)]' 
                    : 'bg-[#0a0710] border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#120a21] hover:text-slate-200'
                }`}
              >
                <span className="opacity-80 drop-shadow-md">{style.icon}</span>
                {style.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        <div className="flex justify-end relative z-10">
          <button
            onClick={handleGenerate}
            disabled={!userPrompt.trim() || !selectedStyle || isGenerating}
            className="flex items-center gap-2 ag-gradient-bg hover:brightness-110 border-0 text-[#05050a] px-8 py-3.5 rounded-xl font-syne font-bold text-[15px] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,229,176,0.3)] hover:-translate-y-[1px]"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            <span>Generate Image</span>
          </button>
        </div>
      </div>

      {/* 3. Output Section */}
      {generatedImage && (
        <div className="frosted-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-[#00e5b0]/20 animate-in fade-in zoom-in-95 duration-500 mt-8">
           <h2 className="text-xl font-syne font-bold mb-5 flex items-center gap-3 text-slate-100 tracking-wide">
            <span className="bg-[#00e5b0] text-[#05050a] w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-[0_0_15px_rgba(0,229,176,0.4)]">3</span>
            Your Masterpiece
          </h2>
          <div className="max-w-xl mx-auto rounded-xl overflow-hidden border border-white/5 shadow-2xl">
            <ImageCard imageUrl={generatedImage} prompt={userPrompt} />
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="flex justify-center items-center gap-8 sm:gap-16 pt-6 pb-2 text-center relative z-10 opacity-70">
        <div>
          <div className="text-2xl font-syne font-bold text-white mb-1">12.4k</div>
          <div className="text-[10px] font-dm uppercase tracking-wider text-slate-400">Images Created</div>
        </div>
        <div className="h-8 w-px bg-white/10"></div>
        <div>
          <div className="text-2xl font-syne font-bold text-white mb-1">4.2s</div>
          <div className="text-[10px] font-dm uppercase tracking-wider text-slate-400">Avg Render Time</div>
        </div>
        <div className="h-8 w-px bg-white/10"></div>
        <div>
          <div className="text-2xl font-syne font-bold text-white mb-1">7</div>
          <div className="text-[10px] font-dm uppercase tracking-wider text-slate-400">Styles Available</div>
        </div>
      </div>

    </div>
  );
};

export default WorkflowText;
