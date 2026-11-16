'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export function Header() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' }}
    >
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono tracking-widest uppercase mb-1">
          <Cpu className="w-4 h-4" aria-hidden="true" />
          Systems Architecture & Political Dynamics Simulator
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
          Crossroads of Scale
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl">
          Explore where governance models bend, scale, and collapse under structural pressures.
        </p>
      </div>
      <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300 flex items-center gap-2 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        Next.js 14 App Router Ready
      </div>
    </motion.header>
  );
}
