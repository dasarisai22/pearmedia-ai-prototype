import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WorkflowText from './components/WorkflowText';
import WorkflowImage from './components/WorkflowImage';

function App() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'image'

  return (
    <div className="font-dm text-slate-200 min-h-[100vh] flex flex-col relative overflow-x-hidden">
      <div className="ag-grid-overlay"></div>
      <div className="ag-orb-violet"></div>
      <div className="ag-orb-teal"></div>
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 w-full max-w-[500px] lg:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10">
        <div className="mb-14 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 frosted-card text-xs font-semibold text-slate-300 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00e5b0] mr-3 animate-pulse"></span>
            Now in beta
          </div>
          
          <h1 className="font-syne text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight w-full drop-shadow-xl leading-tight">
            {activeTab === 'text' ? 'Creative ' : 'Style '}
            <span className="ag-gradient-text">Studio</span>
          </h1>
          
          <p className="text-slate-400 max-w-[500px] mx-auto text-[17px] font-light leading-relaxed">
            {activeTab === 'text' 
              ? 'Enter a simple idea and let our AI craft a masterpiece description before generating your final image.' 
              : 'Upload an image to extract its core visual DNA—objects, style, and lighting—then automatically generate incredible stylistic variations.'}
          </p>
        </div>

        {activeTab === 'text' ? <WorkflowText /> : <WorkflowImage />}
      </main>

      <footer className="py-8 text-center text-slate-600 text-xs font-dm font-bold uppercase tracking-[0.2em] z-10 w-full opacity-60">
        <p>AntiGravity AI Studio • V1.0 Beta</p>
      </footer>
    </div>
  );
}

export default App;
