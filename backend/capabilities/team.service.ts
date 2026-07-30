// PTX TEAM SERVICE – Business Capability Layer
import { dbService, Team } from '../../data-platform/supabase/db.service';

export class TeamService {
  async getAllTeams(): Promise<Team[]> {
    return dbService.getTeams();
  }

  async getTeamById(id: string): Promise<Team | null> {
    const teams = await dbService.getTeams();
    return teams.find(t => t.id === id) ?? null;
  }

  async createTeam(data: Omit<Team, 'id'>): Promise<Team> {
    return dbService.createTeam(data);
  }

  async getTeamCount(): Promise<number> {
    const teams = await dbService.getTeams();
    return teams.length;
  }

  async getTeamNames(): Promise<string[]> {
    const teams = await dbService.getTeams();
    return teams.map(t => t.name);
  }
}

export const teamService = new TeamService();
