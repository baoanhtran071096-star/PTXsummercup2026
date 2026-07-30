/**
 * Match Deep Dive & Live Player Analytics Engine (UX Region 3)
 * Provides detailed player info cards, live in-match statistics, match momentum timeline graphs, and H2H historical records.
 */

export interface PlayerDetailCard {
  playerId: string;
  fullName: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  teamName: string;
  goalsScored: number;
  mvpAwardsCount: number;
  passesCompleted: number;
  tacklesWon: number;
  photoUrl: string;
}

export interface MatchMomentumPoint {
  minute: number;
  homeDominanceScore: number; // 0 to 100
  awayDominanceScore: number;
  keyEventDescription?: string;
}

export interface HeadToHeadRecord {
  totalMatchesPlayed: number;
  homeTeamWins: number;
  awayTeamWins: number;
  draws: number;
  lastMatchScore: string;
}

export class MatchDeepDiveService {
  public getPlayerDetailCard(playerId: string): PlayerDetailCard {
    return {
      playerId,
      fullName: 'Nguyen Van B',
      number: 10,
      position: 'FWD',
      teamName: 'Phoenix FC',
      goalsScored: 8,
      mvpAwardsCount: 3,
      passesCompleted: 142,
      tacklesWon: 18,
      photoUrl: 'https://cdn.ptxsummercup.vn/players/p10.png'
    };
  }

  public getMatchMomentumGraph(matchId: string): MatchMomentumPoint[] {
    return [
      { minute: 5, homeDominanceScore: 60, awayDominanceScore: 40 },
      { minute: 15, homeDominanceScore: 75, awayDominanceScore: 25, keyEventDescription: 'Goal - Phoenix FC' },
      { minute: 30, homeDominanceScore: 50, awayDominanceScore: 50 },
      { minute: 40, homeDominanceScore: 35, awayDominanceScore: 65, keyEventDescription: 'Equalizer - Tiger FC' }
    ];
  }

  public getHeadToHeadRecord(homeTeam: string, awayTeam: string): HeadToHeadRecord {
    return {
      totalMatchesPlayed: 5,
      homeTeamWins: 3,
      awayTeamWins: 1,
      draws: 1,
      lastMatchScore: `${homeTeam} 2 - 1 ${awayTeam}`
    };
  }
}

export const matchDeepDiveService = new MatchDeepDiveService();
