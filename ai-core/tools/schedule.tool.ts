// PTX TOOL: Schedule – Lịch thi đấu
import { tournamentService } from '../../backend/capabilities/tournament.service';

export const scheduleTool = {
  name: 'schedule',
  description: 'Lấy lịch thi đấu sắp diễn ra và kết quả gần đây',
  async execute(params: { type?: 'upcoming' | 'recent' | 'all'; limit?: number }) {
    const { type = 'upcoming', limit = 5 } = params;
    switch (type) {
      case 'upcoming': {
        const matches = await tournamentService.matches.getUpcomingMatches(limit);
        return matches.map(m => ({
          matchday: m.matchday,
          home: m.home_team ?? '?',
          away: m.away_team ?? '?',
          date: m.date,
          time: m.time ?? '',
          venue: m.venue,
        }));
      }
      case 'recent': {
        const matches = await tournamentService.matches.getRecentResults(limit);
        return matches.map(m => ({
          matchday: m.matchday,
          home: m.home_team ?? '?',
          away: m.away_team ?? '?',
          score: tournamentService.matches.formatScore(m),
          winner: tournamentService.matches.getMatchWinner(m),
        }));
      }
      default: {
        const matches = await tournamentService.matches.getAllMatches();
        return matches;
      }
    }
  },
};
