// PTX TOOL: News – Tin tức
import { tournamentService } from '../../backend/capabilities/tournament.service';

export const newsTool = {
  name: 'news',
  description: 'Lấy tin tức mới nhất của giải đấu',
  async execute(params: { limit?: number; matchId?: string }) {
    const { limit = 5, matchId } = params;
    if (matchId) {
      return { news: await tournamentService.news.getNewsForMatch(matchId) };
    }
    return { news: await tournamentService.news.getLatestNews(limit) };
  },
};
