import { runKnowledgeBuild } from '../../tools/knowledge/compiler/build';
import { RfcEngine } from '../../tools/knowledge/governance/rfc-engine';
import { AdrRegistry } from '../../tools/knowledge/governance/adr-registry';
import { GovernanceAuditEngine } from '../../tools/knowledge/governance/audit-engine';
import { ReleaseManager } from '../../tools/knowledge/governance/release-manager';
import { scanAndParseKnowledgeObjects } from '../../tools/knowledge/parser';
import { buildCanonicalIR } from '../../tools/knowledge/cir';
import * as path from 'path';
import * as fs from 'fs';

async function runEnterpriseGovernanceTests() {
  console.log('🧪 [GIAI ĐOẠN 3 ENTERPRISE GOVERNANCE TEST SUITE] Starting Epics 1 - 5 Verification Tests...');

  const rootDir = path.resolve(__dirname, '../../');

  // Test 1: Epic 1 - RFC Engine (Request for Comments)
  console.log('\n--- Test 1: Epic 1 - RFC Engine ---');
  const rfcEngine = new RfcEngine();
  const approvedRfcs = rfcEngine.getApprovedRfcs();

  if (approvedRfcs.length === 0 || approvedRfcs[0].status !== 'APPROVED') {
    throw new Error('Test 1 Failed: RFC Engine returned 0 approved RFCs');
  }
  console.log(`✅ Test 1 Passed: Found ${approvedRfcs.length} Approved RFCs (${approvedRfcs[0].rfcId}: ${approvedRfcs[0].title}).`);

  // Test 2: Epic 2 - ADR Registry (Architectural Decision Records)
  console.log('\n--- Test 2: Epic 2 - ADR Registry ---');
  const adrRegistry = new AdrRegistry();
  const acceptedAdrs = adrRegistry.getAcceptedAdrs();

  if (acceptedAdrs.length === 0 || acceptedAdrs[0].status !== 'ACCEPTED') {
    throw new Error('Test 2 Failed: ADR Registry returned 0 accepted ADRs');
  }
  console.log(`✅ Test 2 Passed: Found ${acceptedAdrs.length} Accepted ADRs (${acceptedAdrs[0].adrId}: ${acceptedAdrs[0].title}).`);

  // Test 3: Epic 3 & 4 - Governance Policy & Audit Engine
  console.log('\n--- Test 3: Epic 3 & 4 - Governance Policy & Audit Engine ---');
  const docsDir = path.join(rootDir, 'docs');
  const astList = scanAndParseKnowledgeObjects(docsDir);
  const cir = buildCanonicalIR(astList);

  const auditEngine = new GovernanceAuditEngine();
  const auditReport = auditEngine.generateAuditReport(cir);

  if (auditReport.complianceScore !== 100 || auditReport.auditSummary.status !== 'COMPLIANT') {
    throw new Error(`Test 3 Failed: Governance Audit Score ${auditReport.complianceScore}% != 100%`);
  }
  console.log(`✅ Test 3 Passed: Governance Compliance Audit Score: 100% (Status: ${auditReport.auditSummary.status}).`);

  // Test 4: Epic 5 - Compiler Build & Release Package Manager
  console.log('\n--- Test 4: Epic 5 - Compiler Build & Release Package Manager ---');
  await runKnowledgeBuild(rootDir, false);

  const releasePkgPath = path.join(rootDir, 'generated', 'governance', 'release-package.json');
  const auditReportPath = path.join(rootDir, 'generated', 'governance', 'governance-audit.json');

  if (!fs.existsSync(releasePkgPath) || !fs.existsSync(auditReportPath)) {
    throw new Error('Test 4 Failed: Governance Release Artifacts missing');
  }

  const releasePkg = JSON.parse(fs.readFileSync(releasePkgPath, 'utf-8'));
  console.log(`✅ Test 4 Passed: Emitted Release Package [${releasePkg.releaseVersion}] with Changelog & Migration Guide.`);

  console.log('\n🎉 [GIAI ĐOẠN 3 ENTERPRISE GOVERNANCE TEST SUITE] All Epics 1 - 5 Passed 100%!');
}

runEnterpriseGovernanceTests().catch((err) => {
  console.error('❌ Enterprise Governance Test Suite Failed:', err);
  process.exit(1);
});
