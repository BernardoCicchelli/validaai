'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, AlertTriangle } from 'lucide-react';
import type { ValidAIResponse } from '@/types/api';
import { ResultDashboard } from '@/components/ResultDashboard';

const loadingPhrases = [
  "Assessing problem clarity...",
  "Evaluating differentiation...",
  "Analyzing market saturation...",
  "Identifying strategic risks...",
  "Structuring insights...",
];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<ValidAIResponse | null>(null);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  const handleAnalyze = async () => {
    if (!idea.trim()) return;

    setState('loading');

    // Setup phrase rotation
    const rotationInterval = setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) throw new Error('Failed to analyze');

      const data = await response.json();
      setResult(data);
      setState('success');
    } catch (error) {
      console.error(error);
      setState('error');
    } finally {
      clearInterval(rotationInterval);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-24 max-w-4xl mx-auto w-full relative">
      <AnimatePresence mode="wait">

        {/* IDLE STATE */}
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col gap-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-primary">
                Validate your idea<br />before you build it.
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                A strategic diagnostic engine that evaluates product ideas using structured frameworks. No fluff, just critical analysis.
              </p>
            </div>

            <div className="relative group">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your product idea, target audience, and how it solves their problem..."
                className="w-full min-h-[240px] p-6 text-lg rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y transition-all placeholder:text-muted-foreground/50 shadow-sm"
              />
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleAnalyze}
                  disabled={!idea.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  Analyze
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOADING STATE */}
        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center gap-8 h-[60vh]"
          >
            <div className="relative flex items-center justify-center w-24 h-24">
              <Loader2 className="w-12 h-12 text-muted-foreground animate-spin absolute" />
              <div className="w-24 h-24 rounded-full border-t border-primary/20 animate-[spin_3s_linear_infinite]" />
              <div className="w-16 h-16 rounded-full border-b border-primary/40 animate-[spin_2s_linear_infinite]" />
            </div>

            <div className="h-8 overflow-hidden relative w-full text-center">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={loadingPhrases[loadingPhraseIndex]}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-lg md:text-xl font-medium text-primary absolute w-full"
                >
                  {loadingPhrases[loadingPhraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 text-center max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-medium mb-2">Analysis Failed</h2>
              <p className="text-muted-foreground">We couldn't process your idea at this moment. Please try again.</p>
            </div>
            <button
              onClick={() => setState('idle')}
              className="bg-secondary text-secondary-foreground px-6 py-2 rounded-xl font-medium hover:bg-secondary/80 mt-4 border border-border"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {state === 'success' && result && (
          <ResultDashboard
            data={result}
            onReset={() => {
              setIdea("");
              setState('idle');
              setResult(null);
            }}
          />
        )}

      </AnimatePresence>
    </main>
  );
}
