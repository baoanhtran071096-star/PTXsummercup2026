import { KnowledgeStudioService } from '../../src/platform/studio/knowledge-studio.service';
import { EnterpriseArtifactRegistryService } from '../../src/platform/registry/artifact-registry.service';
import { BuildOrchestratorService } from '../../src/platform/orchestrator/build-orchestrator.service';
import { PlatformObservabilityService } from '../../src/platform/observability/platform-observability.service';
import { DeveloperPortalService } from '../../src/platform/portal/developer-portal.service';
import * as path from 'path';

async function runPtxPlatformVerificationTests() {
  console.log('🧪 [GIAI ĐOẠN 4 PTX PLATFORM TEST SUITE] Starting Epics 1 - 5 Verification Tests...');

  const rootDir = path.resolve(__dirname, '../../');

  // Test 1: Epic 1 - Knowledge Studio Engine
  console.log('\n--- Test 1: Epic 1 - Knowledge Studio Engine ---');
  const studioService = new KnowledgeStudioService();
  const studioObjects = studioService.getStudioKnowledgeObjects(rootDir);

  if (studioObjects.length === 0) {
    throw new Error('Test 1 Failed: Knowledge Studio returned 0 objects');
  }
  console.log(`✅ Test 1 Passed: Knowledge Studio loaded ${studioObjects.length} Knowledge Objects with real-time CIR preview.`);

  // Test 2: Epic 2 - Enterprise Artifact Registry
  console.log('\n--- Test 2: Epic 2 - Enterprise Artifact Registry ---');
  const registryService = new EnterpriseArtifactRegistryService();
  const artifacts = registryService.getRegisteredArtifacts(rootDir);
  const diffResult = registryService.compareArtifactVersions('v3.0.0', 'v3.0.0');

  if (artifacts.length === 0 || diffResult.compatibilityStatus !== 'PASS') {
    throw new Error('Test 2 Failed: Enterprise Artifact Registry returned empty artifacts');
  }
  console.log(`✅ Test 2 Passed: Artifact Registry manages ${artifacts.length} versioned artifacts with diff comparison status [${diffResult.compatibilityStatus}].`);

  // Test 3: Epic 3 - Build Orchestrator Controller
  console.log('\n--- Test 3: Epic 3 - Build Orchestrator Engine ---');
  const orchestratorService = new BuildOrchestratorService();
  const orchResult = await orchestratorService.executeFullPipeline(rootDir);

  if (orchResult.status !== 'SUCCESS' || orchResult.steps.length === 0) {
    throw new Error('Test 3 Failed: Build Orchestrator Execution failed');
  }
  console.log(`✅ Test 3 Passed: Build Orchestrator executed ${orchResult.steps.length} End-to-End Pipeline Steps in ${orchResult.totalDurationMs}ms.`);

  // Test 4: Epic 4 - Real-time Platform Observability Dashboard
  console.log('\n--- Test 4: Epic 4 - Real-time Platform Observability Dashboard ---');
  const observabilityService = new PlatformObservabilityService();
  const metrics = observabilityService.getRealtimeMetrics(rootDir);

  if (metrics.systemHealth !== 'HEALTHY' || metrics.compilerThroughputObjectsPerSec <= 0) {
    throw new Error('Test 4 Failed: Observability Dashboard metrics invalid');
  }
  console.log(`✅ Test 4 Passed: Platform Observability System Health [${metrics.systemHealth}], Compiler Throughput: ${metrics.compilerThroughputObjectsPerSec} objects/sec.`);

  // Test 5: Epic 5 - Developer Portal & Plugin SDK Hub
  console.log('\n--- Test 5: Epic 5 - Developer Portal & Plugin SDK Hub ---');
  const portalService = new DeveloperPortalService();
  const registeredPlugins = portalService.getRegisteredPlugins();
  const sdkDocs = portalService.getSdkDocumentation();

  if (registeredPlugins.length === 0 || !sdkDocs.sdkName) {
    throw new Error('Test 5 Failed: Developer Portal returned empty plugins');
  }
  console.log(`✅ Test 5 Passed: Developer Portal Hub loaded ${registeredPlugins.length} Plugins & SDK Documentation (${sdkDocs.sdkName} v${sdkDocs.sdkVersion}).`);

  console.log('\n🎉 [GIAI ĐOẠN 4 PTX PLATFORM TEST SUITE] All Epics 1 - 5 Passed 100%!');
}

runPtxPlatformVerificationTests().catch((err) => {
  console.error('❌ PTX Platform Test Suite Failed:', err);
  process.exit(1);
});
