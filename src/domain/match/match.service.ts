import { AddGoalContractInput } from '../../../generated/contracts/zod-schemas';
import { MatchRepository } from '../../repository/match.repository';
import { RealtimeBroadcastService } from '../../realtime/broadcast.service';

export class MatchApplicationService {
  constructor(
    private matchRepo: MatchRepository,
    private broadcastService: RealtimeBroadcastService
  ) {}

  /**
   * Executive Goal Recording Atomic Transaction
   * Strictly Enforces BUS-RULE-007, ADR-001, and Strict 6-Layer Architecture
   */
  async recordGoal(input: AddGoalContractInput) {
    // 1. Layer 4: Call Repository to execute PostgreSQL Atomic RPC fn_add_goal (Layer 5 & 6)
    const rpcResult = await this.matchRepo.executeAtomicAddGoal(input);

    if (!rpcResult.success) {
      throw new Error(`ERR_DATABASE_RPC_FAILURE: ${rpcResult.message || 'RPC execution failed'}`);
    }

    // 2. Workstream B4: Trigger Realtime SSE Goal Broadcast Stream (< 500ms NFR Target)
    const broadcastPayload = {
      event_id: rpcResult.event_id,
      event_type: 'MATCH_GOAL_ADDED',
      match_id: input.match_id,
      team_id: input.team_id,
      player_id: input.player_id,
      minute: input.minute,
      goal_type: input.goal_type,
      timestamp: new Date().toISOString()
    };

    this.broadcastService.broadcastGoalAlert(broadcastPayload);

    return rpcResult;
  }
}
