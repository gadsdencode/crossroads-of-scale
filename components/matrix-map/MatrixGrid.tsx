'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Globe2 } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import type { GovernanceModel, SimulationResult } from '@/lib/governance-data';
import { cn } from '@/lib/cn';

export interface MatrixGridProps {
  models: GovernanceModel[];
  results: ReadonlyMap<string, SimulationResult>;
  selectedModelId: string;
  onSelect: (modelId: string) => void;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090e]';

export function MatrixGrid({ models, results, selectedModelId, onSelect }: MatrixGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="glass-panel relative overflow-hidden p-6 min-h-[420px] flex flex-col"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: 'easeOut', delay: 0.08 }}
      aria-label="Governance matrix"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mb-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-200">The Crossroads Map</h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any model card below to inspect its systemic failure modes and stress vectors.
          </p>
        </div>
        <div className="self-start shrink-0 text-xs font-mono text-slate-500 flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
          <Globe2 className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
          Interactive Matrix Grid
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto relative">
        <AnimatePresence mode="popLayout">
          {models.map((model, index) => {
            const result = results.get(model.id);
            if (!result) return null;

            const isSelected = selectedModelId === model.id;

            return (
              <motion.button
                key={model.id}
                type="button"
                layout
                aria-pressed={isSelected}
                onClick={() => onSelect(model.id)}
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.28,
                  ease: 'easeOut',
                  delay: reduceMotion ? 0 : index * 0.04,
                }}
                className={cn(
                  'p-4 rounded-xl border text-left cursor-pointer flex flex-col justify-between transition-colors',
                  FOCUS_RING,
                  isSelected
                    ? 'bg-indigo-950/30 border-indigo-500 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950',
                )}
              >
                <span>
                  <span className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                      {model.category}
                    </span>
                    <StatusBadge status={result.status} />
                  </span>
                  <span className="block font-bold text-slate-100 text-base mb-1">{model.name}</span>
                  <span className="block text-xs text-slate-400 line-clamp-2">{model.description}</span>
                </span>

                <span className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span className="tabular-nums">Coord. Drag: {result.stress.coordinationOverhead}%</span>
                  <span className="text-indigo-400 flex items-center gap-1">
                    Inspect <ChevronRight className="w-3 h-3" aria-hidden="true" />
                  </span>
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
