// PTX PLAYER SERVICE – Business Capability Layer
import { dbService, Player } from '../../data-platform/supabase/db.service';

export class PlayerService {
  async getAllPlayers(): Promise<Player[]> {
    return dbService.getPlayers();
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return dbService.getPlayers(teamId);
  }

  async getTopScorers(limit = 10): Promise<Player[]> {
    return dbService.getTopScorers(limit);
  }

  async createPlayer(data: Omit<Player, 'id'>): Promise<Player> {
    return dbService.createPlayer(data);
  }

  async updateStats(playerId: string, stats: Partial<Pick<Player, 'goals' | 'assists' | 'yellow_cards' | 'red_cards' | 'profile'>>): Promise<void> {
    return dbService.updatePlayerStats(playerId, stats);
  }

  async getPlayerCount(): Promise<number> {
    const players = await dbService.getPlayers();
    return players.length;
  }

  async getTopScorerSummary(): Promise<{ name: string; goals: number; team_id: string }[]> {
    const scorers = await dbService.getTopScorers(5);
    return scorers.map(p => ({ name: p.name, goals: p.goals, team_id: p.team_id }));
  }
}

export const playerService = new PlayerService();
