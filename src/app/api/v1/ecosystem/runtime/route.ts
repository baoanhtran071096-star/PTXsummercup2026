import { ExtensionRuntimeService } from '../../../../../ecosystem/runtime/extension-runtime.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';

const extensionRuntimeService = new ExtensionRuntimeService();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const activeExtensionsCount = extensionRuntimeService.getActiveExtensionsCount();

    return new Response(JSON.stringify({ success: true, data: { activeExtensionsCount } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
