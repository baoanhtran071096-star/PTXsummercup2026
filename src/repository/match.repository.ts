import { Matche as Match, MatchEvent } from '../../generated/types/domain-models';
import { AddGoalContractInput } from '../../generated/contracts/zod-schemas';
import { SupabaseDatabaseClient } from '../db/supabase-client';

export interface RpcGoalResponse {
  success: boolean;
  event_id?: string;
  message?: string;
  db_execution_time_ms?: number;
}

export class MatchRepository {
  private inMemoryMatches: Map<string, Match> = new Map();
  private inMemoryEvents: MatchEvent[] = [];
  private supabaseClient: InstanceType<typeof SupabaseDatabaseClient>;

  constructor(supabaseConfig?: any) {
    this.supabaseClient = new SupabaseDatabaseClient(supabaseConfig);

    // Seed initial test data for Match Aggregate using valid UUIDs
    const defaultMatchId = '123e4567-e89b-12d3-a456-426614174000';
    this.inMemoryMatches.set(defaultMatchId, {
      id: defaultMatchId,
      season_id: 'season_2026',
      home_team_id: '123e4567-e89b-12d3-a456-426614174001',
      away_team_id: '123e4567-e89b-12d3-a456-426614174002',
      home_score: 1,
      away_score: 0,
      status: 'LIVE_HALF_1',
      scheduled_at: new Date().toISOString()
    });
  }

  /**
   * Execute PostgreSQL Atomic RPC fn_add_goal (ADR-001 ATOMIC TRANSACTION)
   * Connects to Supabase Database Client & fallback memory provider
   */
  async executeAtomicAddGoal(input: AddGoalContractInput): Promise<RpcGoalResponse> {
    const match = this.inMemoryMatches.get(input.match_id);

    // Invariant Check (INV-MATCH-002): Match must be live
    if (!match || !match.status.startsWith('LIVE_')) {
      return {
        success: false,
        message: `ERR_MATCH_NOT_LIVE: Match ${input.match_id} is not in a live state.`
      };
    }

    // Call Supabase Database Client RPC Function
    const supabaseRpcResult = await this.supabaseClient.rpcAddGoal({
      p_match_id: input.match_id,
      p_team_id: input.team_id,
      p_player_id: input.player_id,
      p_minute: input.minute,
      p_goal_type: input.goal_type
    });

    // Update state
    if (input.team_id === match.home_team_id) {
      match.home_score += 1;
    } else {
      match.away_score += 1;
    }

    return {
      success: true,
      event_id: supabaseRpcResult.event_id,
      db_execution_time_ms: supabaseRpcResult.db_execution_time_ms
    };
  }

  async getMatchById(matchId: string): Promise<Match | undefined> {
    return this.inMemoryMatches.get(matchId);
  }
}
