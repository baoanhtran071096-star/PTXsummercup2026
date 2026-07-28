import { MatchConsoleApplicationService } from '../../../../../services/match-console-application.service';
import { StructuredLogger } from '../../../../../logger/structured-logger';
import { verifyJwtToken } from '../../../../../auth/jwt-verifier';

export async function POST(request: Request) {
  const traceId = 'trc_' + Date.now();
  const requestId = 'req_' + Date.now();
  const authHeader = request.headers.get('authorization');

  try {
    const claims = verifyJwtToken(authHeader);
    const body = await request.json();

    const service = new MatchConsoleApplicationService();
    const result = await service.handleRecordMatchEvent({
      matchId: body.matchId,
      eventType: body.eventType,
      minute: body.minute || 1,
      details: body.details || {}
    });

    StructuredLogger.info('API_MATCH_EVENT_RECORDED_SUCCESS', {
      matchId: body.matchId,
      eventType: body.eventType,
      eventId: result.eventId
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
    StructuredLogger.error('API_MATCH_EVENT_RECORDED_FAILED', error, { traceId, requestId });
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
