/**
 * Advanced Social Interaction Engine (UX Region 2)
 * Handles @username mentions, reply/quote threading, emoji reactions, chat media uploads, and active engagement rankings.
 */

export interface ChatMessage {
  id: string;
  senderEmail: string;
  senderName: string;
  text: string;
  replyToMessageId?: string;
  taggedUsernames?: string[];
  reactions?: Record<string, number>; // e.g. { '👍': 5, '❤️': 2 }
  imageUrl?: string;
  timestamp: string;
}

export class SocialChatService {
  private messages: ChatMessage[] = [];
  private userMessageCounts: Map<string, number> = new Map();

  public sendMessage(msg: Omit<ChatMessage, 'id' | 'timestamp' | 'reactions'>): ChatMessage {
    const taggedUsernames = this.extractTaggedUsernames(msg.text);
    const message: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      taggedUsernames,
      reactions: {},
      timestamp: new Date().toISOString()
    };

    this.messages.push(message);
    const currentCount = this.userMessageCounts.get(msg.senderEmail) || 0;
    this.userMessageCounts.set(msg.senderEmail, currentCount + 1);

    return message;
  }

  public reactToMessage(messageId: string, emoji: string): ChatMessage | undefined {
    const msg = this.messages.find(m => m.id === messageId);
    if (!msg) return undefined;

    msg.reactions = msg.reactions || {};
    msg.reactions[emoji] = (msg.reactions[emoji] || 0) + 1;
    return msg;
  }

  private extractTaggedUsernames(text: string): string[] {
    const matches = text.match(/@([a-zA-Z0-9_]+)/g);
    if (!matches) return [];
    return matches.map(m => m.substring(1));
  }

  public getActiveUserLeaderboard(): { email: string; messageCount: number }[] {
    return Array.from(this.userMessageCounts.entries())
      .map(([email, count]) => ({ email, messageCount: count }))
      .sort((a, b) => b.messageCount - a.messageCount);
  }
}

export const socialChatService = new SocialChatService();
