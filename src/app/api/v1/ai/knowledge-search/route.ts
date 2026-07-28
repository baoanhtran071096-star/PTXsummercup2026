import { KnowledgeIndexerService } from '../../../../../ai/rag/knowledge-indexer';
import { RetrievalEngineService } from '../../../../../ai/rag/retrieval-engine';
import { GroundedAnswerService } from '../../../../../ai/rag/grounded-answer-service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';
import { ProductionStructuredLogger } from '../../../../../logger/structured-logger';
import * as path from 'path';

const indexer = new KnowledgeIndexerService();
const rootDir = path.resolve(__dirname, '../../../../../../');
indexer.buildIndex(rootDir);

const retriever = new RetrievalEngineService(indexer);
const groundedAiService = new GroundedAnswerService(retriever);

/**
 * SPRINT 2: AI KNOWLEDGE ASSISTANT API ROUTE HANDLER
 * POST /api/v1/ai/knowledge-search
 * Enforces Zero-Hallucination Policy & CTO Grounded Answer Template
 */
export async function POST(req: Request) {
  const startTime = Date.now();
  let tenantAuth: any = null;

  try {
    const authHeader = req.headers.get('Authorization');
    tenantAuth = JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const body = await req.json();
    const query = body.question || body.query;

    if (!query) {
      return new Response(JSON.stringify({ success: false, error: 'Question is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate Grounded Answer (Question ➔ Retrieved Evidence ➔ Answer ➔ Source Objects ➔ Confidence)
    const groundedResult = groundedAiService.generateGroundedAnswer(query);

    ProductionStructuredLogger.info(
      'AI_RAG_SEARCH_SUCCESS',
      {
        query,
        confidence: groundedResult.confidence_score,
        sources_count: groundedResult.source_objects.length,
        duration_ms: Date.now() - startTime
      },
      tenantAuth.orgId
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: groundedResult,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    ProductionStructuredLogger.error('AI_RAG_SEARCH_FAILURE', error, tenantAuth?.orgId);
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'ERR_AI_SEARCH_FAILED', message: error.message }
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
