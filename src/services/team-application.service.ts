import { TeamEntity, CreateTeamInput } from '../domain/team/team-model';
import { MediaAssetV12ApplicationService } from './media-asset-v1-2-application.service';

export interface TeamProfileDTO extends TeamEntity {
  resolvedLogoUrl: string;
}

export class TeamApplicationService {
  private memoryTeams: Map<string, TeamEntity> = new Map();
  private damService: MediaAssetV12ApplicationService;

  constructor() {
    this.damService = new MediaAssetV12ApplicationService();
  }

  async createTeam(input: CreateTeamInput): Promise<TeamProfileDTO> {
    const teamId = 'team_' + Date.now();
    const timestamp = new Date().toISOString();

    const team: TeamEntity = {
      id: teamId,
      seasonId: input.seasonId,
      name: input.name,
      fullName: input.fullName,
      colorPrimary: input.colorPrimary,
      colorSecondary: input.colorSecondary,
      logoAssetId: input.logoAssetId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.memoryTeams.set(teamId, team);
    return this.getTeamProfile(teamId);
  }

  async getTeamProfile(teamId: string): Promise<TeamProfileDTO> {
    const team = this.memoryTeams.get(teamId);
    if (!team) {
      throw new Error(`ERR_TEAM_NOT_FOUND: Team ${teamId} does not exist.`);
    }

    // Integrated DAM AssetResolver Call
    let resolvedLogoUrl = 'https://ptx.vn/assets/default-logo-placeholder.png';
    if (team.logoAssetId) {
      resolvedLogoUrl = await this.damService.resolveAssetUrlV12(team.logoAssetId, {
        variantSize: 'small'
      });
    }

    return {
      ...team,
      resolvedLogoUrl
    };
  }
}
