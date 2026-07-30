// ================================================================
// PTX ANALYTICS ENGINE (v2 – Supabase Connected)
// Tính toán BXH, thống kê, dự đoán — đọc/ghi DB thực.
// ================================================================

import { OrchestratorRequest } from '../orchestrator/orchestrator.types';
import { dbService, Match } from '../../data-platform/supabase/db.service';

interface MatchInput {
  homeTeam?: string;
  awayTeam?: string;
  homeGoals?: number;
  awayGoals?: number;
  matchday?: number;
  date?: string;
  matchId?: string;
  results?: Match[];
}

export class AnalyticsEngine {
  async handle(request: OrchestratorRequest): Promise<unknown> {
    const payload = request.payload as { action: string } & MatchInput & { data?: MatchInput };
    const action = payload.action;
    const data: MatchInput = payload.data ?? payload;

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
   * Lấy bảng xếp hạng từ DB (view standings tự tính từ kết quả thực).
   * Fallback: tính toán từ danh sách results được truyền vào.
   */
  private async updateStandings(data: MatchInput) {
    // Nếu có matchId → lưu kết quả vào DB trước
    if (data.matchId && data.homeGoals !== undefined && data.awayGoals !== undefined) {
      await dbService.saveMatchResult(data.matchId, data.homeGoals, data.awayGoals);
      console.log('[AnalyticsEngine] Match result saved to DB:', data.matchId);
    }

    // Lấy BXH từ DB (Supabase View tự tính)
    const standings = await dbService.getStandings();

    if (standings.length > 0) return standings;

    // Fallback: tính từ results được truyền vào (offline)
    return this.computeStandingsFromResults(data.results ?? []);
  }

  private async computeStats(data: MatchInput) {
    const finishedMatches = await dbService.getMatches('finished');
    const totalGoals = finishedMatches.reduce(
      (sum, m) => sum + (m.home_goals ?? 0) + (m.away_goals ?? 0), 0
    );
    const topScorers = await dbService.getTopScorers(5);

    return {
      totalMatches: finishedMatches.length,
      totalGoals,
      avgGoalsPerMatch: finishedMatches.length
        ? (totalGoals / finishedMatches.length).toFixed(2)
        : '0',
      topScorers: topScorers.map(p => ({ name: p.name, goals: p.goals })),
      // Kết quả trận cụ thể nếu có
      currentMatch: data.matchId
        ? {
            scoreline: `${data.homeTeam ?? '?'} ${data.homeGoals} - ${data.awayGoals} ${data.awayTeam ?? '?'}`,
            winner: (data.homeGoals ?? 0) > (data.awayGoals ?? 0)
              ? data.homeTeam
              : (data.awayGoals ?? 0) > (data.homeGoals ?? 0)
                ? data.awayTeam
                : 'Hòa',
          }
        : undefined,
      computedAt: new Date().toISOString(),
    };
  }

  private async predict(data: MatchInput) {
    // Lấy thống kê 2 đội từ DB để cải thiện dự đoán
    const standings = await dbService.getStandings();
    const homeRank = standings.find(s => s.team === data.homeTeam)?.rank ?? 4;
    const awayRank = standings.find(s => s.team === data.awayTeam)?.rank ?? 4;

    const homeAdvantage = 0.08;
    const rankFactor = (awayRank - homeRank) * 0.03;
    const homeWinProb = Math.max(0.15, Math.min(0.85, 0.4 + homeAdvantage + rankFactor));
    const drawProb = 0.25;
    const awayWinProb = Math.max(0.05, 1 - homeWinProb - drawProb);

    return {
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      homeWinProbability:  Math.round(homeWinProb  * 100),
      drawProbability:     Math.round(drawProb      * 100),
      awayWinProbability:  Math.round(awayWinProb   * 100),
      basedOn: `BXH: ${data.homeTeam} hạng ${homeRank} vs ${data.awayTeam} hạng ${awayRank}`,
      predictedAt: new Date().toISOString(),
    };
  }

  private async summarize(data: MatchInput) {
    const finished = await dbService.getMatches('finished');
    const scheduled = await dbService.getMatches('scheduled');
    const standings = await dbService.getStandings();

    return {
      matchesFinished: finished.length,
      matchesScheduled: scheduled.length,
      leader: standings[0] ?? null,
      topTeams: standings.slice(0, 3).map(s => `${s.team}(${s.points}đ)`),
      summarizedAt: new Date().toISOString(),
    };
  }

  /** Tính BXH offline từ mảng kết quả */
  private computeStandingsFromResults(results: Match[]) {
    const map = new Map<string, { team: string; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }>();
    const ensure = (id: string, name: string) => {
      if (!map.has(id)) map.set(id, { team: name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 });
      return map.get(id)!;
    };
    for (const m of results) {
      if (m.home_goals == null || m.away_goals == null) continue;
      const h = ensure(m.home_team_id, m.home_team ?? m.home_team_id);
      const a = ensure(m.away_team_id, m.away_team ?? m.away_team_id);
      h.played++; a.played++;
      h.gf += m.home_goals; h.ga += m.away_goals;
      a.gf += m.away_goals; a.ga += m.home_goals;
      if (m.home_goals > m.away_goals) { h.won++; h.pts += 3; a.lost++; }
      else if (m.home_goals === m.away_goals) { h.drawn++; h.pts++; a.drawn++; a.pts++; }
      else { a.won++; a.pts += 3; h.lost++; }
    }
    return Array.from(map.values())
      .sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))
      .map((e, i) => ({ rank: i + 1, team: e.team, played: e.played, won: e.won, drawn: e.drawn, lost: e.lost, goals_for: e.gf, goals_against: e.ga, goal_diff: e.gf - e.ga, points: e.pts }));
  }
}
