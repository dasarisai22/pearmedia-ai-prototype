import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WorkflowText from './components/WorkflowText';
import WorkflowImage from './components/WorkflowImage';

function App() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'image'

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {activeTab === 'text' ? 'Creative Studio' : 'Style Lab'}
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            {activeTab === 'text' 
              ? 'Enter a simple idea and let our AI prompt engineer craft a masterpiece description before generating your final image.' 
              : 'Upload an image to extract its core visual DNA—objects, style, and lighting—then automatically generate incredible stylistic variations.'}
          </p>
        </div>

        {activeTab === 'text' ? <WorkflowText /> : <WorkflowImage />}
      </main>

      <footer className="mt-20 py-8 text-center text-slate-500 text-sm">
        <p>Built for the Pear Media AI Prototype Assignment ✨</p>
      </footer>
    </div>
  );
}

export default App;
