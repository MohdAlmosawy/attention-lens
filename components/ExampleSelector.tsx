
import React from 'react';
import { ExampleSentence } from '../types';

interface ExampleSelectorProps {
  examples: ExampleSentence[];
  onSelect: (example: ExampleSentence) => void;
  activeId: string;
  disabled: boolean;
}

const ExampleSelector: React.FC<ExampleSelectorProps> = ({ examples, onSelect, activeId, disabled }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Select Scenario:</span>
      <div className="flex flex-wrap justify-center gap-2">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => onSelect(example)}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
              ${activeId === example.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'}`}
          >
            {example.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleSelector;
