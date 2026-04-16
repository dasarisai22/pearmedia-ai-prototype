import React from 'react';
import { Sparkles, Layers } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800">Pear Media AI</span>
            </div>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <button
                onClick={() => setActiveTab('text')}
                className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'text' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Creative Studio
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'image' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Layers className="w-4 h-4 mr-2" />
                Style Lab
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="sm:hidden flex space-x-2 pb-3">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex justify-center items-center px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'text' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Studio
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 flex justify-center items-center px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'image' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 mr-2" />
              Style Lab
            </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
