// ================================================================
// PTX ANALYTICS ENGINE
// Tính toán BXH, thống kê, dự đoán kết quả trận đấu.
// Không cần Gemini — pure TypeScript logic (Free).
// ================================================================

import { OrchestratorRequest } from '../orchestrator/orchestrator.types';

interface MatchResult {
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  matchday: number;
  date: string;
}

interface StandingEntry {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export class AnalyticsEngine {
  async handle(request: OrchestratorRequest): Promise<unknown> {
    const { action, data } = request.payload as { action: string; data: Record<string, unknown> };
    console.log(`[AnalyticsEngine] Action: ${action}`);

    switch (action) {
      case 'updateStandings': return this.updateStandings(data);
      case 'computeStats':    return this.computeStats(data);
      case 'predict':         return this.predict(data);
      case 'summarize':       return this.summarize(data);
      default:
        throw new Error(`[AnalyticsEngine] Unknown action: ${action}`);
    }
  }

  /**
   * Cập nhật bảng xếp hạng từ danh sách kết quả trận đấu.
   */
  private updateStandings(data: Record<string, unknown>): StandingEntry[] {
    const results = (data.results ?? []) as MatchResult[];
    const teamsMap = new Map<string, Omit<StandingEntry, 'rank'>>();

    const ensureTeam = (team: string) => {
      if (!teamsMap.has(team)) {
        teamsMap.set(team, { team, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 });
      }
      return teamsMap.get(team)!;
    };

    for (const match of results) {
      const home = ensureTeam(match.homeTeam);
      const away = ensureTeam(match.awayTeam);

      home.played++; away.played++;
      home.goalsFor += match.homeGoals; home.goalsAgainst += match.awayGoals;
      away.goalsFor += match.awayGoals; away.goalsAgainst += match.homeGoals;

      if (match.homeGoals > match.awayGoals) {
        home.won++; home.points += 3; away.lost++;
      } else if (match.homeGoals === match.awayGoals) {
        home.drawn++; home.points++; away.drawn++; away.points++;
      } else {
        away.won++; away.points += 3; home.lost++;
      }
      home.goalDiff = home.goalsFor - home.goalsAgainst;
      away.goalDiff = away.goalsFor - away.goalsAgainst;
    }

    const standings = Array.from(teamsMap.values())
      .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor)
      .map((entry, i) => ({ rank: i + 1, ...entry }));

    return standings;
  }

  private computeStats(data: Record<string, unknown>) {
    const match = data as unknown as MatchResult;
    return {
      totalGoals: (match.homeGoals ?? 0) + (match.awayGoals ?? 0),
      winner: match.homeGoals > match.awayGoals
        ? match.homeTeam
        : match.awayGoals > match.homeGoals
          ? match.awayTeam
          : 'Hòa',
      scoreline: `${match.homeTeam} ${match.homeGoals} - ${match.awayGoals} ${match.awayTeam}`,
      computedAt: new Date().toISOString(),
    };
  }

  private predict(data: Record<string, unknown>) {
    // Simple prediction based on available stats
    const homeAdvantage = 0.1;
    const homeWinProb = Math.min(0.9, 0.4 + homeAdvantage);
    return {
      homeWinProbability: Math.round(homeWinProb * 100),
      drawProbability: 25,
      awayWinProbability: Math.round((1 - homeWinProb - 0.25) * 100),
      note: 'Dự đoán dựa trên lợi thế sân nhà. Tích hợp dữ liệu thống kê để tăng độ chính xác.',
      teams: data,
    };
  }

  private summarize(data: Record<string, unknown>) {
    const results = (data.results ?? []) as MatchResult[];
    const totalGoals = results.reduce((sum, m) => sum + m.homeGoals + m.awayGoals, 0);
    return {
      totalMatches: results.length,
      totalGoals,
      avgGoalsPerMatch: results.length ? (totalGoals / results.length).toFixed(2) : '0',
      summarizedAt: new Date().toISOString(),
    };
  }
}
