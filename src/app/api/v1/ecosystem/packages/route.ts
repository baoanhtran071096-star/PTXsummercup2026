import { UniversalPackageRegistryService } from '../../../../../ecosystem/packages/package-registry.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';

const packageService = new UniversalPackageRegistryService();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const packages = packageService.getPublishedPackages();

    return new Response(JSON.stringify({ success: true, data: packages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
