import { AddGoalContractSchema } from '../../../../../../generated/contracts/zod-schemas';
import { MatchRepository } from '../../../../../repository/match.repository';
import { MatchApplicationService } from '../../../../../domain/match/match.service';
import { RealtimeBroadcastService } from '../../../../../realtime/broadcast.service';
import { JwtTenantAuthVerifier } from '../../../../../auth/jwt-verifier';
import { ProductionStructuredLogger } from '../../../../../logger/structured-logger';

const matchRepo = new MatchRepository();
const broadcastService = new RealtimeBroadcastService();
const matchService = new MatchApplicationService(matchRepo, broadcastService);

/**
 * WORKSTREAM B2: PRODUCTION MVP API ROUTE HANDLER
 * Imports Zod Contracts directly from generated/contracts/zod-schemas.ts
 * Integrates JWT Tenant Auth & Production Structured Logging
 */
export async function POST(req: Request) {
  const startTime = Date.now();
  let tenantAuth: any = null;

  try {
    // 1. Layer 3 Security: JWT Auth & Multi-tenant Claim Verification
    const authHeader = req.headers.get('Authorization');
    tenantAuth = JwtTenantAuthVerifier.verifyTenantToken(authHeader);

    const rawBody = await req.json();

    // 2. Layer 2: Zod Contract Validation Schema directly from generated/
    const validatedInput = AddGoalContractSchema.parse(rawBody);

    // 3. Layer 4: Execute Application Service & Atomic RPC
    const result = await matchService.recordGoal(validatedInput);

    ProductionStructuredLogger.info(
      'API_GOAL_RECORDED_SUCCESS',
      {
        match_id: validatedInput.match_id,
        duration_ms: Date.now() - startTime,
        event_id: result.event_id
      },
      tenantAuth.orgId
    );

    const responsePayload = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    const isZodError = error.name === 'ZodError';
    const statusCode = isZodError ? 422 : 400;

    ProductionStructuredLogger.error(
      'API_GOAL_RECORDED_FAILURE',
      error,
      tenantAuth?.orgId
    );

    const errorPayload = {
      success: false,
      error: {
        code: isZodError ? 'ERR_VALIDATION_FAILED' : 'ERR_MATCH_OPERATION_FAILED',
        message: error.message || 'Validation or Operation Failed',
        details: isZodError ? error.errors : undefined
      },
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorPayload), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
