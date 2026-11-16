'use client';

import { useMemo, useState } from 'react';
import { ControlDeck } from '@/components/control-deck/ControlDeck';
import { Header } from '@/components/Header';
import { XRayInspector } from '@/components/inspector/XRayInspector';
import { MatrixGrid } from '@/components/matrix-map/MatrixGrid';
import {
  DEFAULT_ACTIVE_SCALES,
  DEFAULT_MODEL_ID,
  GOVERNANCE_MODELS,
  SCALE_MULTIPLIER,
  computeSimulation,
  filterModels,
  type ActiveScales,
  type ScaleDimensionKey,
  type SimulationResult,
  type SpectrumFilter,
} from '@/lib/governance-data';

function scrollInspectorIntoView() {
  const node = document.getElementById('xray-inspector');
  if (!node) return;

  const rect = node.getBoundingClientRect();
  const inView = rect.top < window.innerHeight - 48 && rect.bottom > 80;
  if (inView) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export default function CrossroadsMatrixApp() {
  const [activeScales, setActiveScales] = useState<ActiveScales>({ ...DEFAULT_ACTIVE_SCALES });
  const [selectedCategory, setSelectedCategory] = useState<SpectrumFilter>('ALL');
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(SCALE_MULTIPLIER.default);
  const [selectedId, setSelectedId] = useState(DEFAULT_MODEL_ID);

  const visibleModels = useMemo(() => filterModels(selectedCategory), [selectedCategory]);

  const results = useMemo(() => {
    const next = new Map<string, SimulationResult>();
    for (const model of GOVERNANCE_MODELS) {
      next.set(model.id, computeSimulation(model, activeScales, scaleMultiplier));
    }
    return next;
  }, [activeScales, scaleMultiplier]);

  const selectedModel =
    GOVERNANCE_MODELS.find((model) => model.id === selectedId) ?? GOVERNANCE_MODELS[0];

  const selectedResult =
    results.get(selectedModel.id) ?? computeSimulation(selectedModel, activeScales, scaleMultiplier);

  const toggleScale = (key: ScaleDimensionKey) => {
    setActiveScales((current) => ({ ...current, [key]: !current[key] }));
  };

  const selectModel = (modelId: string) => {
    setSelectedId(modelId);
    requestAnimationFrame(scrollInspectorIntoView);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      <Header />
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ControlDeck
          activeScales={activeScales}
          onToggleScale={toggleScale}
          scaleMultiplier={scaleMultiplier}
          onScaleMultiplierChange={setScaleMultiplier}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="lg:col-span-8 space-y-6 min-w-0">
          <MatrixGrid
            models={visibleModels}
            results={results}
            selectedModelId={selectedModel.id}
            onSelect={selectModel}
          />
          <XRayInspector
            model={selectedModel}
            result={selectedResult}
            activeScales={activeScales}
            scaleMultiplier={scaleMultiplier}
          />
        </div>
      </main>
    </div>
  );
}
