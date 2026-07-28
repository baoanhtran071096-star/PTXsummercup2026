import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { scanAndParseKnowledgeObjects } from '../parser';
import { buildCanonicalIR } from '../cir';
import { generatorRegistry } from '../generators';
import { IncrementalCacheManager } from './incremental-cache';
import { CompilerDependencyEngine } from './dependency-engine';
import { GovernanceAuditEngine } from '../governance/audit-engine';
import { ReleaseManager } from '../governance/release-manager';

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

function isCirVersionCompatible(supportedPattern: string, compiledVersion: string): boolean {
  if (supportedPattern === compiledVersion) return true;
  if (supportedPattern === '1.2.x' && compiledVersion.startsWith('1.2.')) return true;
  if (supportedPattern === '^1.2.0' && compiledVersion.startsWith('1.')) return true;
  return false;
}

/**
 * Compiler 3.0 Enterprise Governance Engine Pipeline (Giai đoạn 3)
 * Features: Automated Policy Engine, Governance Audit Reports, Release Package Manager, Parallel Generators & Incremental Cache
 */
export async function runKnowledgeBuild(rootDir: string, isIncremental = false) {
  const startTime = Date.now();
  const docsDir = path.join(rootDir, 'docs');
  const generatedDir = path.join(rootDir, 'generated');
  const governanceDir = path.join(generatedDir, 'governance');

  const cacheManager = new IncrementalCacheManager(rootDir);
  const dependencyEngine = new CompilerDependencyEngine();
  const auditEngine = new GovernanceAuditEngine();
  const releaseManager = new ReleaseManager();

  console.log('🚀 [PTX KOS COMPILER v3.0.0 GOVERNANCE EDITION] Starting Enterprise Build Pipeline...');
  console.log(`📂 Scanning Knowledge Objects from: ${docsDir}`);

  // Stage 1: Scan & Parse AST
  const tParseStart = Date.now();
  const astList = scanAndParseKnowledgeObjects(docsDir);
  const parseDurationMs = Date.now() - tParseStart;

  const currentFileHashes = astList.map((ast) => ({
    filePath: ast.filePath,
    sha256: sha256(ast.content)
  }));
  const incrementalStatus = cacheManager.detectChangedFiles(currentFileHashes);

  if (isIncremental && !incrementalStatus.isFullBuildRequired && incrementalStatus.changed.length === 0) {
    console.log(`⚡ [COMPILER 3.0 INCREMENTAL] 0 Files Changed. Reusing cached build artifacts in 0ms!`);
    return;
  }

  console.log(`✅ Stage 1 Passed (${parseDurationMs}ms): Parsed & Validated ${astList.length} Knowledge Objects via Zod Schemas.`);

  // Stage 2: Build Layered CIR v1.2.0 & Change Impact Analysis
  const tCirStart = Date.now();
  const cir = buildCanonicalIR(astList);
  const cirDurationMs = Date.now() - tCirStart;
  const impactAnalysis = dependencyEngine.analyzeChangeImpact('PROD-MATCH-001', cir);

  // Stage 3: Enterprise Governance Audit Engine (Epic 1 - 4)
  const auditReport = auditEngine.generateAuditReport(cir);
  console.log(`🛡️ [ENTERPRISE GOVERNANCE AUDIT] Compliance Score: ${auditReport.complianceScore}% | Active ADRs: ${auditReport.activeAdrsCount} | Approved RFCs: ${auditReport.approvedRfcsCount}`);

  if (auditReport.auditSummary.status === 'NON_COMPLIANT') {
    throw new Error(`ERR_GOVERNANCE_NON_COMPLIANT: ${auditReport.totalPolicyViolations} Critical Policy Violations detected.`);
  }

  // Stage 4: Parallel Generator Execution Architecture (Promise.all)
  const tGenStart = Date.now();
  const plugins = generatorRegistry.getAllPlugins();

  const pluginPromises = plugins.map(async (plugin) => {
    if (!isCirVersionCompatible(plugin.supportsCirVersion, cir.cirSchemaVersion)) {
      throw new Error(`ERR_GENERATOR_CIR_INCOMPATIBLE: Generator plugin [${plugin.id}] incompatible with CIR v${cir.cirSchemaVersion}`);
    }
    return {
      plugin,
      artifact: plugin.generate(cir)
    };
  });

  const generatedResults = await Promise.all(pluginPromises);
  const artifactsManifest: {
    artifactName: string;
    path: string;
    generatorId: string;
    generatorVersion: string;
    cirVersion: string;
    sha256: string;
  }[] = [];

  for (const res of generatedResults) {
    const targetDir = path.join(generatedDir, res.artifact.targetSubDir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const filePath = path.join(targetDir, res.artifact.filename);
    fs.writeFileSync(filePath, res.artifact.content, 'utf-8');

    const relPath = `generated/${res.artifact.targetSubDir}/${res.artifact.filename}`;
    const fileHash = sha256(res.artifact.content);

    artifactsManifest.push({
      artifactName: res.artifact.name,
      path: relPath,
      generatorId: res.plugin.id,
      generatorVersion: res.plugin.version,
      cirVersion: cir.cirSchemaVersion,
      sha256: fileHash
    });
  }

  // Stage 5: Emit Enterprise Governance Artifacts (Release Package)
  const sourceDeterministicHash = sha256(JSON.stringify(artifactsManifest));
  const releasePackage = releaseManager.generateReleasePackage(cir, auditReport, sourceDeterministicHash);

  if (!fs.existsSync(governanceDir)) fs.mkdirSync(governanceDir, { recursive: true });

  fs.writeFileSync(path.join(governanceDir, 'governance-audit.json'), JSON.stringify(auditReport, null, 2), 'utf-8');
  fs.writeFileSync(path.join(governanceDir, 'release-package.json'), JSON.stringify(releasePackage, null, 2), 'utf-8');

  // Save Incremental Cache
  cacheManager.saveCache(currentFileHashes);

  const generationDurationMs = Date.now() - tGenStart;
  const totalDurationMs = Date.now() - startTime;
  const memoryUsageMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

  const buildManifest = {
    version: '3.0.0',
    compiler: 'ptx-kos-compiler-v3.0.0',
    commit: 'compiler-v3.0-governance-release',
    generated_at: new Date().toISOString(),
    governance_status: {
      compliance_score: auditReport.complianceScore,
      status: auditReport.auditSummary.status,
      active_adrs_count: auditReport.activeAdrsCount,
      approved_rfcs_count: auditReport.approvedRfcsCount
    },
    benchmark_suite_metrics: {
      parse_duration_ms: parseDurationMs,
      cir_duration_ms: cirDurationMs,
      parallel_generation_duration_ms: generationDurationMs,
      total_duration_ms: totalDurationMs,
      heap_memory_usage_mb: memoryUsageMB,
      total_objects_parsed: astList.length,
      registered_plugins_count: plugins.length,
      is_incremental_build: isIncremental
    },
    change_impact_analysis: impactAnalysis,
    source_deterministic_checksum_sha256: sourceDeterministicHash,
    artifacts: artifactsManifest
  };

  const manifestPath = path.join(generatedDir, 'knowledge-build.json');
  fs.writeFileSync(manifestPath, JSON.stringify(buildManifest, null, 2), 'utf-8');

  console.log(`✅ Stage 5 Passed: Emitted Governance Audit Report & Release Package v3.0.0.`);
  console.log(`📊 [COMPILER 3.0 BENCHMARK] Total Build Time: ${totalDurationMs}ms (Parse: ${parseDurationMs}ms, CIR: ${cirDurationMs}ms, Parallel Gen: ${generationDurationMs}ms, Memory: ${memoryUsageMB}MB).`);
  console.log(`🎉 [PTX KOS COMPILER v3.0.0 GOVERNANCE EDITION] Execution Completed Successfully!`);
}

// Allow direct execution
if (require.main === module) {
  const rootDir = path.resolve(__dirname, '../../../');
  runKnowledgeBuild(rootDir).catch(console.error);
}
