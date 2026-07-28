import { TournamentRepository, DomainEventPayload } from '../repository/tournament.repository';
import { CreateTournamentParams, RegisterTeamParams, ApproveTeamParams } from '../db/supabase-client';

export interface ProductValidationResult {
  metricName: string;
  targetValue: string;
  actualValue: string;
  passed: boolean;
}

export class TournamentApplicationService {
  private repo: TournamentRepository;

  constructor() {
    this.repo = new TournamentRepository();
  }

  async handleCreateTournament(params: CreateTournamentParams): Promise<{ tournamentId: string; inviteLink: string; event: DomainEventPayload; validation: ProductValidationResult }> {
    const startTime = Date.now();
    const result = await this.repo.createTournament(params);
    const executionTimeSec = (Date.now() - startTime) / 1000;

    return {
      ...result,
      validation: {
        metricName: 'Tournament Creation Time',
        targetValue: '< 10 min',
        actualValue: `${executionTimeSec.toFixed(2)} sec`,
        passed: executionTimeSec < 600
      }
    };
  }

  async handleRegisterTeam(params: RegisterTeamParams): Promise<{ teamId: string; status: string; event: DomainEventPayload; validation: ProductValidationResult }> {
    const startTime = Date.now();
    const result = await this.repo.registerTeam(params);
    const executionTimeSec = (Date.now() - startTime) / 1000;

    return {
      ...result,
      validation: {
        metricName: 'Team Registration Time',
        targetValue: '< 2 min',
        actualValue: `${executionTimeSec.toFixed(2)} sec`,
        passed: executionTimeSec < 120
      }
    };
  }

  async handleApproveTeam(params: ApproveTeamParams): Promise<{ status: string; event: DomainEventPayload }> {
    return await this.repo.approveTeam(params);
  }
}
