// PTX STANDING SERVICE – Business Capability Layer
import { dbService, Standing } from '../../data-platform/supabase/db.service';

export class StandingService {
  async getStandings(): Promise<Standing[]> {
    return dbService.getStandings();
  }

  async getLeader(): Promise<Standing | null> {
    const standings = await dbService.getStandings();
    return standings[0] ?? null;
  }

  async getTop3(): Promise<Standing[]> {
    const standings = await dbService.getStandings();
    return standings.slice(0, 3);
  }

  async getTeamRank(teamId: string): Promise<number | null> {
    const standings = await dbService.getStandings();
    const found = standings.find(s => s.team_id === teamId);
    return found?.rank ?? null;
  }

  async getFormattedTable(): Promise<string> {
    const standings = await dbService.getStandings();
    const rows = standings.map(s =>
      `${s.rank}. ${s.team} — ${s.points}đ (${s.won}T ${s.drawn}H ${s.lost}B, GD:${s.goal_diff > 0 ? '+' : ''}${s.goal_diff})`
    );
    return rows.join('\n');
  }
}

export const standingService = new StandingService();
