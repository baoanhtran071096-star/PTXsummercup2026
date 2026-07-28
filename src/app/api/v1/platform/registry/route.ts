import { EnterpriseArtifactRegistryService } from '../../../../../platform/registry/artifact-registry.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';
import * as path from 'path';

const registryService = new EnterpriseArtifactRegistryService();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const rootDir = path.resolve(__dirname, '../../../../../../');
    const artifacts = registryService.getRegisteredArtifacts(rootDir);

    return new Response(JSON.stringify({ success: true, data: artifacts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
