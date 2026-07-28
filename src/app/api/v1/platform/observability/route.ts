import { PlatformObservabilityService } from '../../../../../platform/observability/platform-observability.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';
import * as path from 'path';

const observabilityService = new PlatformObservabilityService();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const rootDir = path.resolve(__dirname, '../../../../../../');
    const metrics = observabilityService.getRealtimeMetrics(rootDir);

    return new Response(JSON.stringify({ success: true, data: metrics }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
