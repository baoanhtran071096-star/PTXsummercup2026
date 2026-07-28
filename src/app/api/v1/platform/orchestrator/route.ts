import { BuildOrchestratorService } from '../../../../../platform/orchestrator/build-orchestrator.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';
import * as path from 'path';

const orchestratorService = new BuildOrchestratorService();

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const rootDir = path.resolve(__dirname, '../../../../../../');
    const result = await orchestratorService.executeFullPipeline(rootDir);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
