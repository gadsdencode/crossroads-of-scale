'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, BarChart3, HelpCircle } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import {
  SCALE_MULTIPLIER,
  describeActiveScales,
  type ActiveScales,
  type GovernanceModel,
  type SimulationResult,
  type StressVectors,
} from '@/lib/governance-data';
import { cn } from '@/lib/cn';

export interface XRayInspectorProps {
  model: GovernanceModel;
  result: SimulationResult;
  activeScales: ActiveScales;
  scaleMultiplier: number;
}

const STRESS_BARS: { key: keyof StressVectors; label: string; color: string }[] = [
  { key: 'coordinationOverhead', label: 'Coordination Overhead', color: 'bg-indigo-500' },
  { key: 'informationLatency', label: 'Information Latency', color: 'bg-purple-500' },
  { key: 'cohesionCost', label: 'Cohesion / Coercion Cost', color: 'bg-pink-500' },
  { key: 'resourceMisallocation', label: 'Resource Misallocation', color: 'bg-cyan-500' },
];

export function XRayInspector({ model, result, activeScales, scaleMultiplier }: XRayInspectorProps) {
  const reduceMotion = useReducedMotion();
  const emphasis =
    scaleMultiplier > SCALE_MULTIPLIER.default + 0.05
      ? 'over'
      : scaleMultiplier < SCALE_MULTIPLIER.default - 0.05
        ? 'under'
        : 'balanced';

  const barTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 140, damping: 22 };

  return (
    <motion.section
      id="xray-inspector"
      className="glass-panel p-6 scroll-mt-6"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: 'easeOut', delay: 0.14 }}
      aria-label="X-ray inspector"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={model.id}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-800 gap-3 mb-6">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                X-Ray Inspector Analysis
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{model.name}</h2>
              <p className="text-xs text-slate-400 mt-1">
                {describeActiveScales(activeScales)} at {scaleMultiplier.toFixed(1)}x. Stress index{' '}
                <span className="tabular-nums text-slate-200">{result.status.score}</span>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={result.status} />
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-950 border border-indigo-900 text-indigo-300">
                Spectrum: {model.category}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <article
                className={cn(
                  'p-4 rounded-xl border transition-colors duration-300',
                  emphasis === 'over' && 'bg-red-950/35 border-red-700/70',
                  emphasis === 'under' && 'bg-red-950/10 border-red-900/25 opacity-75',
                  emphasis === 'balanced' && 'bg-red-950/20 border-red-900/40',
                )}
              >
                <h3 className="text-xs font-semibold text-red-300 uppercase tracking-wide flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
                  Oversized Failure Mode
                  {emphasis === 'over' && (
                    <span className="ml-auto font-mono normal-case tracking-normal text-[10px] text-red-300/80">
                      Dominant
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{model.failureModes.oversized}</p>
              </article>

              <article
                className={cn(
                  'p-4 rounded-xl border transition-colors duration-300',
                  emphasis === 'under' && 'bg-amber-950/35 border-amber-700/70',
                  emphasis === 'over' && 'bg-amber-950/10 border-amber-900/25 opacity-75',
                  emphasis === 'balanced' && 'bg-amber-950/20 border-amber-900/40',
                )}
              >
                <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wide flex items-center gap-2 mb-1">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                  Undersized Failure Mode
                  {emphasis === 'under' && (
                    <span className="ml-auto font-mono normal-case tracking-normal text-[10px] text-amber-300/80">
                      Dominant
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{model.failureModes.undersized}</p>
              </article>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                  Systemic Stress Vectors
                </h3>
                <div className="space-y-3 text-xs font-mono">
                  {STRESS_BARS.map((bar) => {
                    const live = result.stress[bar.key];
                    const baseline = model.stressVectors[bar.key];
                    const delta = live - baseline;

                    return (
                      <div key={bar.key}>
                        <div className="flex justify-between items-baseline gap-3 mb-1 text-slate-400">
                          <span>{bar.label}</span>
                          <span className="tabular-nums text-slate-200 shrink-0">
                            {live}%
                            {delta !== 0 && (
                              <span className={delta > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                                {' '}
                                {delta > 0 ? `+${delta}` : delta}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <motion.div
                            className={cn('h-full rounded-full', bar.color)}
                            initial={false}
                            animate={{ width: `${live}%` }}
                            transition={barTransition}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-3 leading-relaxed">
                  Deltas compare against the {SCALE_MULTIPLIER.default.toFixed(1)}x reference with all
                  dimensions engaged.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                  Historical Precedents
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {model.historicalPrecedents.map((precedent) => (
                    <span
                      key={precedent}
                      className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                    >
                      {precedent}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
