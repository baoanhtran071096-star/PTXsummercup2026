// PTX MATCH SERVICE – Business Capability Layer
import { dbService, Match } from '../../data-platform/supabase/db.service';

export class MatchService {
  async getAllMatches(): Promise<Match[]> {
    return dbService.getMatches();
  }

  async getFinishedMatches(): Promise<Match[]> {
    return dbService.getMatches('finished');
  }

  async getScheduledMatches(): Promise<Match[]> {
    return dbService.getMatches('scheduled');
  }

  async getLiveMatches(): Promise<Match[]> {
    return dbService.getMatches('live');
  }

  async getUpcomingMatches(limit = 5): Promise<Match[]> {
    const scheduled = await dbService.getMatches('scheduled');
    return scheduled.slice(0, limit);
  }

  async saveResult(matchId: string, homeGoals: number, awayGoals: number): Promise<void> {
    return dbService.saveMatchResult(matchId, homeGoals, awayGoals);
  }

  async createMatch(data: Omit<Match, 'id'>): Promise<Match> {
    return dbService.createMatch(data);
  }

  async getMatchSummary(): Promise<{ total: number; finished: number; scheduled: number; live: number }> {
    const [all, finished, scheduled, live] = await Promise.all([
      dbService.getMatches(),
      dbService.getMatches('finished'),
      dbService.getMatches('scheduled'),
      dbService.getMatches('live'),
    ]);
    return { total: all.length, finished: finished.length, scheduled: scheduled.length, live: live.length };
  }

  async getRecentResults(limit = 5): Promise<Match[]> {
    const finished = await dbService.getMatches('finished');
    return finished.slice(-limit).reverse();
  }

  formatScore(match: Match): string {
    if (match.home_goals == null || match.away_goals == null) return 'TBD';
    return `${match.home_goals} - ${match.away_goals}`;
  }

  getMatchWinner(match: Match): 'home' | 'away' | 'draw' | null {
    if (match.home_goals == null || match.away_goals == null) return null;
    if (match.home_goals > match.away_goals) return 'home';
    if (match.away_goals > match.home_goals) return 'away';
    return 'draw';
  }
}

export const matchService = new MatchService();
