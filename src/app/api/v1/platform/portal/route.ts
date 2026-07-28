import { DeveloperPortalService } from '../../../../../platform/portal/developer-portal.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';

const portalService = new DeveloperPortalService();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const plugins = portalService.getRegisteredPlugins();
    const sdkDocs = portalService.getSdkDocumentation();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          plugins,
          sdkDocs
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
