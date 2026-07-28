import { runKnowledgeBuild } from '../../tools/knowledge/compiler/build';
import { CompilerDependencyEngine } from '../../tools/knowledge/compiler/dependency-engine';
import { IncrementalCacheManager } from '../../tools/knowledge/compiler/incremental-cache';
import { ArtifactExplorerService } from '../../src/admin/services/artifact-explorer.service';
import { scanAndParseKnowledgeObjects } from '../../tools/knowledge/parser';
import { buildCanonicalIR } from '../../tools/knowledge/cir';
import * as path from 'path';
import * as fs from 'fs';

async function runCompilerV2VerificationTests() {
  console.log('🧪 [COMPILER 2.0 VERIFICATION TEST SUITE] Starting Epics 1 - 5 Verification Tests...');

  const rootDir = path.resolve(__dirname, '../../');

  // Test 1: Epic 3 - Parallel Generator Execution & Compiler Benchmark Suite
  console.log('\n--- Test 1: Epic 3 & 5 - Parallel Generator Execution & Benchmark Suite ---');
  await runKnowledgeBuild(rootDir, false);

  const manifestPath = path.join(rootDir, 'generated', 'knowledge-build.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  if (!manifest.benchmark_suite_metrics || manifest.version !== '2.0.0') {
    throw new Error('Test 1 Failed: Compiler 2.0 Manifest or Benchmark Suite metrics missing');
  }
  console.log(`✅ Test 1 Passed: Parallel Build completed in ${manifest.benchmark_suite_metrics.total_duration_ms}ms (Memory: ${manifest.benchmark_suite_metrics.heap_memory_usage_mb}MB).`);

  // Test 2: Epic 1 - Incremental Compilation Mode
  console.log('\n--- Test 2: Epic 1 - Incremental Compilation Mode ---');
  const cacheManager = new IncrementalCacheManager(rootDir);
  const cache = cacheManager.loadCache();

  if (!cache || cache.version !== '2.0.0') {
    throw new Error('Test 2 Failed: Incremental Cache Data missing or invalid');
  }
  console.log(`✅ Test 2 Passed: Incremental Cache Manager saved ${Object.keys(cache.files).length} file states.`);

  // Test 3: Epic 2 - Bi-directional Change Impact Analysis
  console.log('\n--- Test 3: Epic 2 - Bi-directional Change Impact Analysis ---');
  const docsDir = path.join(rootDir, 'docs');
  const astList = scanAndParseKnowledgeObjects(docsDir);
  const cir = buildCanonicalIR(astList);

  const depEngine = new CompilerDependencyEngine();
  const impact = depEngine.analyzeChangeImpact('PROD-MATCH-001', cir);

  if (impact.totalImpactedNodes === 0 || impact.impactedContracts.length === 0) {
    throw new Error('Test 3 Failed: Change Impact Analysis returned 0 impacted nodes');
  }
  console.log(`✅ Test 3 Passed: Object [PROD-MATCH-001] Impact Analysis: ${impact.impactedContracts.length} Contracts, ${impact.impactedEvents.length} Events, ${impact.impactedEntities.length} DB Tables.`);

  // Test 4: Dynamic Artifact Explorer Traceability
  console.log('\n--- Test 4: Dynamic Artifact Explorer Traceability Engine ---');
  const explorerService = new ArtifactExplorerService();
  const traceTree = explorerService.getTraceabilityTree(rootDir);

  if (traceTree.length === 0 || !traceTree[0].sourceFilePath) {
    throw new Error('Test 4 Failed: Dynamic Artifact Explorer returned empty trace tree');
  }
  console.log(`✅ Test 4 Passed: Dynamically traced ${traceTree.length} Knowledge-to-Runtime Chains from CIR v${cir.cirSchemaVersion}.`);

  console.log('\n🎉 [COMPILER 2.0 VERIFICATION TEST SUITE] All Epics 1 - 5 Passed 100%!');
}

runCompilerV2VerificationTests().catch((err) => {
  console.error('❌ Compiler 2.0 Test Suite Failed:', err);
  process.exit(1);
});
