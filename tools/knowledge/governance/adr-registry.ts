export interface ArchitecturalDecisionRecord {
  adrId: string;
  title: string;
  status: 'DRAFT' | 'ACCEPTED' | 'DEPRECATED';
  context: string;
  decision: string;
  consequences: string;
  supersededBy?: string;
  date: string;
}

export class AdrRegistry {
  private adrMap: Map<string, ArchitecturalDecisionRecord> = new Map();

  constructor() {
    this.adrMap.set('ADR-001-ATOMIC-RPC', {
      adrId: 'ADR-001-ATOMIC-RPC',
      title: 'Atomic RPC Transaction Enforcement for Match Score Aggregates',
      status: 'ACCEPTED',
      context: 'Score calculations must be race-condition safe',
      decision: 'Enforce PostgreSQL fn_add_goal stored procedure',
      consequences: 'Zero score drift across multi-instance API servers',
      date: '2026-07-28'
    });

    this.adrMap.set('ADR-002-DISPOSABLE-BUILD', {
      adrId: 'ADR-002-DISPOSABLE-BUILD',
      title: 'Disposable Generated Code & Read-Only Generated Directory Rule',
      status: 'ACCEPTED',
      context: 'Handwritten code in generated/ causes contract drift',
      decision: 'Make generated/ 100% disposable and read-only for humans',
      consequences: 'Single Source of Truth preserved 100%',
      date: '2026-07-28'
    });
  }

  getAcceptedAdrs(): ArchitecturalDecisionRecord[] {
    return Array.from(this.adrMap.values()).filter((adr) => adr.status === 'ACCEPTED');
  }
}
