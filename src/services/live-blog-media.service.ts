/**
 * Live Blog, Podcast Media & Quick Polls Engine (UX Region 5)
 * Handles text commentary feeds, PTX Podcast audio streams, and quick user polls.
 */

export interface LiveBlogEntry {
  id: string;
  matchId: string;
  minute: number;
  type: 'GOAL' | 'CARD' | 'COMMENTARY' | 'PHOTO';
  content: string;
  mediaUrl?: string;
  timestamp: string;
}

export interface QuickPoll {
  pollId: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
}

export class LiveBlogMediaService {
  private blogEntries: Map<string, LiveBlogEntry[]> = new Map();

  public addLiveBlogEntry(entry: Omit<LiveBlogEntry, 'id' | 'timestamp'>): LiveBlogEntry {
    const list = this.blogEntries.get(entry.matchId) || [];
    const newEntry: LiveBlogEntry = {
      ...entry,
      id: `blog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    list.unshift(newEntry); // Newest first
    this.blogEntries.set(entry.matchId, list);
    return newEntry;
  }

  public getLiveBlogFeed(matchId: string): LiveBlogEntry[] {
    return this.blogEntries.get(matchId) || [];
  }

  public getQuickPoll(pollId: string): QuickPoll {
    return {
      pollId,
      question: 'Cầu thủ nào sẽ đạt danh hiệu Vua phá lưới PTX Summer Cup 2026?',
      options: [
        { id: 'opt1', text: 'Cầu thủ A (Phoenix FC)', votes: 145 },
        { id: 'opt2', text: 'Cầu thủ B (Tiger FC)', votes: 98 },
        { id: 'opt3', text: 'Cầu thủ C (Xiphias FC)', votes: 112 }
      ],
      totalVotes: 355
    };
  }

  public getPTXPodcastFeed(): { episodeId: string; title: string; audioUrl: string; duration: string }[] {
    return [
      { episodeId: 'ep1', title: 'Tập 1: Tiền giải đấu PTX Summer Cup 2026', audioUrl: 'https://cdn.ptxsummercup.vn/podcast/ep1.mp3', duration: '15:30' },
      { episodeId: 'ep2', title: 'Tập 2: Phỏng vấn Đội trưởng Phoenix FC', audioUrl: 'https://cdn.ptxsummercup.vn/podcast/ep2.mp3', duration: '18:45' }
    ];
  }
}

export const liveBlogMediaService = new LiveBlogMediaService();
