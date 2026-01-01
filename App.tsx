
import React, { useState, useCallback } from 'react';
import { EXAMPLES } from './constants';
import { ExampleSentence } from './types';
import Header from './components/Header';
import ExampleSelector from './components/ExampleSelector';
import AttentionViz from './components/AttentionViz';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<ExampleSentence | null>(null);
  // Default to -1 so no word is selected initially in exploration mode
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const handleSelectExample = useCallback((example: ExampleSentence) => {
    setSelectedExample(prev => {
      // Toggle off if clicking the same one
      if (prev?.id === example.id) {
        setCurrentStepIndex(-1);
        setIsTranslating(false);
        return null;
      }
      // Switch to new one
      setCurrentStepIndex(-1);
      setIsTranslating(false);
      return example;
    });
  }, []);

  const handleStartTranslate = useCallback(() => {
    setIsTranslating(true);
    setCurrentStepIndex(0); // Start demo from first word
  }, []);

  const handleNextWord = useCallback(() => {
    if (selectedExample && currentStepIndex < selectedExample.outputSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, selectedExample]);

  const handleReset = useCallback(() => {
    // Return to exploration mode with no selection
    setCurrentStepIndex(-1);
    setIsTranslating(false);
  }, []);

  const isFinished = selectedExample ? currentStepIndex === selectedExample.outputSteps.length - 1 : false;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8 bg-slate-50">
      <div className="max-w-6xl w-full flex flex-col gap-8">
        <Header />

        <ExampleSelector 
          examples={EXAMPLES} 
          onSelect={handleSelectExample} 
          activeId={selectedExample?.id || ''} 
          disabled={isTranslating}
        />

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {selectedExample && (
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <Controls 
                onTranslate={handleStartTranslate}
                onNextWord={handleNextWord}
                onReset={handleReset}
                isTranslating={isTranslating}
                isFinished={isFinished}
                canStepForward={isTranslating && !isFinished}
              />
            </div>
          )}
          
          <AttentionViz 
            example={selectedExample}
            currentStepIndex={currentStepIndex}
            isTranslating={isTranslating}
          />
        </div>

        <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-sm text-blue-800 leading-relaxed shadow-sm">
          <h3 className="font-bold mb-2 uppercase tracking-wider text-xs">The Bat Mystery: Local vs. Global Context</h3>
          <p className="mb-3 italic">
            "I noticed a man holding a bat... it was a live bat... panic break out."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="font-bold text-red-700 mb-1">1. Sequential Failure (Local Focus)</h4>
              <p>
                A standard model translates "bat" as <strong>مضرب (Sports Bat)</strong> initially because it doesn't "look ahead". 
                By the time it sees "live" and "panic" at the end, the early sentences are already translated inconsistently, creating a confusing story.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-green-700 mb-1">2. Attention Success (Global Gaze)</h4>
              <p>
                The Attention mechanism allows the model to look at the words <strong>"live"</strong> and <strong>"panic"</strong> <em>even while</em> 
                translating the very first sentence. It understands the "bat" is an animal <strong>(خفاش)</strong> immediately, 
                ensuring global coherence across the entire text.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
