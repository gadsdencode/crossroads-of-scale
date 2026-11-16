export interface ScaleMetrics {
  population: [number, number]; // [min, max] logarithmic or 0-100 scale
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

export interface GovernanceModel {
  id: string;
  name: string;
  category: 'P2P' | 'Democratic' | 'Bureaucratic' | 'Autocratic';
  x: number; // 0 to 100 on governance spectrum (P2P -> Autocratic)
  y: number; // 0 to 100 on scale index
  scaleMetrics: ScaleMetrics;
  failureModes: FailureModes;
  stressVectors: StressVectors;
  historicalPrecedents: string[];
  description: string;
}

export const GOVERNANCE_MODELS: GovernanceModel[] = [
  {
    id: 'direct-democracy',
    name: 'Direct Democracy',
    category: 'P2P',
    x: 15,
    y: 20,
    scaleMetrics: { population: [10, 1000], geographicSpan: [1, 50], economicComplexity: [10, 40] },
    failureModes: {
      oversized: 'Dunbar Overload: Consensus gridlock, voter apathy, and high decision latency.',
      undersized: 'Tyranny of the minority/majority polarization with zero institutional buffer.'
    },
    stressVectors: { coordinationOverhead: 92, informationLatency: 12, cohesionCost: 45, resourceMisallocation: 20 },
    historicalPrecedents: ['Ancient Athenian Ecclesia', 'Swiss Cantonal Landsgemeinde', 'Modern Town Hall Meetings'],
    description: 'Citizens participate directly in public decision-making without intermediary representatives.'
  },
  {
    id: 'worker-cooperatives',
    name: 'Worker Cooperatives',
    category: 'P2P',
    x: 28,
    y: 35,
    scaleMetrics: { population: [50, 5000], geographicSpan: [5, 200], economicComplexity: [30, 70] },
    failureModes: {
      oversized: 'Scaling Bottleneck: Democratic fatigue, capital access constraints, and slow strategic pivots.',
      undersized: 'Founder burnout and lack of redundancy during market shocks.'
    },
    stressVectors: { coordinationOverhead: 78, informationLatency: 28, cohesionCost: 35, resourceMisallocation: 30 },
    historicalPrecedents: ['Mondragon Corporation', 'Emilia Romagna Cooperative Network'],
    description: 'Enterprises owned and democratically controlled by their workforce.'
  },
  {
    id: 'representative-republic',
    name: 'Representative Republic',
    category: 'Democratic',
    x: 50,
    y: 65,
    scaleMetrics: { population: [10000, 300000000], geographicSpan: [500, 10000000], economicComplexity: [50, 100] },
    failureModes: {
      oversized: 'Hyper-Polarization & Institutional Gridlock: Disconnect between electorate and legislative bodies.',
      undersized: 'Unnecessary bureaucratic overhead for simple communal coordination.'
    },
    stressVectors: { coordinationOverhead: 55, informationLatency: 68, cohesionCost: 60, resourceMisallocation: 52 },
    historicalPrecedents: ['Roman Republic', 'United States Federal Republic', 'Federal Republic of Germany'],
    description: 'Power is held by the people and their elected representatives, moderated by constitutional checks.'
  },
  {
    id: 'federated-technocracy',
    name: 'Federated Technocracy',
    category: 'Bureaucratic',
    x: 68,
    y: 75,
    scaleMetrics: { population: [100000, 500000000], geographicSpan: [1000, 20000000], economicComplexity: [80, 100] },
    failureModes: {
      oversized: 'Elite Capture: Technocratic insulation from human values, algorithmic governance failures.',
      undersized: 'Top-heavy administrative bloat relative to actual societal needs.'
    },
    stressVectors: { coordinationOverhead: 45, informationLatency: 50, cohesionCost: 75, resourceMisallocation: 40 },
    historicalPrecedents: ['Singaporean Public Administration', 'Early Soviet Gosplan (Cybernetic proposals)'],
    description: 'Decision-makers are selected based on specialized technical knowledge and empirical metrics.'
  },
  {
    id: 'bureaucratic-state',
    name: 'Centralized Administrative State',
    category: 'Bureaucratic',
    x: 78,
    y: 88,
    scaleMetrics: { population: [1000000, 1400000000], geographicSpan: [5000, 50000000], economicComplexity: [70, 95] },
    failureModes: {
      oversized: 'Information Latency & Red Tape: Bureaucratic sclerosis, inability to process local feedback loops.',
      undersized: 'Crushing overhead that starves local communities of agency.'
    },
    stressVectors: { coordinationOverhead: 88, informationLatency: 94, cohesionCost: 82, resourceMisallocation: 78 },
    historicalPrecedents: ['Qing Dynasty Administration', 'Post-War French Indicative Planning', 'Modern Central Ministries'],
    description: 'Hierarchical governance driven by specialized administrative departments and rigid regulations.'
  },
  {
    id: 'authoritarian-regime',
    name: 'Authoritarian Regime',
    category: 'Autocratic',
    x: 92,
    y: 80,
    scaleMetrics: { population: [50000, 2000000000], geographicSpan: [100, 100000000], economicComplexity: [20, 90] },
    failureModes: {
      oversized: 'Catastrophic Cohesion Cost: Massive enforcement overhead, brutal suppression leading to systemic collapse.',
      undersized: 'Micro-tyranny and immediate domestic destabilization.'
    },
    stressVectors: { coordinationOverhead: 60, informationLatency: 85, cohesionCost: 98, resourceMisallocation: 88 },
    historicalPrecedents: ['Absolute Monarchies', '20th Century Centralized Dictatorships'],
    description: 'Political power is concentrated in a single leader or narrow elite without meaningful public accountability.'
  }
];
