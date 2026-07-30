// PTX TOOL: Players – Thông tin cầu thủ
import { tournamentService } from '../../backend/capabilities/tournament.service';

export const playersTool = {
  name: 'players',
  description: 'Lấy danh sách cầu thủ và thống kê',
  async execute(params: { query?: 'top_scorers' | 'all'; teamId?: string; limit?: number }) {
    const { query = 'top_scorers', teamId, limit = 10 } = params;
    switch (query) {
      case 'top_scorers': return { scorers: await tournamentService.players.getTopScorers(limit) };
      default: {
        const players = teamId
          ? await tournamentService.players.getPlayersByTeam(teamId)
          : await tournamentService.players.getAllPlayers();
        return { players };
      }
    }
  },
};
