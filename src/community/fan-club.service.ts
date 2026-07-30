/**
 * Exclusive Fan Club Hub Service (Task 7.5.1)
 * Manages dedicated Fan Clubs for Phoenix, Tiger, and Xiphias teams (Private Leaderboards & Chat Engine).
 */

export type TeamClub = 'PHOENIX' | 'TIGER' | 'XIPHIAS';

export interface FanMember {
  userEmail: string;
  club: TeamClub;
  points: number;
  joinedAt: string;
}

export class FanClubService {
  private members: FanMember[] = [];

  public joinFanClub(userEmail: string, club: TeamClub): FanMember {
    const existing = this.members.find(m => m.userEmail === userEmail);
    if (existing) {
      existing.club = club;
      return existing;
    }

    const member: FanMember = {
      userEmail,
      club,
      points: 100,
      joinedAt: new Date().toISOString()
    };
    this.members.push(member);
    return member;
  }

  public getClubLeaderboard(club: TeamClub): FanMember[] {
    return this.members
      .filter(m => m.club === club)
      .sort((a, b) => b.points - a.points);
  }
}

export const fanClubService = new FanClubService();
