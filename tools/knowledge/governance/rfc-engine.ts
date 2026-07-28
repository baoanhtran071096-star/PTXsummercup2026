export interface RequestForComment {
  rfcId: string;
  title: string;
  author: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  targetComponent: string;
  proposedChanges: string;
  approvedBy?: string;
  createdAt: string;
}

export class RfcEngine {
  private rfcDatabase: Map<string, RequestForComment> = new Map();

  constructor() {
    // Seed default approved RFC for Compiler 2.0
    this.rfcDatabase.set('RFC-001-COMPILER-V2', {
      rfcId: 'RFC-001-COMPILER-V2',
      title: 'Compiler 2.0 Parallel Execution & Incremental Cache Specification',
      author: 'Chief Software Architect (CTO)',
      status: 'APPROVED',
      targetComponent: 'tools/knowledge/compiler',
      proposedChanges: 'Introduce Parallel Generators via Promise.all and SHA-256 Incremental Cache',
      approvedBy: 'CTO Board',
      createdAt: '2026-07-28'
    });
  }

  getActiveRfcs(): RequestForComment[] {
    return Array.from(this.rfcDatabase.values());
  }

  getApprovedRfcs(): RequestForComment[] {
    return this.getActiveRfcs().filter((rfc) => rfc.status === 'APPROVED');
  }
}
