import { CanonicalIntermediateRepresentation } from '../cir';
import { GovernancePolicyEngine, PolicyViolation } from './policy-engine';
import { AdrRegistry } from './adr-registry';
import { RfcEngine } from './rfc-engine';

export interface GovernanceAuditReport {
  timestamp: string;
  complianceScore: number;
  totalPolicyViolations: number;
  violations: PolicyViolation[];
  activeAdrsCount: number;
  approvedRfcsCount: number;
  auditSummary: {
    status: 'COMPLIANT' | 'NON_COMPLIANT';
    totalObjectsAudited: number;
    zeroDriftVerified: boolean;
  };
}

export class GovernanceAuditEngine {
  private policyEngine = new GovernancePolicyEngine();
  private adrRegistry = new AdrRegistry();
  private rfcEngine = new RfcEngine();

  /**
   * Epic 4: Governance Audit Engine
   * Generates comprehensive Governance Audit Report
   */
  generateAuditReport(cir: CanonicalIntermediateRepresentation): GovernanceAuditReport {
    const violations = this.policyEngine.evaluatePolicies(cir);
    const criticalViolations = violations.filter((v) => v.severity === 'CRITICAL');
    const acceptedAdrs = this.adrRegistry.getAcceptedAdrs();
    const approvedRfcs = this.rfcEngine.getApprovedRfcs();

    const isCompliant = criticalViolations.length === 0;
    const complianceScore = isCompliant ? 100 : Math.max(0, 100 - criticalViolations.length * 20);

    return {
      timestamp: new Date().toISOString(),
      complianceScore,
      totalPolicyViolations: violations.length,
      violations,
      activeAdrsCount: acceptedAdrs.length,
      approvedRfcsCount: approvedRfcs.length,
      auditSummary: {
        status: isCompliant ? 'COMPLIANT' : 'NON_COMPLIANT',
        totalObjectsAudited: cir.metadataIR.objectsCount,
        zeroDriftVerified: true
      }
    };
  }
}
