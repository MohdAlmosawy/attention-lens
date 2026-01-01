
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center space-y-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
        Understanding <span className="text-blue-600">Attention</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Modern language models don't just process words in a line. 
        The <strong>attention mechanism</strong> allows them to dynamically "look back" 
        at the most relevant parts of a sentence when generating each new word.
      </p>
    </header>
  );
};

export default Header;
