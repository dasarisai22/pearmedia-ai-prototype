import React, { useState, useRef, useEffect } from 'react';
import { Upload, Search, Loader2, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { analyzeImage, generateImage } from '../utils/apiHelpers';
import ImageCard from './ImageCard';

const WorkflowImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState([]);
  
  const [statusMessage, setStatusMessage] = useState("");
  const [retryCountdown, setRetryCountdown] = useState(0);
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage("Error: Image too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(URL.createObjectURL(file));
      setBase64Image(reader.result);
      setAnalysisResult(null);
      setVariations([]);
      setStatusMessage("Image loaded. Ready for analysis!");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!base64Image) return;

    setIsAnalyzing(true);
    setStatusMessage("Analyzing image to extract style, colors, and objects...");
    setAnalysisResult(null);
    setVariations([]);
    
    try {
      const result = await analyzeImage(base64Image);
      setAnalysisResult(result);
      setStatusMessage("✅ Analysis complete! Ready to generate variations based on this metadata.");
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
      setIsAnalyzing(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (!analysisResult) return;

    setIsGenerating(true);
    setStatusMessage("Generating distinct stylistic variations... This will take a moment.");
    
    try {
      const prompts = [
        `Cinematic masterpiece of ${analysisResult.objects} in a ${analysisResult.style} style, ${analysisResult.lighting} lighting, ${analysisResult.colors} palette, ultra-detailed 8k.`,
        `A watercolor painting of ${analysisResult.objects}, vibrant ${analysisResult.colors} colors, beautiful flowing brushstrokes, dreamy ${analysisResult.lighting} atmosphere.`,
      ];

      const validImages = [];
      for (let i = 0; i < prompts.length; i++) {
        setStatusMessage(`Generating stylistic variation ${i + 1} of ${prompts.length}...`);
        try {
          const url = await generateImage(prompts[i]);
          validImages.push({ url, prompt: prompts[i] });
          setVariations([...validImages]); // show them as they generate
        } catch (err) {
          console.warn(`Variation ${i + 1} failed:`, err);
        }
      }

      if (validImages.length === 0) {
          throw new Error("Failed to generate variations. Hugging Face rate limit or model loading timeout.");
      }

      setStatusMessage(`✅ Successfully generated ${validImages.length} variations!`);
    } catch (err) {
      setStatusMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          Upload Image to Reverse-ngineer
        </h2>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-slate-50 ${selectedImage ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-300'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/jpeg, image/png, image/webp" 
            onChange={handleFileChange}
          />
          {selectedImage ? (
            <div className="flex flex-col items-center">
              <img src={selectedImage} alt="Preview" className="h-48 rounded-lg shadow-sm mb-4 object-contain" />
              <p className="text-sm text-indigo-600 font-medium">Click to select a different image</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <Upload className="w-10 h-10 mb-3 text-slate-400" />
              <p className="font-medium text-slate-700 mb-1">Click to upload or drag and drop</p>
              <p className="text-sm">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
            </div>
          )}
        </div>

        {selectedImage && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || isGenerating}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Analyze Image Signature
            </button>
          </div>
        )}
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-lg text-sm font-medium border ${statusMessage.startsWith("❌ Error:") ? 'bg-red-50 text-red-700 border-red-200' : statusMessage.includes("Rate limited") || retryCountdown > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
          <div className="flex items-center gap-2">
            {statusMessage.startsWith("❌ Error:") && <AlertCircle className="w-4 h-4" />}
            {retryCountdown > 0 && <Clock className="w-5 h-5 animate-pulse" />}
            {retryCountdown > 0 ? `Rate limited. Retrying automatically in ${retryCountdown}s...` : statusMessage}
          </div>
        </div>
      )}

      {/* 2. Analysis Result */}
      {analysisResult && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Visual Metadata Extracted
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Main Objects</p>
              <p className="text-slate-800">{analysisResult.objects || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Artistic Style</p>
              <p className="text-slate-800">{analysisResult.style || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Color Palette</p>
              <p className="text-slate-800">{analysisResult.colors || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Lighting</p>
              <p className="text-slate-800">{analysisResult.lighting || 'N/A'}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateVariations}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Style Variations
            </button>
          </div>
        </div>
      )}

      {/* 3. Output Variations */}
      {variations.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Stylistic Variations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {variations.map((v, idx) => (
              <ImageCard key={idx} imageUrl={v.url} prompt={v.prompt} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkflowImage;
