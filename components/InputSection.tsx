import React, { useState, useCallback } from 'react';

interface InputSectionProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState("An isometric vector illustration of a commercial airplane flying above stylized clouds, blue and white color palette");

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  }, [prompt, onGenerate]);

  return (
    <section className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
        <div className="relative flex items-stretch bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the SVG you want to create..."
            className="flex-grow px-6 py-4 text-lg text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className={`px-8 font-semibold text-white transition-all duration-200 flex items-center gap-2
              ${isGenerating 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Crafting...</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </>
            )}
          </button>
        </div>
      </form>
      <div className="mt-3 flex gap-2 text-xs text-slate-500 overflow-x-auto pb-2">
        <span className="font-semibold uppercase tracking-wider text-slate-400 mr-1">Try:</span>
        {[
          "Flat design paper airplane",
          "Neon cyber-punk drone",
          "Vintage biplane sketch",
          "Simple line art jet"
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setPrompt(suggestion)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full whitespace-nowrap transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
};