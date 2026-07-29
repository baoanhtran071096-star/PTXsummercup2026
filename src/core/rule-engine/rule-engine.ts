export interface PointsRuleConfig {
  win: number;
  draw: number;
  loss: number;
}

export interface StandingsEntry {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export class RuleEngineService {
  private pointsConfig: PointsRuleConfig = { win: 3, draw: 1, loss: 0 };

  setPointsRule(config: PointsRuleConfig) {
    this.pointsConfig = config;
  }

  getPointsRule(): PointsRuleConfig {
    return this.pointsConfig;
  }

  calculatePoints(won: number, drawn: number, lost: number): number {
    return won * this.pointsConfig.win + drawn * this.pointsConfig.draw + lost * this.pointsConfig.loss;
  }

  sortStandings(entries: StandingsEntry[]): StandingsEntry[] {
    return [...entries].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.teamName.localeCompare(b.teamName);
    });
  }
}
