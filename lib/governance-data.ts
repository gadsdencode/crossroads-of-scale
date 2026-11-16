/**
 * Governance catalogue and scale-stress engine.
 *
 * Authored `stressVectors` are the reading at the reference operating point:
 * every scale dimension engaged, multiplier 2.2x. Toggling a dimension or
 * moving the slider deforms that reading. Each vector listens to Population,
 * Geographic Span, and Economic Complexity with a different load profile, and
 * each model couples to those dimensions with its own weights, so the curves
 * diverge instead of scaling in lockstep.
 */

export interface ScaleMetrics {
  population: [number, number];
  geographicSpan: [number, number];
  economicComplexity: [number, number];
}

export interface FailureModes {
  oversized: string;
  undersized: string;
}

export interface StressVectors {
  coordinationOverhead: number;
  informationLatency: number;
  cohesionCost: number;
  resourceMisallocation: number;
}

/** 0–1 exposure. Higher means this dimension pushes the model off its stable range faster. */
export interface ScaleCoupling {
  population: number;
  geographicSpan: number;
  economicComplexity: number;
}

export const GOVERNANCE_CATEGORIES = ['P2P', 'Democratic', 'Bureaucratic', 'Autocratic'] as const;

export type GovernanceCategory = (typeof GOVERNANCE_CATEGORIES)[number];
export type SpectrumFilter = 'ALL' | GovernanceCategory;

export const SCALE_DIMENSIONS = [
  {
    key: 'population',
    label: 'Population Size',
    description: 'Micro communities to global billions',
  },
  {
    key: 'geographicSpan',
    label: 'Geographic Span',
    description: 'Face-to-face to interplanetary latency',
  },
  {
    key: 'economicComplexity',
    label: 'Economic Complexity',
    description: 'Subsistence to hyper-financialized trade',
  },
] as const;

export type ScaleDimensionKey = (typeof SCALE_DIMENSIONS)[number]['key'];
export type ActiveScales = Record<ScaleDimensionKey, boolean>;

export const SCALE_MULTIPLIER = {
  min: 1,
  max: 5,
  step: 0.1,
  /** Operating point at which authored stress vectors are reproduced exactly. */
  default: 2.2,
} as const;

export const DEFAULT_ACTIVE_SCALES: ActiveScales = {
  population: true,
  geographicSpan: true,
  economicComplexity: true,
};

export const DEFAULT_MODEL_ID = 'representative-republic';

export interface GovernanceModel {
  id: string;
  name: string;
  category: GovernanceCategory;
  /** 0–100 on the governance spectrum (P2P → Autocratic). */
  x: number;
  /** 0–100 scale index. Higher means the model is built to absorb large systems. */
  y: number;
  scaleMetrics: ScaleMetrics;
  scaleCoupling: ScaleCoupling;
  failureModes: FailureModes;
  stressVectors: StressVectors;
  historicalPrecedents: string[];
  description: string;
}

export type StressTone = 'critical' | 'strained' | 'stable';

export interface StressStatus {
  label: 'CRITICAL FAILURE' | 'STRAINED' | 'STABLE RANGE';
  tone: StressTone;
  /** 0–100 composite. Weakest vector leads; the mean keeps a single spike from deciding alone. */
  score: number;
}

export interface SimulationResult {
  stress: StressVectors;
  status: StressStatus;
}

/**
 * How strongly each scale dimension loads a stress vector.
 * Population drives coordination and cohesion, span drives latency,
 * economic complexity drives misallocation.
 */
const DIMENSION_LOAD: Record<keyof StressVectors, Record<ScaleDimensionKey, number>> = {
  coordinationOverhead: { population: 1, geographicSpan: 0.58, economicComplexity: 0.42 },
  informationLatency: { population: 0.28, geographicSpan: 1, economicComplexity: 0.36 },
  cohesionCost: { population: 0.82, geographicSpan: 0.48, economicComplexity: 0.3 },
  resourceMisallocation: { population: 0.34, geographicSpan: 0.22, economicComplexity: 1 },
};

const STRESS_VECTOR_KEYS = Object.keys(DIMENSION_LOAD) as (keyof StressVectors)[];

/** Share of baseline stress that remains when a vector's drivers are disengaged. */
const STRESS_FLOOR = 0.34;
/** Multiple of baseline approached as scale goes planetary. Values still clamp at 100. */
const STRESS_CEILING = 1.65;

const STATUS_THRESHOLDS = {
  critical: 80,
  strained: 52,
} as const;

export const GOVERNANCE_MODELS: readonly GovernanceModel[] = [
  {
    id: 'direct-democracy',
    name: 'Direct Democracy',
    category: 'P2P',
    x: 15,
    y: 20,
    scaleMetrics: { population: [10, 1000], geographicSpan: [1, 50], economicComplexity: [10, 40] },
    scaleCoupling: { population: 0.96, geographicSpan: 0.74, economicComplexity: 0.38 },
    failureModes: {
      oversized: 'Dunbar Overload: Consensus gridlock, voter apathy, and high decision latency.',
      undersized: 'Tyranny of the minority/majority polarization with zero institutional buffer.',
    },
    stressVectors: { coordinationOverhead: 92, informationLatency: 12, cohesionCost: 45, resourceMisallocation: 20 },
    historicalPrecedents: ['Ancient Athenian Ecclesia', 'Swiss Cantonal Landsgemeinde', 'Modern Town Hall Meetings'],
    description: 'Citizens participate directly in public decision-making without intermediary representatives.',
  },
  {
    id: 'worker-cooperatives',
    name: 'Worker Cooperatives',
    category: 'P2P',
    x: 28,
    y: 35,
    scaleMetrics: { population: [50, 5000], geographicSpan: [5, 200], economicComplexity: [30, 70] },
    scaleCoupling: { population: 0.68, geographicSpan: 0.52, economicComplexity: 0.84 },
    failureModes: {
      oversized: 'Scaling Bottleneck: Democratic fatigue, capital access constraints, and slow strategic pivots.',
      undersized: 'Founder burnout and lack of redundancy during market shocks.',
    },
    stressVectors: { coordinationOverhead: 78, informationLatency: 28, cohesionCost: 35, resourceMisallocation: 30 },
    historicalPrecedents: ['Mondragon Corporation', 'Emilia Romagna Cooperative Network'],
    description: 'Enterprises owned and democratically controlled by their workforce.',
  },
  {
    id: 'representative-republic',
    name: 'Representative Republic',
    category: 'Democratic',
    x: 50,
    y: 65,
    scaleMetrics: { population: [10000, 300000000], geographicSpan: [500, 10000000], economicComplexity: [50, 100] },
    scaleCoupling: { population: 0.42, geographicSpan: 0.57, economicComplexity: 0.61 },
    failureModes: {
      oversized: 'Hyper-Polarization & Institutional Gridlock: Disconnect between electorate and legislative bodies.',
      undersized: 'Unnecessary bureaucratic overhead for simple communal coordination.',
    },
    stressVectors: { coordinationOverhead: 55, informationLatency: 68, cohesionCost: 60, resourceMisallocation: 52 },
    historicalPrecedents: ['Roman Republic', 'United States Federal Republic', 'Federal Republic of Germany'],
    description: 'Power is held by the people and their elected representatives, moderated by constitutional checks.',
  },
  {
    id: 'federated-technocracy',
    name: 'Federated Technocracy',
    category: 'Bureaucratic',
    x: 68,
    y: 75,
    scaleMetrics: { population: [100000, 500000000], geographicSpan: [1000, 20000000], economicComplexity: [80, 100] },
    scaleCoupling: { population: 0.36, geographicSpan: 0.44, economicComplexity: 0.78 },
    failureModes: {
      oversized: 'Elite Capture: Technocratic insulation from human values, algorithmic governance failures.',
      undersized: 'Top-heavy administrative bloat relative to actual societal needs.',
    },
    stressVectors: { coordinationOverhead: 45, informationLatency: 50, cohesionCost: 75, resourceMisallocation: 40 },
    historicalPrecedents: ['Singaporean Public Administration', 'Early Soviet Gosplan (Cybernetic proposals)'],
    description: 'Decision-makers are selected based on specialized technical knowledge and empirical metrics.',
  },
  {
    id: 'bureaucratic-state',
    name: 'Centralized Administrative State',
    category: 'Bureaucratic',
    x: 78,
    y: 88,
    scaleMetrics: { population: [1000000, 1400000000], geographicSpan: [5000, 50000000], economicComplexity: [70, 95] },
    scaleCoupling: { population: 0.58, geographicSpan: 0.93, economicComplexity: 0.66 },
    failureModes: {
      oversized: 'Information Latency & Red Tape: Bureaucratic sclerosis, inability to process local feedback loops.',
      undersized: 'Crushing overhead that starves local communities of agency.',
    },
    stressVectors: { coordinationOverhead: 88, informationLatency: 94, cohesionCost: 82, resourceMisallocation: 78 },
    historicalPrecedents: ['Qing Dynasty Administration', 'Post-War French Indicative Planning', 'Modern Central Ministries'],
    description: 'Hierarchical governance driven by specialized administrative departments and rigid regulations.',
  },
  {
    id: 'authoritarian-regime',
    name: 'Authoritarian Regime',
    category: 'Autocratic',
    x: 92,
    y: 80,
    scaleMetrics: { population: [50000, 2000000000], geographicSpan: [100, 100000000], economicComplexity: [20, 90] },
    scaleCoupling: { population: 0.81, geographicSpan: 0.7, economicComplexity: 0.48 },
    failureModes: {
      oversized: 'Catastrophic Cohesion Cost: Massive enforcement overhead, brutal suppression leading to systemic collapse.',
      undersized: 'Micro-tyranny and immediate domestic destabilization.',
    },
    stressVectors: { coordinationOverhead: 60, informationLatency: 85, cohesionCost: 98, resourceMisallocation: 88 },
    historicalPrecedents: ['Absolute Monarchies', '20th Century Centralized Dictatorships'],
    description: 'Political power is concentrated in a single leader or narrow elite without meaningful public accountability.',
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 0 at local scale, 1 at planetary scale. Eases in so the top of the slider bites harder. */
function scaleIntensity(multiplier: number): number {
  const span = SCALE_MULTIPLIER.max - SCALE_MULTIPLIER.min;
  const t = clamp((multiplier - SCALE_MULTIPLIER.min) / span, 0, 1);
  return Math.pow(t, 1.15);
}

/** 0 = built for very large systems, 1 = fragile as soon as scale leaves the local range. */
function scaleFragility(model: GovernanceModel): number {
  return clamp(1 - model.y / 120, 0, 1);
}

function vectorExposure(
  model: GovernanceModel,
  vector: keyof StressVectors,
  activeScales: ActiveScales,
): number {
  const load = DIMENSION_LOAD[vector];
  let activeLoad = 0;
  let totalLoad = 0;

  for (const dimension of SCALE_DIMENSIONS) {
    const weight = model.scaleCoupling[dimension.key] * load[dimension.key];
    totalLoad += weight;
    if (activeScales[dimension.key]) activeLoad += weight;
  }

  if (totalLoad === 0) return 0;
  return activeLoad / totalLoad;
}

/**
 * Pressure relative to the reference operating point.
 * 1 reproduces the authored baseline. Above 1, fragile (low scale-index) models accelerate.
 */
function pressureRatio(model: GovernanceModel, intensity: number, exposure: number): number {
  const reference = scaleIntensity(SCALE_MULTIPLIER.default);
  if (reference === 0) return 0;

  let ratio = (intensity * exposure) / reference;
  if (ratio > 1) {
    const overload = ratio - 1;
    ratio = 1 + overload * (1 + scaleFragility(model) * 0.85);
  }
  return ratio;
}

/** Maps a pressure ratio onto a multiplier of the authored baseline. Pins ratio 1 → 1. */
function stressFactor(ratio: number): number {
  if (ratio <= 0) return STRESS_FLOOR;
  if (Math.abs(ratio - 1) < 1e-6) return 1;

  const saturation = 1 - Math.exp(-ratio);
  const saturationAtReference = 1 - Math.exp(-1);

  if (ratio < 1) {
    const t = saturation / saturationAtReference;
    return STRESS_FLOOR + (1 - STRESS_FLOOR) * t;
  }

  const headroom = 1 - saturationAtReference;
  const t = clamp((saturation - saturationAtReference) / headroom, 0, 1);
  return 1 + (STRESS_CEILING - 1) * t;
}

function deriveStatus(stress: StressVectors): StressStatus {
  const values = STRESS_VECTOR_KEYS.map((key) => stress[key]);
  const peak = Math.max(...values);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const score = clamp(Math.round(peak * 0.72 + mean * 0.28), 0, 100);

  if (score >= STATUS_THRESHOLDS.critical) {
    return { label: 'CRITICAL FAILURE', tone: 'critical', score };
  }
  if (score >= STATUS_THRESHOLDS.strained) {
    return { label: 'STRAINED', tone: 'strained', score };
  }
  return { label: 'STABLE RANGE', tone: 'stable', score };
}

export function computeSimulation(
  model: GovernanceModel,
  activeScales: ActiveScales,
  scaleMultiplier: number,
): SimulationResult {
  const multiplier = Number.isFinite(scaleMultiplier) ? scaleMultiplier : SCALE_MULTIPLIER.default;
  const intensity = scaleIntensity(multiplier);
  const stress = {} as StressVectors;

  for (const vector of STRESS_VECTOR_KEYS) {
    const exposure = vectorExposure(model, vector, activeScales);
    const ratio = pressureRatio(model, intensity, exposure);
    const reading = model.stressVectors[vector] * stressFactor(ratio);
    stress[vector] = clamp(Math.round(reading), 0, 100);
  }

  return { stress, status: deriveStatus(stress) };
}

export function filterModels(category: SpectrumFilter): GovernanceModel[] {
  if (category === 'ALL') return [...GOVERNANCE_MODELS];
  return GOVERNANCE_MODELS.filter((model) => model.category === category);
}

export function describeActiveScales(activeScales: ActiveScales): string {
  const engaged = SCALE_DIMENSIONS.filter((dimension) => activeScales[dimension.key]);
  if (engaged.length === 0) return 'No scale dimensions engaged';
  if (engaged.length === SCALE_DIMENSIONS.length) return 'All scale dimensions engaged';
  return `Engaged: ${engaged.map((dimension) => dimension.label.toLowerCase()).join(', ')}`;
}
