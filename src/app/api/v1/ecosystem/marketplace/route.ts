import { PluginMarketplaceService } from '../../../../../ecosystem/marketplace/plugin-marketplace.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';

const marketplaceService = new PluginMarketplaceService();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const plugins = marketplaceService.getAvailablePlugins();

    return new Response(JSON.stringify({ success: true, data: plugins }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
