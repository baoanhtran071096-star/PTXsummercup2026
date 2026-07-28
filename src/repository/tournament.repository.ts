import { SupabaseClientHarness, CreateTournamentParams, RegisterTeamParams, ApproveTeamParams } from '../db/supabase-client';
import { StructuredLogger } from '../logger/structured-logger';

export interface DomainEventPayload {
  eventId: string;
  eventType: 'TOURNAMENT_CREATED' | 'REGISTRATION_OPENED' | 'TEAM_REGISTERED' | 'TEAM_APPROVED';
  timestamp: string;
  details: Record<string, unknown>;
}

export class TournamentRepository {
  private supabase: SupabaseClientHarness;

  constructor() {
    this.supabase = SupabaseClientHarness.getInstance();
  }

  async createTournament(params: CreateTournamentParams): Promise<{ tournamentId: string; inviteLink: string; event: DomainEventPayload }> {
    const response = await this.supabase.rpc<{ success: boolean; tournamentId: string; inviteLink: string; status: string }>('fn_create_tournament', {
      name: params.name,
      season: params.season,
      maxTeams: params.maxTeams,
      format: params.format,
      organizerId: params.organizerId
    });

    if (!response.data || response.error) {
      throw new Error(`Failed to create tournament: ${response.error?.message}`);
    }

    const event: DomainEventPayload = {
      eventId: 'evt_trn_' + Date.now(),
      eventType: 'TOURNAMENT_CREATED',
      timestamp: new Date().toISOString(),
      details: {
        tournamentId: response.data.tournamentId,
        name: params.name,
        organizerId: params.organizerId,
        inviteLink: response.data.inviteLink
      }
    };

    StructuredLogger.info('DOMAIN_EVENT_EMITTED', {
      eventType: event.eventType,
      tournamentId: response.data.tournamentId
    });

    return {
      tournamentId: response.data.tournamentId,
      inviteLink: response.data.inviteLink,
      event
    };
  }

  async registerTeam(params: RegisterTeamParams): Promise<{ teamId: string; status: string; event: DomainEventPayload }> {
    const response = await this.supabase.rpc<{ success: boolean; teamId: string; status: string }>('fn_register_team', {
      tournamentId: params.tournamentId,
      teamName: params.teamName,
      primaryColor: params.primaryColor,
      captainName: params.captainName,
      captainPhone: params.captainPhone,
      rosterCount: params.playerRoster.length
    });

    if (!response.data || response.error) {
      throw new Error(`Failed to register team: ${response.error?.message}`);
    }

    const event: DomainEventPayload = {
      eventId: 'evt_team_' + Date.now(),
      eventType: 'TEAM_REGISTERED',
      timestamp: new Date().toISOString(),
      details: {
        teamId: response.data.teamId,
        tournamentId: params.tournamentId,
        teamName: params.teamName,
        captainName: params.captainName
      }
    };

    StructuredLogger.info('DOMAIN_EVENT_EMITTED', {
      eventType: event.eventType,
      teamId: response.data.teamId
    });

    return {
      teamId: response.data.teamId,
      status: response.data.status,
      event
    };
  }

  async approveTeam(params: ApproveTeamParams): Promise<{ status: string; event: DomainEventPayload }> {
    const response = await this.supabase.rpc<{ success: boolean; status: string }>('fn_approve_team', {
      tournamentId: params.tournamentId,
      teamId: params.teamId,
      approvedBy: params.approvedBy
    });

    if (!response.data || response.error) {
      throw new Error(`Failed to approve team: ${response.error?.message}`);
    }

    const event: DomainEventPayload = {
      eventId: 'evt_appr_' + Date.now(),
      eventType: 'TEAM_APPROVED',
      timestamp: new Date().toISOString(),
      details: {
        tournamentId: params.tournamentId,
        teamId: params.teamId,
        approvedBy: params.approvedBy
      }
    };

    StructuredLogger.info('DOMAIN_EVENT_EMITTED', {
      eventType: event.eventType,
      teamId: params.teamId
    });

    return {
      status: response.data.status,
      event
    };
  }
}
