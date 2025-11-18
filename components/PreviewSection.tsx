import React, { useState, useEffect } from 'react';
import { SvgGenerationResponse, ViewMode } from '../types';

interface PreviewSectionProps {
  data: SvgGenerationResponse | null;
  isLoading: boolean;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({ data, isLoading }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PREVIEW);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (data) {
      // Reset view to preview when new data arrives
      setViewMode(ViewMode.PREVIEW);
    }
  }, [data]);

  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([data.svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.svgCode);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 min-h-[400px] flex flex-col items-center justify-center space-y-6 animate-pulse">
        <div className="w-24 h-24 bg-slate-200 rounded-full"></div>
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
        <div className="h-3 w-64 bg-slate-100 rounded"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed p-12 min-h-[400px] flex flex-col items-center justify-center text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <p className="text-lg font-medium">Ready to create</p>
        <p className="text-sm">Enter a prompt above to generate your SVG asset.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{data.title}</h2>
          <p className="text-sm text-slate-500 truncate max-w-md">{data.description}</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-slate-200 rounded-lg p-1 mr-2">
            <button
              onClick={() => setViewMode(ViewMode.PREVIEW)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === ViewMode.PREVIEW ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setViewMode(ViewMode.CODE)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === ViewMode.CODE ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Code
            </button>
          </div>
          
          <button
            onClick={handleCopy}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative group"
            title="Copy Code"
          >
            {copyFeedback ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download SVG
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[500px] h-full">
        {viewMode === ViewMode.PREVIEW ? (
          <div className="w-full h-full min-h-[500px] bg-checkerboard flex items-center justify-center p-8 overflow-hidden relative">
             {/* Zoom controls could go here, but keeping it simple: just fit to container */}
             <div 
                className="w-full h-full max-w-[600px] max-h-[600px] flex items-center justify-center drop-shadow-xl"
                dangerouslySetInnerHTML={{ __html: data.svgCode }}
             />
          </div>
        ) : (
          <div className="w-full h-full min-h-[500px] bg-slate-900 overflow-auto">
             <pre className="p-6 text-sm font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
              <code>{data.svgCode}</code>
             </pre>
          </div>
        )}
      </div>
    </div>
  );
};