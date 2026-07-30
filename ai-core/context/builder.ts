// ================================================================
// PTX CONTEXT BUILDER
// Xây dựng context cho AI từ dữ liệu giải đấu thực tế.
// Giúp Gemini hiểu rõ "PTX Summer Cup" là gì.
// ================================================================

export interface TournamentContext {
  name: string;
  year: number;
  season: string;
  totalTeams: number;
  totalPlayers: number;
  totalMatches: number;
  currentMatchday?: number;
  topScorer?: { name: string; goals: number; team: string };
  standings?: Array<{ rank: number; team: string; points: number; played: number }>;
}

export interface ConversationContext {
  userId?: string;
  sessionId: string;
  history: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>;
  tournament: TournamentContext;
  currentPage?: string;
}

export class ContextBuilder {
  private static readonly SYSTEM_PROMPT_BASE = `Bạn là PTX AI Assistant — trợ lý thông minh cho giải đấu bóng đá nội bộ PTX Summer Cup 2026.

Nhiệm vụ của bạn:
- Trả lời câu hỏi về lịch thi đấu, kết quả, bảng xếp hạng, đội bóng, cầu thủ
- Hỗ trợ Ban Tổ chức (BTC) nhập và quản lý thông tin giải đấu
- Sinh nội dung tự động: tin tức, mô tả ảnh, hồ sơ cầu thủ, SEO
- Phân tích và dự đoán kết quả dựa trên dữ liệu thực tế

Nguyên tắc:
- Luôn trả lời bằng tiếng Việt trừ khi được yêu cầu khác
- Chỉ cung cấp thông tin chính xác từ dữ liệu giải đấu
- Thân thiện, chuyên nghiệp, súc tích
- Không bịa đặt số liệu nếu không có dữ liệu`;

  /**
   * Xây dựng system prompt đầy đủ với dữ liệu giải đấu thực tế.
   */
  buildSystemPrompt(tournament: TournamentContext): string {
    const standings = tournament.standings
      ?.slice(0, 5)
      .map(s => `  ${s.rank}. ${s.team}: ${s.points} điểm (${s.played} trận)`)
      .join('\n') ?? 'Chưa có dữ liệu';

    return `${ContextBuilder.SYSTEM_PROMPT_BASE}

=== DỮ LIỆU GIẢI ĐẤU HIỆN TẠI ===
Tên giải: ${tournament.name} ${tournament.year}
Mùa: ${tournament.season}
Số đội: ${tournament.totalTeams} đội | Số cầu thủ: ${tournament.totalPlayers} người
Tổng trận: ${tournament.totalMatches} trận${tournament.currentMatchday ? ` | Vòng hiện tại: ${tournament.currentMatchday}` : ''}
${tournament.topScorer ? `Vua phá lưới: ${tournament.topScorer.name} (${tournament.topScorer.goals} bàn - ${tournament.topScorer.team})` : ''}

TOP 5 BẢNG XẾP HẠNG:
${standings}
===================================`;
  }

  /**
   * Chuyển đổi lịch sử hội thoại sang định dạng Gemini messages.
   */
  buildMessages(context: ConversationContext, userMessage: string) {
    const systemPrompt = this.buildSystemPrompt(context.tournament);

    const messages = [
      // System prompt như tin nhắn đầu tiên của model
      {
        role: 'user' as const,
        parts: [{ text: `[SYSTEM INSTRUCTIONS]\n${systemPrompt}` }],
      },
      {
        role: 'model' as const,
        parts: [{ text: 'Đã hiểu. Tôi sẵn sàng hỗ trợ PTX Summer Cup 2026.' }],
      },
      // Lịch sử hội thoại
      ...context.history.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }],
      })),
      // Câu hỏi mới
      {
        role: 'user' as const,
        parts: [{ text: userMessage }],
      },
    ];

    return messages;
  }

  /**
   * Tạo prompt cho sinh nội dung (tin tức, mô tả, SEO).
   */
  buildContentPrompt(type: 'news' | 'description' | 'seo' | 'profile', data: Record<string, unknown>): string {
    const prompts: Record<string, string> = {
      news: `Viết một bài tin tức ngắn (150-200 từ) về trận đấu sau bằng tiếng Việt:
${JSON.stringify(data, null, 2)}
Yêu cầu: tiêu đề hấp dẫn, nội dung trung lập và chuyên nghiệp, kết thúc với thông tin giải đấu.`,

      description: `Viết mô tả ngắn gọn (50-80 từ) cho ảnh sau bằng tiếng Việt:
${JSON.stringify(data, null, 2)}
Yêu cầu: mô tả sinh động, phù hợp làm caption mạng xã hội.`,

      seo: `Tạo meta SEO cho bài viết sau (bằng tiếng Việt):
${JSON.stringify(data, null, 2)}
Trả về JSON với format:
{ "metaTitle": "...", "metaDescription": "...", "keywords": [...] }`,

      profile: `Viết hồ sơ ngắn cho cầu thủ sau (100-150 từ) bằng tiếng Việt:
${JSON.stringify(data, null, 2)}
Yêu cầu: phong cách chuyên nghiệp, nêu bật điểm mạnh và vai trò trong đội.`,
    };

    return prompts[type] ?? `Xử lý yêu cầu sau: ${JSON.stringify(data)}`;
  }

  /**
   * Default tournament context (dùng khi chưa có dữ liệu thực từ DB).
   */
  static getDefaultContext(): TournamentContext {
    return {
      name: 'PTX Summer Cup',
      year: 2026,
      season: 'Mùa hè 2026',
      totalTeams: 8,
      totalPlayers: 120,
      totalMatches: 28,
      currentMatchday: 1,
    };
  }
}

export const contextBuilder = new ContextBuilder();
