import { TournamentApplicationService } from '../../../../../services/tournament-application.service';
import { StructuredLogger } from '../../../../../logger/structured-logger';

export async function POST(request: Request) {
  const traceId = 'trc_' + Date.now();
  const requestId = 'req_' + Date.now();

  try {
    const body = await request.json();

    const service = new TournamentApplicationService();
    const result = await service.handleRegisterTeam({
      tournamentId: body.tournamentId,
      teamName: body.teamName,
      primaryColor: body.primaryColor || '#1D3557',
      captainName: body.captainName,
      captainPhone: body.captainPhone,
      playerRoster: body.playerRoster || []
    });

    StructuredLogger.info('API_TEAM_REGISTERED_SUCCESS', {
      teamId: result.teamId,
      tournamentId: body.tournamentId
    }, { traceId, requestId });

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        meta: { traceId, requestId, status: 200 }
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  } catch (error: any) {
    StructuredLogger.error('API_TEAM_REGISTERED_FAILED', error, { traceId, requestId });
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
