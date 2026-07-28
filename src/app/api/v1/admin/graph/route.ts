import { KnowledgeGraphService } from '../../../../../admin/services/knowledge-graph.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';
import * as path from 'path';

const graphService = new KnowledgeGraphService();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const rootDir = path.resolve(__dirname, '../../../../../../');
    const graphData = graphService.getInteractiveKnowledgeGraph(rootDir);

    return new Response(
      JSON.stringify({
        success: true,
        data: graphData,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
