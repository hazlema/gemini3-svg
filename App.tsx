import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { PreviewSection } from './components/PreviewSection';
import { generateSvg } from './services/gemini';
import { GenerationState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const handleGenerate = async (prompt: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await generateSvg(prompt);
      setState({
        isLoading: false,
        error: null,
        data: result,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header />
      
      <main className="flex-grow flex flex-col items-center px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Vector Graphics, <span className="text-blue-600">Reimagined</span>
          </h2>
          <p className="text-lg text-slate-600">
            Describe any shape, icon, or illustration, and watch AI write the SVG code for you in seconds.
          </p>
        </div>

        <InputSection onGenerate={handleGenerate} isGenerating={state.isLoading} />

        {state.error && (
          <div className="w-full max-w-3xl mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <p>{state.error}</p>
          </div>
        )}

        <PreviewSection data={state.data} isLoading={state.isLoading} />
        
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AI SVG Architect. Generated images are yours to use.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;