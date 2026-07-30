// PTX MATCH SERVICE – Business Capability Layer
import { dbService, Match } from '../../data-platform/supabase/db.service';
import { teamService } from './team.service';

export class MatchService {
  private async populateTeamNames(matches: Match[]): Promise<Match[]> {
    const teams = await teamService.getAllTeams();
    const tm = Object.fromEntries(teams.map(t => [t.id, t.name]));
    return matches.map(m => ({
      ...m,
      home_team: m.home_team ?? tm[m.home_team_id] ?? 'Đội Chưa XĐ',
      away_team: m.away_team ?? tm[m.away_team_id] ?? 'Đội Chưa XĐ',
    }));
  }

  async getAllMatches(): Promise<Match[]> {
    const matches = await dbService.getMatches();
    return this.populateTeamNames(matches);
  }

  async getFinishedMatches(): Promise<Match[]> {
    const matches = await dbService.getMatches('finished');
    return this.populateTeamNames(matches);
  }

  async getScheduledMatches(): Promise<Match[]> {
    const matches = await dbService.getMatches('scheduled');
    return this.populateTeamNames(matches);
  }

  async getLiveMatches(): Promise<Match[]> {
    const matches = await dbService.getMatches('live');
    return this.populateTeamNames(matches);
  }

  async getUpcomingMatches(limit = 5): Promise<Match[]> {
    const scheduled = await dbService.getMatches('scheduled');
    const populated = await this.populateTeamNames(scheduled);
    return populated.slice(0, limit);
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
    const populated = await this.populateTeamNames(finished);
    return populated.slice(-limit).reverse();
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
