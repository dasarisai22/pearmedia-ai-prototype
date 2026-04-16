import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="border-b border-white/5 z-50 frosted-card relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="bg-[#05050a] border border-[#6c3fff]/30 text-white w-10 h-10 rounded-sm flex items-center justify-center font-syne font-black text-lg relative overflow-hidden group">
              <div className="absolute inset-0 ag-gradient-bg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <span className="relative z-10">AG</span>
            </div>
            <div className="flex flex-col">
              <span className="font-syne font-bold text-lg tracking-wide text-white leading-tight">AntiGravity AI</span>
              <span className="font-dm text-[10px] font-bold tracking-[0.15em] text-[#00e5b0]/90 uppercase mt-0.5">Generative Studio</span>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="hidden md:flex space-x-2 bg-black/40 p-1.5 rounded-lg border border-white/5 shadow-inner">
            {[
              { id: 'text', label: 'Creative Studio' },
              { id: 'image', label: 'Style Lab' },
              { id: 'gallery', label: 'Gallery' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-sm font-dm rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white font-semibold shadow-sm backdrop-blur-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Action */}
          <div className="flex items-center flex-shrink-0">
            <button className="font-dm text-sm font-semibold text-slate-300 hover:text-white px-5 py-2.5 rounded-md border border-white/10 hover:bg-white/5 transition-all">
              Sign In
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
