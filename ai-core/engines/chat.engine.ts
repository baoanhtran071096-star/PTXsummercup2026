// ================================================================
// PTX CHAT ENGINE
// Fan chatbot hỏi đáp về giải đấu PTX Summer Cup 2026.
// Dùng Gemini + ContextBuilder + MemoryService.
// ================================================================

import { geminiProvider } from '../providers/gemini.provider';
import { contextBuilder, ContextBuilder, TournamentContext } from '../context/builder';
import { memoryService } from '../memory/memory.service';
import { OrchestratorRequest } from '../orchestrator/orchestrator.types';

export interface ChatPayload {
  message: string;
  sessionId: string;
  userId?: string;
  tournament?: TournamentContext;
}

export interface ChatResult {
  reply: string;
  sessionId: string;
  tokensUsed?: number;
}

export class ChatEngine {
  async handle(request: OrchestratorRequest): Promise<ChatResult> {
    const { message, sessionId, userId, tournament } = request.payload as ChatPayload;

    if (!message?.trim()) {
      return { reply: 'Bạn muốn hỏi gì về PTX Summer Cup?', sessionId };
    }

    // Lấy memory của session
    const session = memoryService.getOrCreate(sessionId, userId);
    const history = memoryService.getHistory(sessionId, 10);

    // Xây dựng context
    const tournamentCtx = tournament ?? ContextBuilder.getDefaultContext();
    const messages = contextBuilder.buildMessages(
      { sessionId, userId, history, tournament: tournamentCtx },
      message,
    );

    // Gọi Gemini
    const response = await geminiProvider.chat(messages, {
      temperature: 0.7,
      maxOutputTokens: 1024,
    });

    // Lưu vào memory
    memoryService.addMessage(sessionId, 'user', message);
    memoryService.addMessage(sessionId, 'assistant', response.text);

    return {
      reply: response.text,
      sessionId,
      tokensUsed: response.usageMetadata?.totalTokenCount,
    };
  }
}
