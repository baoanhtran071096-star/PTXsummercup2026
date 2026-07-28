import { KnowledgeStudioService } from '../../../../../platform/studio/knowledge-studio.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';
import * as path from 'path';

const studioService = new KnowledgeStudioService();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const rootDir = path.resolve(__dirname, '../../../../../../');
    const objects = studioService.getStudioKnowledgeObjects(rootDir);

    return new Response(JSON.stringify({ success: true, data: objects }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
