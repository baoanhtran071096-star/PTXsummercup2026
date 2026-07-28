import { TournamentApplicationService } from '../../../../../services/tournament-application.service';
import { StructuredLogger } from '../../../../../logger/structured-logger';
import { verifyJwtToken } from '../../../../../auth/jwt-verifier';

export async function POST(request: Request) {
  const traceId = 'trc_' + Date.now();
  const requestId = 'req_' + Date.now();
  const authHeader = request.headers.get('authorization');

  try {
    const claims = verifyJwtToken(authHeader);
    const body = await request.json();

    const service = new TournamentApplicationService();
    const result = await service.handleApproveTeam({
      tournamentId: body.tournamentId,
      teamId: body.teamId,
      approvedBy: claims.userId
    });

    StructuredLogger.info('API_TEAM_APPROVED_SUCCESS', {
      teamId: body.teamId,
      tournamentId: body.tournamentId,
      approvedBy: claims.userId
    }, { traceId, requestId, orgId: claims.orgId });

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        meta: { traceId, requestId, status: 200 }
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  } catch (error: any) {
    StructuredLogger.error('API_TEAM_APPROVED_FAILED', error, { traceId, requestId });
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: error.message },
        meta: { traceId, requestId, status: 400 }
      }),
      { status: 400, headers: { 'content-type': 'application/json' } }
    );
  }
}
