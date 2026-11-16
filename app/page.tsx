'main client component'
'use client';

import React, { useState } from 'react';
import { GOVERNANCE_MODELS, GovernanceModel } from '@/lib/governance-data';
import { 
  Sliders, ShieldAlert, Cpu, Network, Activity, 
  Layers, RefreshCw, AlertTriangle, CheckCircle2, 
  HelpCircle, ChevronRight, BarChart3, Globe2 
} from 'lucide-react';

export default function CrossroadsMatrixApp() {
  const [activeScales, setActiveScales] = useState({
    population: true,
    geographicSpan: true,
    economicComplexity: true,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(2.2);
  const [selectedModel, setSelectedModel] = useState<GovernanceModel>(GOVERNANCE_MODELS[2]); // Default to Representative Republic

  const toggleScale = (key: keyof typeof activeScales) => {
    setActiveScales(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredModels = GOVERNANCE_MODELS.filter(m => {
    if (selectedCategory === 'ALL') return true;
    return m.category === selectedCategory;
  });

  const calculateStatus = (model: GovernanceModel, mult: number) => {
    const activeCount = Object.values(activeScales).filter(Boolean).length;
    const baseScore = (model.stressVectors.coordinationOverhead + model.stressVectors.informationLatency) / 2;
    const adjusted = baseScore * (mult / 2) * (activeCount / 3);

    if (adjusted > 75) return { label: 'CRITICAL FAILURE', color: 'text-red-400 bg-red-950/50 border-red-800', dot: 'bg-red-500 animate-pulse' };
    if (adjusted > 48) return { label: 'STRAINED', color: 'text-amber-400 bg-amber-950/50 border-amber-800', dot: 'bg-amber-500' };
    return { label: 'STABLE RANGE', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-800', dot: 'bg-emerald-500' };
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono tracking-widest uppercase mb-1">
            <Cpu className="w-4 h-4" /> Systems Architecture & Political Dynamics Simulator
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Crossroads of Scale
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Explore where governance models bend, scale, and collapse under structural pressures.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300 flex items-center gap-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Next.js 14 App Router Ready
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CONTROL DECK (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Scale Toggles Card */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Modular Scale Dimensions
            </h2>
            <div className="space-y-3">
              {[
                { key: 'population', label: 'Population Size', desc: 'Micro communities to global billions' },
                { key: 'geographicSpan', label: 'Geographic Span', desc: 'Face-to-face to interplanetary latency' },
                { key: 'economicComplexity', label: 'Economic Complexity', desc: 'Subsistence to hyper-financialized trade' },
              ].map(item => {
                const isActive = activeScales[item.key as keyof typeof activeScales];
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleScale(item.key as any)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isActive 
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow-sm shadow-indigo-900/20' 
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isActive ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scale Stress Simulator */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" /> Scale Stress Simulator
              </h2>
              <span className="font-mono text-xs text-indigo-400 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-900">
                {scaleMultiplier.toFixed(1)}x Factor
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Push the systemic scale multiplier to observe threshold failures across all models.
            </p>
            <input 
              type="range" 
              min="1.0" 
              max="5.0" 
              step="0.1"
              value={scaleMultiplier}
              onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
              <span>Local / Tribal (1.0x)</span>
              <span>National (3.0x)</span>
              <span>Planetary (5.0x)</span>
            </div>
          </div>

          {/* Spectrum Filters */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-3 flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-400" /> Governance Spectrum
            </h2>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'P2P', 'Democratic', 'Bureaucratic', 'Autocratic'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: MATRIX MAP & INSPECTOR (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Visual Matrix Grid */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden min-h-[420px] flex flex-col justify-between">
            <div className="absolute top-4 right-4 text-xs font-mono text-slate-500 flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
              <Globe2 className="w-3.5 h-3.5 text-indigo-400" /> Interactive Matrix Grid
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-slate-200">The Crossroads Map</h3>
              <p className="text-xs text-slate-400">Click any model card below to inspect its systemic failure modes and stress vectors.</p>
            </div>

            {/* Matrix Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
              {filteredModels.map(model => {
                const status = calculateStatus(model, scaleMultiplier);
                const isSelected = selectedModel.id === model.id;
                return (
                  <div 
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-indigo-950/30 border-indigo-500 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                          {model.category}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                          {status.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-100 text-base mb-1">{model.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{model.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400 font-mono">
                      <span>Coord. Drag: {model.stressVectors.coordinationOverhead}%</span>
                      <span className="text-indigo-400 flex items-center gap-1">Inspect <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-Ray Inspector Drawer */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-800 gap-2 mb-6">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">X-Ray Inspector Analysis</span>
                <h3 className="text-xl font-bold text-white">{selectedModel.name}</h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-950 border border-indigo-900 text-indigo-300">
                Spectrum: {selectedModel.category}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Failure Modes */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40">
                  <h4 className="text-xs font-semibold text-red-300 uppercase tracking-wide flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-400" /> Oversized Failure Mode
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedModel.failureModes.oversized}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40">
                  <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wide flex items-center gap-2 mb-1">
                    <HelpCircle className="w-4 h-4 text-amber-400" /> Undersized Failure Mode
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedModel.failureModes.undersized}</p>
                </div>
              </div>

              {/* Stress Vectors & Precedents */}
              <div className="space-y-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" /> Systemic Stress Vectors
                  </h4>
                  <div className="space-y-2.5 text-xs font-mono">
                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Coordination Overhead</span>
                        <span className="text-slate-200">{selectedModel.stressVectors.coordinationOverhead}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedModel.stressVectors.coordinationOverhead}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Information Latency</span>
                        <span className="text-slate-200">{selectedModel.stressVectors.informationLatency}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedModel.stressVectors.informationLatency}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Cohesion / Coercion Cost</span>
                        <span className="text-slate-200">{selectedModel.stressVectors.cohesionCost}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${selectedModel.stressVectors.cohesionCost}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">Historical Precedents</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedModel.historicalPrecedents.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
