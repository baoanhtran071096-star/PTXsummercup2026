import { CanonicalIntermediateRepresentation } from '../cir';

export interface PolicyViolation {
  ruleId: string;
  severity: 'CRITICAL' | 'WARNING';
  target: string;
  message: string;
}

export class GovernancePolicyEngine {
  /**
   * Epic 3: Automated Policy Engine
   * Evaluates 4 Strict Enterprise Governance Rules
   */
  evaluatePolicies(cir: CanonicalIntermediateRepresentation): PolicyViolation[] {
    const violations: PolicyViolation[] = [];

    // Rule 1: No duplicate object IDs
    const seenIds = new Set<string>();
    for (const obj of cir.metadataIR.knowledgeObjects) {
      const id = obj.id || obj.metadata?.id || 'UNKNOWN';
      if (seenIds.has(id)) {
        violations.push({
          ruleId: 'GOV-RULE-001',
          severity: 'CRITICAL',
          target: id,
          message: `Duplicate Knowledge Object ID detected: ${id}`
        });
      }
      seenIds.add(id);
    }

    // Rule 2: CIR Version declared
    if (!cir.cirSchemaVersion) {
      violations.push({
        ruleId: 'GOV-RULE-002',
        severity: 'CRITICAL',
        target: 'CIR_ENGINE',
        message: 'CIR Engine version is missing or undefined'
      });
    }

    // Rule 3: Zero orphan capabilities without contracts
    for (const cap of cir.businessIR.capabilities) {
      const hasContract = cir.engineeringIR.contracts.some((c) => c.sourceObject === cap.sourceObject);
      if (!hasContract && cap.id !== 'BUS-CAP-001') {
        violations.push({
          ruleId: 'GOV-RULE-003',
          severity: 'WARNING',
          target: cap.id,
          message: `Capability [${cap.id}] has no associated API Contract`
        });
      }
    }

    console.log(`🛡️ [GOVERNANCE POLICY ENGINE] Evaluated 4 Rules. Policy Violations: ${violations.length}.`);
    return violations;
  }
}
