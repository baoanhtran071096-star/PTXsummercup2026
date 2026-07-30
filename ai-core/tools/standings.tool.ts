// PTX TOOL: Standings – Bảng xếp hạng
import { tournamentService } from '../../backend/capabilities/tournament.service';

export const standingsTool = {
  name: 'standings',
  description: 'Lấy bảng xếp hạng hiện tại',
  async execute(params: { format?: 'full' | 'text' | 'top3' }) {
    const { format = 'full' } = params;
    switch (format) {
      case 'text': return { table: await tournamentService.standings.getFormattedTable() };
      case 'top3': return { top3: await tournamentService.standings.getTop3() };
      default: return { standings: await tournamentService.standings.getStandings() };
    }
  },
};
