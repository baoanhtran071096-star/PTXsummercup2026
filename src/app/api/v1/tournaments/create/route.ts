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
    const result = await service.handleCreateTournament({
      name: body.name || 'PTX Summer Cup 2026',
      season: body.season || '2026',
      maxTeams: body.maxTeams || 16,
      format: body.format || 'ROUND_ROBIN',
      organizerId: claims.userId
    });

    StructuredLogger.info('API_TOURNAMENT_CREATED_SUCCESS', {
      tournamentId: result.tournamentId,
      inviteLink: result.inviteLink
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
    StructuredLogger.error('API_TOURNAMENT_CREATED_FAILED', error, { traceId, requestId });
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
