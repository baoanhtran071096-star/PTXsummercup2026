export interface AimissionTicket {
  missionId: string;
  title: string;
  assignedCapability: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'EVIDENCE_READY' | 'MERGED';
  leadAgent: 'Claude' | 'Gemini' | 'Codex' | 'DeepSeek';
  qualityGateStatus: {
    gate0Spec: boolean;
    gate1Arch: boolean;
    gate2Impl: boolean;
    gate3Benchmark: boolean;
    gate4Security: boolean;
    gate5Prod: boolean;
  };
}

export interface ApmSystemStatusReport {
  activeMissionsCount: number;
  aiLoadBalance: Record<string, number>;
  conflictsDetected: string[];
  kpiHealth: string;
}

export class AiProgramManagerAgent {
  private missionQueue: Map<string, AimissionTicket> = new Map();

  constructor() {
    // Seed initial active Mission
    this.missionQueue.set('MISSION-001', {
      missionId: 'MISSION-001',
      title: 'Optimize Compiler 3.0 Build Latency & Parallel Throughput',
      assignedCapability: 'Knowledge Compiler',
      status: 'EVIDENCE_READY',
      leadAgent: 'Claude',
      qualityGateStatus: {
        gate0Spec: true,
        gate1Arch: true,
        gate2Impl: true,
        gate3Benchmark: true,
        gate4Security: true,
        gate5Prod: true
      }
    });
  }

  getActiveMissions(): AimissionTicket[] {
    return Array.from(this.missionQueue.values());
  }

  generateSystemStatusReport(): ApmSystemStatusReport {
    const missions = this.getActiveMissions();
    return {
      activeMissionsCount: missions.length,
      aiLoadBalance: {
        Claude: 25,
        Gemini: 25,
        Codex: 25,
        DeepSeek: 25
      },
      conflictsDetected: [],
      kpiHealth: 'HEALTHY_100_PERCENT'
    };
  }
}
