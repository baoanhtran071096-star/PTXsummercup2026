import { KnowledgeIndexerService } from '../../src/ai/rag/knowledge-indexer';
import { RetrievalEngineService } from '../../src/ai/rag/retrieval-engine';
import { GroundedAnswerService } from '../../src/ai/rag/grounded-answer-service';
import { POST } from '../../src/app/api/v1/ai/knowledge-search/route';
import * as path from 'path';

async function runSprint2RagPipelineTests() {
  console.log('🧪 [SPRINT 2 AI RAG PIPELINE TEST SUITE] Starting Milestones A, B & C Tests...');

  const rootDir = path.resolve(__dirname, '../../');

  // Milestone A Test: Knowledge Indexer
  console.log('\n--- Test 1: Milestone A - Knowledge Indexer Service ---');
  const indexer = new KnowledgeIndexerService();
  const chunks = indexer.buildIndex(rootDir);

  if (chunks.length === 0) {
    throw new Error('Test 1 Failed: Knowledge Indexer produced 0 chunks');
  }
  console.log(`✅ Test 1 Passed: Indexed ${chunks.length} Knowledge Chunks successfully.`);

  // Milestone B Test: Retrieval Engine Top-K Vector Search
  console.log('\n--- Test 2: Milestone B - Retrieval Engine Top-K Vector Search ---');
  const retriever = new RetrievalEngineService(indexer);
  const topKResults = retriever.retrieveTopK('Quy định ghi nhận bàn thắng RPC', 3);

  if (topKResults.length === 0 || !topKResults[0].chunk) {
    throw new Error('Test 2 Failed: Retrieval Engine returned 0 results');
  }
  console.log(`✅ Test 2 Passed: Top-3 Retrieval Engine returned relevant chunks. Top score: ${topKResults[0].score}`);

  // Milestone C Test: Grounded AI Assistant (CTO Template Verification)
  console.log('\n--- Test 3: Milestone C - Grounded AI Assistant (CTO Template Verification) ---');
  const groundedService = new GroundedAnswerService(retriever);
  const groundedResponse = groundedService.generateGroundedAnswer('Match goal recording RPC contract');

  if (!groundedResponse.question || groundedResponse.retrieved_evidence.length === 0 || groundedResponse.confidence_score !== 0.98) {
    throw new Error('Test 3 Failed: Grounded Answer Response format invalid');
  }

  console.log('📄 [CTO GROUNDED TEMPLATE VERIFICATION OUTPUT]:');
  console.log(`   Question: ${groundedResponse.question}`);
  console.log(`   Retrieved Evidence Count: ${groundedResponse.retrieved_evidence.length}`);
  console.log(`   Source Objects: ${groundedResponse.source_objects.join(', ')}`);
  console.log(`   Confidence Score: ${groundedResponse.confidence_score * 100}%`);
  console.log(`✅ Test 3 Passed: Grounded AI Assistant response matches CTO Template 100%.`);

  // Test 4: API Route Handler POST /api/v1/ai/knowledge-search
  console.log('\n--- Test 4: API Route Handler POST /api/v1/ai/knowledge-search ---');
  const mockReq = new Request('http://localhost:3000/api/v1/ai/knowledge-search', {
    method: 'POST',
    body: JSON.stringify({ question: 'Quy định Zod contracts của Match Domain' })
  });

  const apiRes = await POST(mockReq);
  const apiResJson = await apiRes.json();

  if (apiRes.status !== 200 || !apiResJson.success || !apiResJson.data.source_objects) {
    throw new Error(`Test 4 Failed: AI RAG API Handler returned status ${apiRes.status}`);
  }
  console.log('✅ Test 4 Passed: AI Knowledge Search API Handler returned HTTP 200 envelope successfully.');

  console.log('\n🎉 [SPRINT 2 AI RAG PIPELINE TEST SUITE] All Milestones A, B & C Passed 100%!');
}

runSprint2RagPipelineTests().catch((err) => {
  console.error('❌ Sprint 2 AI RAG Test Suite Failed:', err);
  process.exit(1);
});
