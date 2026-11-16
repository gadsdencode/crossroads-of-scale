'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Layers, Network, Sliders } from 'lucide-react';
import {
  GOVERNANCE_CATEGORIES,
  SCALE_DIMENSIONS,
  SCALE_MULTIPLIER,
  type ActiveScales,
  type ScaleDimensionKey,
  type SpectrumFilter,
} from '@/lib/governance-data';
import { cn } from '@/lib/cn';

export interface ControlDeckProps {
  activeScales: ActiveScales;
  onToggleScale: (key: ScaleDimensionKey) => void;
  scaleMultiplier: number;
  onScaleMultiplierChange: (value: number) => void;
  selectedCategory: SpectrumFilter;
  onCategoryChange: (category: SpectrumFilter) => void;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090e]';

export function ControlDeck({
  activeScales,
  onToggleScale,
  scaleMultiplier,
  onScaleMultiplierChange,
  selectedCategory,
  onCategoryChange,
}: ControlDeckProps) {
  const reduceMotion = useReducedMotion();
  const filters: SpectrumFilter[] = ['ALL', ...GOVERNANCE_CATEGORIES];

  const handleMultiplier = (raw: string) => {
    const next = Number.parseFloat(raw);
    if (!Number.isFinite(next)) return;
    const clamped = Math.min(SCALE_MULTIPLIER.max, Math.max(SCALE_MULTIPLIER.min, next));
    onScaleMultiplierChange(clamped);
  };

  return (
    <aside className="lg:col-span-4 space-y-6 min-w-0">
      <motion.section
        className="glass-panel p-5"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut', delay: 0.05 }}
      >
        <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          Modular Scale Dimensions
        </h2>
        <div className="space-y-3">
          {SCALE_DIMENSIONS.map((dimension) => {
            const isActive = activeScales[dimension.key];
            return (
              <button
                key={dimension.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => onToggleScale(dimension.key)}
                className={cn(
                  'w-full text-left p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer',
                  FOCUS_RING,
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow-sm shadow-indigo-900/20'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500 hover:border-slate-700',
                )}
              >
                <span>
                  <span className="block font-medium text-sm">{dimension.label}</span>
                  <span className="block text-xs text-slate-400 mt-0.5">{dimension.description}</span>
                </span>
                <span
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center border shrink-0',
                    isActive
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'border-slate-700 bg-slate-900',
                  )}
                  aria-hidden="true"
                >
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                </span>
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        className="glass-panel p-5"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut', delay: 0.12 }}
      >
        <div className="flex justify-between items-center gap-3 mb-3">
          <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            Scale Stress Simulator
          </h2>
          <span className="font-mono text-xs tabular-nums text-indigo-400 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-900">
            {scaleMultiplier.toFixed(1)}x Factor
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4" id="scale-stress-hint">
          Push the systemic scale multiplier to observe threshold failures across all models.
        </p>
        <input
          type="range"
          min={SCALE_MULTIPLIER.min}
          max={SCALE_MULTIPLIER.max}
          step={SCALE_MULTIPLIER.step}
          value={scaleMultiplier}
          aria-label="Scale stress multiplier"
          aria-describedby="scale-stress-hint"
          aria-valuemin={SCALE_MULTIPLIER.min}
          aria-valuemax={SCALE_MULTIPLIER.max}
          aria-valuenow={Number(scaleMultiplier.toFixed(1))}
          aria-valuetext={`${scaleMultiplier.toFixed(1)} times scale factor`}
          onChange={(event) => handleMultiplier(event.target.value)}
          className="w-full accent-indigo-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 gap-2">
          <span>Local / Tribal (1.0x)</span>
          <span>National (3.0x)</span>
          <span>Planetary (5.0x)</span>
        </div>
      </motion.section>

      <motion.section
        className="glass-panel p-5"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut', delay: 0.18 }}
      >
        <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-3 flex items-center gap-2">
          <Network className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          Governance Spectrum
        </h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter governance spectrum">
          {filters.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  FOCUS_RING,
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200',
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </motion.section>
    </aside>
  );
}
