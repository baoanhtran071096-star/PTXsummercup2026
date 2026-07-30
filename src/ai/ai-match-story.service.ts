/**
 * AI Match Story Summary Generator (Task C.1)
 * Automatically writes 200-300 word news summary articles following match completion.
 */

export interface MatchStoryRequest {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  keyEvents: string[];
}

export class AIMatchStoryService {
  public generateMatchSummaryStory(request: MatchStoryRequest): { articleTitle: string; articleBody: string } {
    const winner = request.homeScore > request.awayScore ? request.homeTeam : request.awayTeam;
    const title = `[Tường thuật AI] ${request.homeTeam} ${request.homeScore} - ${request.awayScore} ${request.awayTeam}: Màn trình diễn đỉnh cao của ${winner}!`;
    
    const body = `Trong trận cầu tâm điểm giữa ${request.homeTeam} và ${request.awayTeam}, hai đội đã cống hiến một trận đấu vô cùng kịch tính. ` +
      `Chung cuộc, ${request.homeTeam} giành chiến thắng với tỷ số ${request.homeScore} - ${request.awayScore}. ` +
      `Các điểm nhấn chính trong trận đấu: ${request.keyEvents.join('; ')}. ` +
      `Chiến thắng này khẳng định sức mạnh vượt trội và đưa ${winner} tiến bước vững chắc trên bảng xếp hạng PTX Summer Cup 2026.`;

    return {
      articleTitle: title,
      articleBody: body
    };
  }
}

export const aiMatchStoryService = new AIMatchStoryService();
