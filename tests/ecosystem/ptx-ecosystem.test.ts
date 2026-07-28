import { PluginMarketplaceService } from '../../src/ecosystem/marketplace/plugin-marketplace.service';
import { BaseKnowledgeGeneratorSDK } from '../../src/ecosystem/sdk/ptx-generator-sdk';
import { ExtensionRuntimeService } from '../../src/ecosystem/runtime/extension-runtime.service';
import { UniversalPackageRegistryService } from '../../src/ecosystem/packages/package-registry.service';
import { EcosystemGovernanceService } from '../../src/ecosystem/governance/ecosystem-governance.service';
import { scanAndParseKnowledgeObjects } from '../../tools/knowledge/parser';
import { buildCanonicalIR } from '../../tools/knowledge/cir';
import * as path from 'path';

class TestThirdPartySdkPlugin extends BaseKnowledgeGeneratorSDK {
  id = 'plugin-third-party-sdk-test';
  name = 'Third Party Test Generator';
  language = 'TypeScript';
  version = '1.0.0';
  supportsCirVersion = '1.2.0';
  digitalSignature = 'sig_ptx_pub_key_test_123';

  generate(cir: any) {
    return {
      name: 'Third Party SDK Artifact',
      filename: 'third-party-artifact.ts',
      targetSubDir: 'custom',
      content: '// Third Party SDK Generated Code'
    };
  }
}

async function runPtxEcosystemVerificationTests() {
  console.log('🧪 [GIAI ĐOẠN 5 PTX ECOSYSTEM TEST SUITE] Starting Epics 1 - 5 Verification Tests...');

  const rootDir = path.resolve(__dirname, '../../');

  // Test 1: Epic 1 - Plugin Marketplace Engine
  console.log('\n--- Test 1: Epic 1 - Plugin Marketplace Engine ---');
  const marketplace = new PluginMarketplaceService();
  const availablePlugins = marketplace.getAvailablePlugins();
  const installedPlugin = marketplace.installPlugin('plugin-graphql-schema');

  if (availablePlugins.length === 0 || installedPlugin.status !== 'INSTALLED') {
    throw new Error('Test 1 Failed: Plugin Marketplace failed');
  }
  console.log(`✅ Test 1 Passed: Plugin Marketplace loaded ${availablePlugins.length} plugins. Installed: ${installedPlugin.name} (${installedPlugin.status}).`);

  // Test 2: Epic 2 - Official Plugin SDK (@ptx/kos-generator-sdk)
  console.log('\n--- Test 2: Epic 2 - Official Plugin SDK ---');
  const sdkPlugin = new TestThirdPartySdkPlugin();
  const isCompatible = sdkPlugin.verifyCompatibility('1.2.0');

  if (!isCompatible) {
    throw new Error('Test 2 Failed: Plugin SDK compatibility verification failed');
  }
  console.log(`✅ Test 2 Passed: Third-Party Plugin developed with BaseKnowledgeGeneratorSDK verified compatible.`);

  // Test 3: Epic 3 - Dynamic Extension Runtime Engine
  console.log('\n--- Test 3: Epic 3 - Extension Runtime Engine ---');
  const docsDir = path.join(rootDir, 'docs');
  const astList = scanAndParseKnowledgeObjects(docsDir);
  const cir = buildCanonicalIR(astList);

  const extensionRuntime = new ExtensionRuntimeService();
  extensionRuntime.registerExtension(sdkPlugin);
  const extResults = extensionRuntime.executeActiveExtensions(cir);

  if (extResults.length === 0 || !extResults[0].artifact.filename) {
    throw new Error('Test 3 Failed: Extension Runtime Engine execution failed');
  }
  console.log(`✅ Test 3 Passed: Dynamic Extension Runtime executed ${extResults.length} third-party extensions without core code modifications.`);

  // Test 4: Epic 4 - Universal Package Registry
  console.log('\n--- Test 4: Epic 4 - Universal Package Registry ---');
  const packageRegistry = new UniversalPackageRegistryService();
  const packages = packageRegistry.getPublishedPackages();

  if (packages.length === 0) {
    throw new Error('Test 4 Failed: Universal Package Registry returned 0 packages');
  }
  console.log(`✅ Test 4 Passed: Universal Package Registry loaded ${packages.length} Packages (Knowledge Packs & AI Packages).`);

  // Test 5: Epic 5 - Ecosystem Governance & Digital Security Signing
  console.log('\n--- Test 5: Epic 5 - Ecosystem Governance & Digital Security Signing ---');
  const ecoGovernance = new EcosystemGovernanceService();
  const securityAudit = ecoGovernance.verifyPluginSecurity(sdkPlugin.id, sdkPlugin.digitalSignature);

  if (!securityAudit.isPluginVerified || securityAudit.securityRating !== 'A+') {
    throw new Error('Test 5 Failed: Plugin Digital Security Signature Verification failed');
  }
  console.log(`✅ Test 5 Passed: Ecosystem Security Signature verified [${securityAudit.signatureStatus}], Rating: [${securityAudit.securityRating}].`);

  console.log('\n🎉 [GIAI ĐOẠN 5 PTX ECOSYSTEM TEST SUITE] All Epics 1 - 5 Passed 100%!');
}

runPtxEcosystemVerificationTests().catch((err) => {
  console.error('❌ PTX Ecosystem Test Suite Failed:', err);
  process.exit(1);
});
