import { AdminDashboardService } from '../../../../../admin/services/dashboard.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';
import { ProductionStructuredLogger } from '../../../../../logger/structured-logger';
import * as path from 'path';

const dashboardService = new AdminDashboardService();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const tenantAuth = JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const rootDir = path.resolve(__dirname, '../../../../../../');
    const overview = dashboardService.getSystemOverview(rootDir);
    const history = dashboardService.getBuildHistory(rootDir);

    ProductionStructuredLogger.info(
      'ADMIN_DASHBOARD_OVERVIEW_FETCHED',
      { status: overview.status, totalObjects: overview.totalKnowledgeObjects },
      tenantAuth.orgId
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          overview,
          history
        },
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
