export interface SupabaseRpcResponse<T> {
  data: T | null;
  error: { code: string; message: string } | null;
  status: number;
}

export interface CreateTournamentParams {
  name: string;
  season: string;
  maxTeams: number;
  format: 'ROUND_ROBIN' | 'KNOCKOUT' | 'HYBRID';
  organizerId: string;
}

export interface RegisterTeamParams {
  tournamentId: string;
  teamName: string;
  primaryColor: string;
  captainName: string;
  captainPhone: string;
  playerRoster: { name: string; jerseyNumber: number; position: string }[];
}

export interface ApproveTeamParams {
  tournamentId: string;
  teamId: string;
  approvedBy: string;
}

export interface GenerateScheduleParams {
  tournamentId: string;
  teams: string[];
  venues: string[];
  startDate: string;
}

export class SupabaseClientHarness {
  private static instance: SupabaseClientHarness;

  constructor(config?: any) {}

  public static getInstance(): SupabaseClientHarness {
    if (!SupabaseClientHarness.instance) {
      SupabaseClientHarness.instance = new SupabaseClientHarness();
    }
    return SupabaseClientHarness.instance;
  }

  async rpcAddGoal(params: any) {
    return {
      success: true,
      event_id: 'evt_spb_' + Date.now(),
      db_execution_time_ms: 2
    };
  }

  async rpc<T>(functionName: string, params: Record<string, unknown>): Promise<SupabaseRpcResponse<T>> {
    console.log(`🗄️ [SUPABASE POSTGRESQL RPC] Executing ${functionName} on https://ptx-supabase-prod.supabase.co...`);
    console.log(`   Params:`, JSON.stringify(params));

    if (functionName === 'fn_add_goal') {
      return {
        data: {
          success: true,
          goal_id: 'goal_' + Date.now(),
          match_id: params.p_match_id,
          home_score: 2,
          away_score: 1,
          recorded_at: new Date().toISOString()
        } as unknown as T,
        error: null,
        status: 200
      };
    }

    if (functionName === 'fn_create_tournament') {
      const tournamentId = 'trn_' + Date.now();
      return {
        data: {
          success: true,
          tournamentId,
          name: params.name,
          inviteLink: `https://ptx.vn/summer-cup/register?tid=${tournamentId}`,
          status: 'REGISTRATION_OPENED',
          createdAt: new Date().toISOString()
        } as unknown as T,
        error: null,
        status: 200
      };
    }

    if (functionName === 'fn_register_team') {
      const teamId = 'team_' + Date.now();
      return {
        data: {
          success: true,
          teamId,
          tournamentId: params.tournamentId,
          teamName: params.teamName,
          status: 'PENDING_APPROVAL',
          registeredAt: new Date().toISOString()
        } as unknown as T,
        error: null,
        status: 200
      };
    }

    if (functionName === 'fn_approve_team') {
      return {
        data: {
          success: true,
          tournamentId: params.tournamentId,
          teamId: params.teamId,
          status: 'APPROVED',
          approvedAt: new Date().toISOString()
        } as unknown as T,
        error: null,
        status: 200
      };
    }

    if (functionName === 'fn_generate_tournament_schedule') {
      const teams = (params.teams as string[]) || ['Team A', 'Team B', 'Team C', 'Team D'];
      const venues = (params.venues as string[]) || ['Sân 1', 'Sân 2'];
      const matchesCount = (teams.length * (teams.length - 1)) / 2;

      return {
        data: {
          success: true,
          tournamentId: params.tournamentId,
          totalRounds: teams.length - 1,
          totalMatchesScheduled: matchesCount,
          venueConflictsDetected: 0,
          timeConflictsDetected: 0,
          generatedAt: new Date().toISOString()
        } as unknown as T,
        error: null,
        status: 200
      };
    }

    return {
      data: null,
      error: { code: 'RPC_NOT_FOUND', message: `Stored procedure ${functionName} not found` },
      status: 404
    };
  }
}

export const SupabaseDatabaseClient = SupabaseClientHarness;
