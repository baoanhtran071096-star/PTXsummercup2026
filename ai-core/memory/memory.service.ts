// ================================================================
// PTX MEMORY SERVICE
// Lưu lịch sử hội thoại trong sessionStorage (browser)
// hoặc in-memory Map (server) — Free, không cần Redis.
// ================================================================

interface MemoryEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SessionMemory {
  sessionId: string;
  userId?: string;
  history: MemoryEntry[];
  createdAt: string;
  lastActivity: string;
  metadata: Record<string, unknown>;
}

export class MemoryService {
  private sessions = new Map<string, SessionMemory>();
  private readonly MAX_HISTORY_PER_SESSION = 50;
  private readonly SESSION_TTL_MS = 30 * 60 * 1000; // 30 phút

  /**
   * Lấy hoặc tạo mới session memory.
   */
  getOrCreate(sessionId: string, userId?: string): SessionMemory {
    this.cleanup();

    if (!this.sessions.has(sessionId)) {
      const session: SessionMemory = {
        sessionId,
        userId,
        history: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        metadata: {},
      };
      this.sessions.set(sessionId, session);
      console.log(`[MemoryService] New session: ${sessionId}`);
    }

    const session = this.sessions.get(sessionId)!;
    session.lastActivity = new Date().toISOString();
    return session;
  }

  /**
   * Thêm tin nhắn vào lịch sử hội thoại.
   */
  addMessage(sessionId: string, role: 'user' | 'assistant', content: string): void {
    const session = this.getOrCreate(sessionId);
    session.history.push({ role, content, timestamp: new Date().toISOString() });

    // Giữ tối đa MAX_HISTORY_PER_SESSION tin nhắn
    if (session.history.length > this.MAX_HISTORY_PER_SESSION) {
      session.history = session.history.slice(-this.MAX_HISTORY_PER_SESSION);
    }
  }

  /**
   * Lấy lịch sử hội thoại của session.
   */
  getHistory(sessionId: string, limit = 10): MemoryEntry[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];
    return session.history.slice(-limit);
  }

  /**
   * Lưu metadata tùy chỉnh vào session (ví dụ: đội yêu thích, ngôn ngữ).
   */
  setMeta(sessionId: string, key: string, value: unknown): void {
    const session = this.getOrCreate(sessionId);
    session.metadata[key] = value;
  }

  getMeta(sessionId: string, key: string): unknown {
    return this.sessions.get(sessionId)?.metadata[key];
  }

  /**
   * Xóa session (đăng xuất hoặc hết hạn).
   */
  clear(sessionId: string): void {
    this.sessions.delete(sessionId);
    console.log(`[MemoryService] Session cleared: ${sessionId}`);
  }

  /**
   * Dọn dẹp các session quá hạn.
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      const lastActivity = new Date(session.lastActivity).getTime();
      if (now - lastActivity > this.SESSION_TTL_MS) {
        this.sessions.delete(id);
        console.log(`[MemoryService] Session expired & removed: ${id}`);
      }
    }
  }

  getStats() {
    return {
      activeSessions: this.sessions.size,
      sessionIds: Array.from(this.sessions.keys()),
    };
  }
}

export const memoryService = new MemoryService();
