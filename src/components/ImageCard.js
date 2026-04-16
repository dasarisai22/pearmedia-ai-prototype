import React from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const ImageCard = ({ imageUrl, prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `pear-media-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download image", err);
      // Fallback
      window.open(imageUrl, '_blank');
    }
  };

  if (!imageUrl) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 group">
      <div className="relative aspect-square bg-slate-100">
        <img 
          src={imageUrl} 
          alt="Generated AI art" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            onClick={handleDownload}
            className="p-3 select-none bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 font-medium"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
        </div>
      </div>
      
      {prompt && (
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex justify-between items-start gap-4">
            <p className="text-sm text-slate-600 line-clamp-2" title={prompt}>
              {prompt}
            </p>
            <button 
              onClick={handleCopy}
              className="text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0"
              title="Copy prompt"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
