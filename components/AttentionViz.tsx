
import React, { useRef, useState, useLayoutEffect, useCallback, useMemo, useEffect } from 'react';
import { ExampleSentence } from '../types';
import { inputWords } from '../constants';

interface AttentionVizProps {
  example: ExampleSentence | null;
  currentStepIndex: number;
  isTranslating: boolean;
}

interface Point {
  x: number;
  y: number;
}

const AttentionViz: React.FC<AttentionVizProps> = ({ example, currentStepIndex, isTranslating }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const outputRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [lineData, setLineData] = useState<{ start: Point; ends: Point[]; weights: number[] } | null>(null);

  // States for interaction
  const [hoveredInputIdx, setHoveredInputIdx] = useState<number | null>(null);
  const [hoveredOutputIdx, setHoveredOutputIdx] = useState<number | null>(null);
  const [clickedIdx, setClickedIdx] = useState<number | null>(null);

  // Reset internal selection states when switching examples or modes
  useEffect(() => {
    setClickedIdx(null);
    setHoveredOutputIdx(null);
  }, [isTranslating, example]);

  // Determine the "active" index for the visualization logic (lines + input heatmap).
  const activeIdx = useMemo(() => {
    if (!example) return -1;
    if (hoveredOutputIdx !== null) return hoveredOutputIdx;
    if (clickedIdx !== null) return clickedIdx;
    if (isTranslating && currentStepIndex >= 0) return currentStepIndex;
    return -1;
  }, [hoveredOutputIdx, clickedIdx, isTranslating, currentStepIndex, example]);

  const currentWeights = useMemo(() => 
    (example && activeIdx >= 0) 
      ? example.outputSteps[activeIdx].weights 
      : inputWords.map(() => 0)
  , [activeIdx, example]);

  const updateLines = useCallback(() => {
    if (!containerRef.current || activeIdx < 0 || !example) {
      setLineData(null);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const activeOutputEl = outputRefs.current[activeIdx];

    if (!activeOutputEl) return;

    const outRect = activeOutputEl.getBoundingClientRect();
    const startPoint: Point = {
      x: outRect.left + outRect.width / 2 - containerRect.left,
      y: outRect.top - containerRect.top,
    };

    const endPoints: Point[] = inputRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const inRect = el.getBoundingClientRect();
      return {
        x: inRect.left + inRect.width / 2 - containerRect.left,
        y: inRect.bottom - containerRect.top,
      };
    });

    setLineData({
      start: startPoint,
      ends: endPoints,
      weights: example.outputSteps[activeIdx].weights,
    });
  }, [activeIdx, example]);

  useLayoutEffect(() => {
    updateLines();
    const timer = setTimeout(updateLines, 100);
    window.addEventListener('resize', updateLines);
    return () => {
      window.removeEventListener('resize', updateLines);
      clearTimeout(timer);
    };
  }, [updateLines]);

  const getTopContextWords = (stepIdx: number) => {
    if (!example) return [];
    const weights = example.outputSteps[stepIdx].weights;
    return weights
      .map((w, i) => ({ word: inputWords[i], weight: w }))
      .filter(item => item.weight > 0.02)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);
  };

  const handleOutputClick = (idx: number) => {
    setClickedIdx(prev => prev === idx ? null : idx);
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative flex flex-col gap-8 p-6 md:p-10 overflow-hidden transition-all duration-500 ${example ? 'min-h-[600px]' : 'min-h-[200px]'}`}
    >
      {/* SVG Layer for Attention Flow */}
      {example && (
        <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
          {lineData && lineData.ends.map((end, idx) => {
            const weight = lineData.weights[idx];
            if (weight < 0.02) return null; 
            
            return (
              <path
                key={`line-${idx}`}
                d={`M ${lineData.start.x} ${lineData.start.y} C ${lineData.start.x} ${lineData.start.y - 120}, ${end.x} ${end.y + 120}, ${end.x} ${end.y}`}
                fill="none"
                stroke="#2563eb"
                strokeWidth={Math.max(1.5, weight * 15)}
                strokeOpacity={Math.max(0.15, weight)}
                className="transition-all duration-700 ease-in-out"
              />
            );
          })}
        </svg>
      )}

      {/* Input Sentence Area - ALWAYS VISIBLE */}
      <div className="space-y-4 z-10">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">
          English Input Paragraph
        </label>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 leading-relaxed">
          {inputWords.map((word, idx) => {
            const weight = currentWeights[idx] || 0;
            const isHovered = hoveredInputIdx === idx;
            
            return (
              <div key={`in-wrapper-${idx}`} className="relative">
                <span
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  onMouseEnter={() => setHoveredInputIdx(idx)}
                  onMouseLeave={() => setHoveredInputIdx(null)}
                  className="relative px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-slate-100 bg-white font-semibold text-sm md:text-base lg:text-lg transition-all duration-500 cursor-help select-none inline-block"
                  style={{
                    backgroundColor: `rgba(37, 99, 235, ${weight})`,
                    color: weight > 0.4 ? 'white' : 'inherit',
                    borderColor: weight > 0.2 ? 'transparent' : undefined,
                    transform: weight > 0.5 || isHovered ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: weight > 0.3 || isHovered ? '0 10px 15px -3px rgba(37, 99, 235, 0.2)' : 'none',
                    zIndex: isHovered ? 50 : 1
                  }}
                >
                  {word}
                </span>
                
                {isHovered && activeIdx >= 0 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded shadow-xl whitespace-nowrap z-[100] animate-in fade-in zoom-in duration-200">
                    Attention Weight: {Math.round(weight * 100)}%
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {example && <div className="h-24 pointer-events-none"></div>}

      {/* Output Sentence Area (RTL) - ONLY VISIBLE IF SCENARIO SELECTED */}
      {example && (
        <div className="space-y-4 z-10">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">
            {isTranslating ? 'Demo: Token-by-Token Generation' : 'Exploration Mode: Hover or Click a Word'}
          </label>
          <div className="flex flex-row flex-wrap justify-center gap-2 md:gap-3 min-h-[120px]" dir="rtl">
            {example.outputSteps.map((step, idx) => {
              const isVisible = isTranslating ? idx <= currentStepIndex : true;
              const isCurrentDemo = isTranslating && idx === currentStepIndex;
              const isClicked = clickedIdx === idx;
              const isHovered = hoveredOutputIdx === idx;
              
              const isActivePill = isHovered || isClicked || isCurrentDemo;
              const topContext = isHovered && isVisible ? getTopContextWords(idx) : [];
              
              return (
                <div key={`out-wrapper-${idx}`} className="relative">
                  <span
                    ref={(el) => { outputRefs.current[idx] = el; }}
                    onMouseEnter={() => isVisible && setHoveredOutputIdx(idx)}
                    onMouseLeave={() => setHoveredOutputIdx(null)}
                    onClick={() => isVisible && handleOutputClick(idx)}
                    className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg arabic-text font-bold text-sm md:text-base lg:text-lg transition-all duration-500 transform cursor-pointer select-none border inline-block
                      ${isVisible 
                        ? 'opacity-100 translate-y-0 shadow-sm' 
                        : 'opacity-0 translate-y-4 pointer-events-none'}
                      ${isActivePill 
                        ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-100 scale-110 z-20 shadow-2xl' 
                        : 'bg-slate-800 text-white opacity-20 scale-100 z-10 border-transparent'}
                      ${isHovered && !isActivePill ? 'opacity-100' : ''}`}
                  >
                    {step.outputWord}
                  </span>

                  {isHovered && topContext.length > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-2xl z-[100] min-w-[140px] text-center animate-in fade-in slide-in-from-bottom-2 duration-300" dir="ltr">
                      <div className="font-bold text-blue-400 border-b border-slate-700 pb-1 mb-1 uppercase tracking-tighter text-[9px]">Model Context</div>
                      <div className="flex flex-col gap-0.5">
                        {topContext.map((c, ci) => (
                          <div key={ci} className="flex justify-between gap-3">
                            <span className="italic">"{c.word.replace(/[.,]/g, '')}"</span>
                            <span className="font-mono text-blue-300">{Math.round(c.weight * 100)}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-slate-900" />
                    </div>
                  )}
                </div>
              );
            })}
            {!isTranslating && activeIdx === -1 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-slate-300 italic text-lg animate-pulse">
                  Explore the translation by hovering over or clicking Arabic words above.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {!example && (
        <div className="py-8 flex items-center justify-center">
          <p className="text-slate-400 italic text-center max-w-md">
            Please select a scenario above to see the translation and the model's focus patterns.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttentionViz;
