import React from 'react';
import { TerraSuggestion } from '../types';

interface AIHelperProps {
  tip: string;
  isLoading: boolean;
  onRefresh: () => void;
  onAnalyze: () => void;
  suggestion: TerraSuggestion | null;
  onApplySuggestion: () => void;
}

const AIHelper: React.FC<AIHelperProps> = ({ tip, isLoading, onRefresh, onAnalyze, suggestion, onApplySuggestion }) => {
  return (
    <div className="bg-slate-900/50 p-4 rounded-lg flex flex-col gap-3 ring-1 ring-slate-700">
      <div className="flex gap-4 items-start">
        <div className="text-5xl flex-shrink-0 pt-1">🤖</div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-green-300">AI Assistant Terra</h3>
            <button onClick={onRefresh} disabled={isLoading} className="text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-wait transition" title="Get a new tip or fact">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 013.5 9" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-slate-300 mt-2 min-h-[60px]">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <span className="ml-2">Thinking...</span>
              </div>
            ) : (
              `"${tip}"`
            )}
          </div>
        </div>
      </div>
      {suggestion && !isLoading && (
        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
            <p className="text-sm text-green-200 mb-2">💡 Suggestion: "{suggestion.message}"</p>
            <button
                onClick={onApplySuggestion}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
                Apply Suggestion
            </button>
        </div>
      )}
      <button 
        onClick={onAnalyze} 
        disabled={isLoading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:cursor-wait"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Farm'}
      </button>
    </div>
  );
};

export default AIHelper;
