import { SchedulingApplicationService } from '../../../../../services/scheduling-application.service';
import { StructuredLogger } from '../../../../../logger/structured-logger';
import { verifyJwtToken } from '../../../../../auth/jwt-verifier';

export async function POST(request: Request) {
  const traceId = 'trc_' + Date.now();
  const requestId = 'req_' + Date.now();
  const authHeader = request.headers.get('authorization');

  try {
    const claims = verifyJwtToken(authHeader);
    const body = await request.json();

    const service = new SchedulingApplicationService();
    const result = await service.generateRoundRobinSchedule({
      tournamentId: body.tournamentId,
      teams: body.teams || ['FC Về Nhì', 'FC Anh Em', 'FC Sài Gòn', 'FC Hà Nội'],
      venues: body.venues || ['Sân 1 PTX Stadium', 'Sân 2 PTX Stadium'],
      startDate: body.startDate || new Date().toISOString()
    });

    StructuredLogger.info('API_SCHEDULE_GENERATED_SUCCESS', {
      tournamentId: body.tournamentId,
      totalMatches: result.totalMatchesScheduled,
      totalRounds: result.totalRounds
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
    StructuredLogger.error('API_SCHEDULE_GENERATED_FAILED', error, { traceId, requestId });
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
