// PTX TOURNAMENT SERVICE – Business Capability Layer (Facade)
// Điểm truy cập chính cho AI Core và Application Layer.
import { teamService, TeamService } from './team.service';
import { playerService, PlayerService } from './player.service';
import { matchService, MatchService } from './match.service';
import { standingService, StandingService } from './standing.service';
import { newsService, NewsService } from './news.service';
import { galleryService, GalleryService } from './gallery.service';
import { hofService, HofService } from './hof.service';

export interface TournamentSnapshot {
  name: string;
  season: string;
  teamCount: number;
  playerCount: number;
  matchSummary: { total: number; finished: number; scheduled: number; live: number };
  leader: string | null;
  topScorer: string | null;
  newsCount: number;
  photoCount: number;
  generatedAt: string;
}

export class TournamentService {
  readonly teams: TeamService;
  readonly players: PlayerService;
  readonly matches: MatchService;
  readonly standings: StandingService;
  readonly news: NewsService;
  readonly gallery: GalleryService;
  readonly hof: HofService;

  constructor() {
    this.teams = teamService;
    this.players = playerService;
    this.matches = matchService;
    this.standings = standingService;
    this.news = newsService;
    this.gallery = galleryService;
    this.hof = hofService;
  }

  async getSnapshot(): Promise<TournamentSnapshot> {
    const [teamCount, playerCount, matchSummary, leader, topScorers, newsCount, photoCount] = await Promise.all([
      this.teams.getTeamCount(),
      this.players.getPlayerCount(),
      this.matches.getMatchSummary(),
      this.standings.getLeader(),
      this.players.getTopScorerSummary(),
      this.news.getNewsCount(),
      this.gallery.getPhotoCount(),
    ]);
    return {
      name: 'PTX Summer Cup',
      season: '2026',
      teamCount,
      playerCount,
      matchSummary,
      leader: leader?.team ?? null,
      topScorer: topScorers[0]?.name ?? null,
      newsCount,
      photoCount,
      generatedAt: new Date().toISOString(),
    };
  }

  async getContextForAI(): Promise<string> {
    const [snapshot, standings, upcoming, recent, topScorers] = await Promise.all([
      this.getSnapshot(),
      this.standings.getFormattedTable(),
      this.matches.getUpcomingMatches(3),
      this.matches.getRecentResults(3),
      this.players.getTopScorerSummary(),
    ]);

    const upcomingText = upcoming.map(m =>
      `- Vòng ${m.matchday}: ${m.home_team ?? '?'} vs ${m.away_team ?? '?'} (${m.date} ${m.time ?? ''})`
    ).join('\n') || 'Chưa có lịch thi đấu tiếp theo';

    const recentText = recent.map(m =>
      `- ${m.home_team ?? '?'} ${m.home_goals}-${m.away_goals} ${m.away_team ?? '?'} (Vòng ${m.matchday})`
    ).join('\n') || 'Chưa có kết quả';

    const scorerText = topScorers.map((p, i) =>
      `${i + 1}. ${p.name}: ${p.goals} bàn`
    ).join(', ') || 'Chưa có dữ liệu';

    return `
[CONTEXT: PTX Summer Cup 2026]
Tổng đội: ${snapshot.teamCount} | Cầu thủ: ${snapshot.playerCount} | Trận đã đấu: ${snapshot.matchSummary.finished}/${snapshot.matchSummary.total}
Đứng đầu BXH: ${snapshot.leader ?? 'Chưa xác định'}
Vua phá lưới: ${scorerText}

[BẢNG XẾP HẠNG]
${standings}

[KẾT QUẢ GẦN ĐÂY]
${recentText}

[LỊCH THI ĐẤU TIẾP THEO]
${upcomingText}
`.trim();
  }
}

export const tournamentService = new TournamentService();
