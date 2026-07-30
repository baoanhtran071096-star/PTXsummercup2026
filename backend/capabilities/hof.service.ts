// PTX HALL OF FAME SERVICE – Business Capability Layer
import { dbService } from '../../data-platform/supabase/db.service';

export interface HofEntry {
  category: string; // 'top_scorer' | 'most_assists' | 'best_gk' | 'fair_play'
  playerName: string;
  teamName?: string;
  value: string | number;
  season: string;
}

export class HofService {
  async getTopScorerOfTournament(): Promise<HofEntry | null> {
    const scorers = await dbService.getTopScorers(1);
    if (scorers.length === 0) return null;
    const top = scorers[0];
    return {
      category: 'top_scorer',
      playerName: top.name,
      teamName: top.team_id,
      value: top.goals,
      season: 'Summer Cup 2026',
    };
  }

  async getMostAssists(): Promise<HofEntry | null> {
    const players = await dbService.getPlayers();
    if (players.length === 0) return null;
    const top = players.sort((a, b) => b.assists - a.assists)[0];
    return {
      category: 'most_assists',
      playerName: top.name,
      value: top.assists,
      season: 'Summer Cup 2026',
    };
  }

  async getFairPlayTeam(): Promise<HofEntry | null> {
    // Team with least yellow + red cards total
    const players = await dbService.getPlayers();
    if (players.length === 0) return null;
    const teamCards: Record<string, number> = {};
    for (const p of players) {
      teamCards[p.team_id] = (teamCards[p.team_id] ?? 0) + p.yellow_cards + p.red_cards * 3;
    }
    const fairestTeam = Object.entries(teamCards).sort((a, b) => a[1] - b[1])[0];
    return {
      category: 'fair_play',
      playerName: 'Đội Fair Play',
      teamName: fairestTeam[0],
      value: fairestTeam[1],
      season: 'Summer Cup 2026',
    };
  }

  async getSummary(): Promise<HofEntry[]> {
    const [scorer, assists, fairPlay] = await Promise.all([
      this.getTopScorerOfTournament(),
      this.getMostAssists(),
      this.getFairPlayTeam(),
    ]);
    return [scorer, assists, fairPlay].filter(Boolean) as HofEntry[];
  }
}

export const hofService = new HofService();
