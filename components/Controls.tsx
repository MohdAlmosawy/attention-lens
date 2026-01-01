
import React from 'react';

interface ControlsProps {
  onTranslate: () => void;
  onNextWord: () => void;
  onReset: () => void;
  isTranslating: boolean;
  isFinished: boolean;
  canStepForward: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onTranslate, 
  onNextWord, 
  onReset, 
  isTranslating, 
  isFinished,
  canStepForward 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {!isTranslating ? (
        <button
          onClick={onTranslate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Start Translation
        </button>
      ) : (
        <>
          <button
            onClick={onNextWord}
            disabled={!canStepForward}
            className={`px-8 py-3 rounded-xl font-bold transition-all transform flex items-center gap-2 shadow-lg
              ${canStepForward 
                ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            {isFinished ? 'Complete' : 'Generate Next Word'}
          </button>
          
          <button
            onClick={onReset}
            className="bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </>
      )}
    </div>
  );
};

export default Controls;
