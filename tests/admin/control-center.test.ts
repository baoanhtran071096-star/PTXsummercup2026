import { AdminDashboardService } from '../../src/admin/services/dashboard.service';
import { ArtifactExplorerService } from '../../src/admin/services/artifact-explorer.service';
import { KnowledgeGraphService } from '../../src/admin/services/knowledge-graph.service';
import { GET as GETDashboard } from '../../src/app/api/v1/admin/dashboard/route';
import { GET as GETGraph } from '../../src/app/api/v1/admin/graph/route';
import { GET as GETArtifacts } from '../../src/app/api/v1/admin/artifacts/route';
import * as path from 'path';

async function runSprint3AdminPortalTests() {
  console.log('🧪 [SPRINT 3 ADMIN PORTAL TEST SUITE] Starting Epics 1 - 5 Verification Tests...');

  const rootDir = path.resolve(__dirname, '../../');

  // Test 1: Epic 1 & 4 - Admin Dashboard Overview & Build History
  console.log('\n--- Test 1: Epic 1 & 4 - Admin Dashboard Overview & Build History ---');
  const dashboardService = new AdminDashboardService();
  const overview = dashboardService.getSystemOverview(rootDir);
  const history = dashboardService.getBuildHistory(rootDir);

  if (!overview || overview.status !== 'HEALTHY' || history.length === 0) {
    throw new Error('Test 1 Failed: Admin Dashboard Overview invalid');
  }
  console.log(`✅ Test 1 Passed: System Health [${overview.status}], Compiler Version: ${overview.compilerVersion}, Checksum: ${overview.sourceDeterministicChecksum.slice(0, 10)}...`);

  // Test 2: Epic 2 - Artifact Explorer Bi-directional Traceability
  console.log('\n--- Test 2: Epic 2 - Artifact Explorer Bi-directional Traceability ---');
  const artifactService = new ArtifactExplorerService();
  const traceTree = artifactService.getTraceabilityTree(rootDir);

  if (traceTree.length === 0 || !traceTree[0].knowledgeObjectId) {
    throw new Error('Test 2 Failed: Artifact Explorer Traceability Tree empty');
  }
  console.log(`✅ Test 2 Passed: Traced ${traceTree.length} Knowledge-to-Runtime Chains.`);

  // Test 3: Epic 3 - Knowledge Graph Visualizer
  console.log('\n--- Test 3: Epic 3 - Interactive Knowledge Graph Visualizer ---');
  const graphService = new KnowledgeGraphService();
  const graphData = graphService.getInteractiveKnowledgeGraph(rootDir);

  if (graphData.nodes.length === 0 || graphData.links.length === 0) {
    throw new Error('Test 3 Failed: Knowledge Graph Data empty');
  }
  console.log(`✅ Test 3 Passed: Knowledge Graph generated with ${graphData.nodes.length} Nodes & ${graphData.links.length} Edges.`);

  // Test 4: Epic 5 - Admin Portal API Route Handlers Integration Test
  console.log('\n--- Test 4: Epic 5 - Admin Portal API Route Handlers ---');
  const mockReq = new Request('http://localhost:3000/api/v1/admin/dashboard');

  const dashRes = await GETDashboard(mockReq);
  const dashJson = await dashRes.json();

  const graphRes = await GETGraph(mockReq);
  const graphJson = await graphRes.json();

  const artRes = await GETArtifacts(mockReq);
  const artJson = await artRes.json();

  if (dashRes.status !== 200 || !dashJson.success || graphRes.status !== 200 || artRes.status !== 200) {
    throw new Error('Test 4 Failed: Admin Portal API Route Handlers returned non-200 status');
  }
  console.log('✅ Test 4 Passed: 3 Admin Portal API Route Handlers returned HTTP 200 Envelopes successfully.');

  console.log('\n🎉 [SPRINT 3 ADMIN PORTAL TEST SUITE] All Epics 1 - 5 Passed 100%!');
}

runSprint3AdminPortalTests().catch((err) => {
  console.error('❌ Sprint 3 Admin Portal Test Suite Failed:', err);
  process.exit(1);
});
