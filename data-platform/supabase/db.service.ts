// ================================================================
// PTX DATABASE SERVICE
// Lớp trung gian giữa Supabase Client và các AI Engine.
// Cung cấp CRUD chuẩn + mock data khi chưa kết nối DB thực.
// ================================================================

import { db } from './client';

// ─── TYPES ──────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  short_name?: string;
  logo_url?: string;
  color?: string;
}

export interface Player {
  id: string;
  name: string;
  team_id: string;
  position?: string;
  jersey_num?: number;
  avatar_url?: string;
  profile?: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
}

export interface Match {
  id: string;
  matchday: number;
  home_team_id: string;
  away_team_id: string;
  home_team?: string;
  away_team?: string;
  home_goals?: number;
  away_goals?: number;
  date: string;
  time?: string;
  venue?: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
}

export interface Standing {
  rank: number;
  team_id: string;
  team: string;
  logo_url?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
}

export interface NewsArticle {
  id?: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  cover_image_url?: string;
  match_id?: string;
  published_at?: string;
}

export interface GalleryItem {
  id?: string;
  image_url: string;
  description?: string;
  tags?: string[];
  match_id?: string;
  team_id?: string;
  uploaded_by?: string;
}

// ─── MOCK DATA (dùng khi Supabase chưa được cấu hình) ───────────

const MOCK_TEAMS: Team[] = [
  { id: '1', name: 'Đội Alpha',   short_name: 'ALP', color: '#E63946' },
  { id: '2', name: 'Đội Beta',    short_name: 'BET', color: '#2A9D8F' },
  { id: '3', name: 'Đội Gamma',   short_name: 'GAM', color: '#F4A261' },
  { id: '4', name: 'Đội Delta',   short_name: 'DEL', color: '#457B9D' },
  { id: '5', name: 'Đội Epsilon', short_name: 'EPS', color: '#6A4C93' },
  { id: '6', name: 'Đội Zeta',    short_name: 'ZET', color: '#1D3557' },
  { id: '7', name: 'Đội Eta',     short_name: 'ETA', color: '#E9C46A' },
  { id: '8', name: 'Đội Theta',   short_name: 'THE', color: '#264653' },
];

const MOCK_MATCHES: Match[] = [
  { id: 'm1', matchday: 1, home_team_id: '1', away_team_id: '2', home_team: 'Đội Alpha', away_team: 'Đội Beta',    home_goals: 3, away_goals: 1, date: '2026-08-05', time: '18:00', status: 'finished' },
  { id: 'm2', matchday: 1, home_team_id: '3', away_team_id: '4', home_team: 'Đội Gamma', away_team: 'Đội Delta',   home_goals: 2, away_goals: 2, date: '2026-08-05', time: '20:00', status: 'finished' },
  { id: 'm3', matchday: 1, home_team_id: '5', away_team_id: '6', home_team: 'Đội Epsilon', away_team: 'Đội Zeta',  home_goals: 1, away_goals: 0, date: '2026-08-06', time: '18:00', status: 'finished' },
  { id: 'm4', matchday: 1, home_team_id: '7', away_team_id: '8', home_team: 'Đội Eta',   away_team: 'Đội Theta',  home_goals: 0, away_goals: 0, date: '2026-08-06', time: '20:00', status: 'finished' },
  { id: 'm5', matchday: 2, home_team_id: '1', away_team_id: '3', home_team: 'Đội Alpha', away_team: 'Đội Gamma',  date: '2026-08-09', time: '18:00', status: 'scheduled' },
  { id: 'm6', matchday: 2, home_team_id: '2', away_team_id: '4', home_team: 'Đội Beta',  away_team: 'Đội Delta',  date: '2026-08-09', time: '20:00', status: 'scheduled' },
];

const MOCK_STANDINGS: Standing[] = [
  { rank: 1, team_id: '1', team: 'Đội Alpha',   played: 1, won: 1, drawn: 0, lost: 0, goals_for: 3, goals_against: 1, goal_diff: 2,  points: 3 },
  { rank: 2, team_id: '3', team: 'Đội Gamma',   played: 1, won: 0, drawn: 1, lost: 0, goals_for: 2, goals_against: 2, goal_diff: 0,  points: 1 },
  { rank: 3, team_id: '4', team: 'Đội Delta',   played: 1, won: 0, drawn: 1, lost: 0, goals_for: 2, goals_against: 2, goal_diff: 0,  points: 1 },
  { rank: 4, team_id: '5', team: 'Đội Epsilon', played: 1, won: 1, drawn: 0, lost: 0, goals_for: 1, goals_against: 0, goal_diff: 1,  points: 3 },
  { rank: 5, team_id: '7', team: 'Đội Eta',     played: 1, won: 0, drawn: 1, lost: 0, goals_for: 0, goals_against: 0, goal_diff: 0,  points: 1 },
  { rank: 6, team_id: '8', team: 'Đội Theta',   played: 1, won: 0, drawn: 1, lost: 0, goals_for: 0, goals_against: 0, goal_diff: 0,  points: 1 },
  { rank: 7, team_id: '2', team: 'Đội Beta',    played: 1, won: 0, drawn: 0, lost: 1, goals_for: 1, goals_against: 3, goal_diff: -2, points: 0 },
  { rank: 8, team_id: '6', team: 'Đội Zeta',    played: 1, won: 0, drawn: 0, lost: 1, goals_for: 0, goals_against: 1, goal_diff: -1, points: 0 },
];

// ─── DATABASE SERVICE ────────────────────────────────────────────

export class DatabaseService {

  // ── TEAMS ────────────────────────────────────────────────────

  async getTeams(): Promise<Team[]> {
    if (!db.isConfigured) return MOCK_TEAMS;
    const { data, error } = await db.select<Team>('teams', { order: { column: 'name' } });
    if (error) { console.error('[DB] getTeams error:', error.message); return MOCK_TEAMS; }
    return data ?? MOCK_TEAMS;
  }

  async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
    const { data, error } = await db.insert<Team>('teams', team as Record<string, unknown>);
    if (error) throw new Error(`[DB] createTeam: ${error.message}`);
    await this.audit('INSERT', 'teams', undefined, team);
    return (Array.isArray(data) ? data[0] : data) as Team;
  }

  // ── PLAYERS ──────────────────────────────────────────────────

  async getPlayers(teamId?: string): Promise<Player[]> {
    if (!db.isConfigured) return [];
    const opts = teamId
      ? { eq: { team_id: teamId }, order: { column: 'goals', ascending: false } }
      : { order: { column: 'goals', ascending: false } };
    const { data, error } = await db.select<Player>('players', opts);
    if (error) { console.error('[DB] getPlayers error:', error.message); return []; }
    return data ?? [];
  }

  async createPlayer(player: Omit<Player, 'id'>): Promise<Player> {
    const { data, error } = await db.insert<Player>('players', player as Record<string, unknown>);
    if (error) throw new Error(`[DB] createPlayer: ${error.message}`);
    await this.audit('INSERT', 'players', undefined, player);
    return (Array.isArray(data) ? data[0] : data) as Player;
  }

  async updatePlayerStats(playerId: string, stats: Partial<Pick<Player, 'goals' | 'assists' | 'yellow_cards' | 'red_cards' | 'profile'>>): Promise<void> {
    const { error } = await db.update('players', stats as Record<string, unknown>, { id: playerId });
    if (error) throw new Error(`[DB] updatePlayerStats: ${error.message}`);
    await this.audit('UPDATE', 'players', playerId, stats);
  }

  async getTopScorers(limit = 10): Promise<Player[]> {
    if (!db.isConfigured) return [];
    const { data, error } = await db.select<Player>('players', {
      select: 'id,name,team_id,goals,assists,position',
      order: { column: 'goals', ascending: false },
      limit,
    });
    if (error) { console.error('[DB] getTopScorers error:', error.message); return []; }
    return data ?? [];
  }

  // ── MATCHES ──────────────────────────────────────────────────

  async getMatches(status?: Match['status']): Promise<Match[]> {
    if (!db.isConfigured) {
      return status ? MOCK_MATCHES.filter(m => m.status === status) : MOCK_MATCHES;
    }
    const opts = status
      ? { eq: { status }, order: { column: 'date' } }
      : { order: { column: 'date' } };
    const { data, error } = await db.select<Match>('matches', opts);
    if (error) { console.error('[DB] getMatches error:', error.message); return MOCK_MATCHES; }
    return data ?? MOCK_MATCHES;
  }

  async saveMatchResult(matchId: string, homeGoals: number, awayGoals: number): Promise<void> {
    const update = { home_goals: homeGoals, away_goals: awayGoals, status: 'finished' };
    const { error } = await db.update('matches', update, { id: matchId });
    if (error) throw new Error(`[DB] saveMatchResult: ${error.message}`);
    await this.audit('UPDATE', 'matches', matchId, update);
  }

  async createMatch(match: Omit<Match, 'id'>): Promise<Match> {
    const { data, error } = await db.insert<Match>('matches', match as Record<string, unknown>);
    if (error) throw new Error(`[DB] createMatch: ${error.message}`);
    await this.audit('INSERT', 'matches', undefined, match);
    return (Array.isArray(data) ? data[0] : data) as Match;
  }

  // ── STANDINGS ────────────────────────────────────────────────

  async getStandings(): Promise<Standing[]> {
    if (!db.isConfigured) return MOCK_STANDINGS;
    const { data, error } = await db.select<Standing>('standings');
    if (error) { console.error('[DB] getStandings error:', error.message); return MOCK_STANDINGS; }
    return data ?? MOCK_STANDINGS;
  }

  // ── NEWS ─────────────────────────────────────────────────────

  async saveNews(article: NewsArticle): Promise<NewsArticle> {
    const { data, error } = await db.insert<NewsArticle>('news', article as Record<string, unknown>);
    if (error) throw new Error(`[DB] saveNews: ${error.message}`);
    await this.audit('INSERT', 'news', undefined, article);
    return (Array.isArray(data) ? data[0] : data) as NewsArticle;
  }

  async getNews(limit = 10): Promise<NewsArticle[]> {
    if (!db.isConfigured) return [];
    const { data, error } = await db.select<NewsArticle>('news', {
      order: { column: 'published_at', ascending: false },
      limit,
    });
    if (error) { console.error('[DB] getNews error:', error.message); return []; }
    return data ?? [];
  }

  // ── GALLERY ──────────────────────────────────────────────────

  async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const { data, error } = await db.insert<GalleryItem>('gallery', item as Record<string, unknown>);
    if (error) throw new Error(`[DB] saveGalleryItem: ${error.message}`);
    await this.audit('INSERT', 'gallery', undefined, item);
    return (Array.isArray(data) ? data[0] : data) as GalleryItem;
  }

  async getGallery(matchId?: string, limit = 50): Promise<GalleryItem[]> {
    if (!db.isConfigured) return [];
    const opts = matchId
      ? { eq: { match_id: matchId }, order: { column: 'created_at', ascending: false }, limit }
      : { order: { column: 'created_at', ascending: false }, limit };
    const { data, error } = await db.select<GalleryItem>('gallery', opts);
    if (error) { console.error('[DB] getGallery error:', error.message); return []; }
    return data ?? [];
  }

  // ── AUDIT ────────────────────────────────────────────────────

  private async audit(action: string, table: string, recordId?: string, data?: unknown): Promise<void> {
    if (!db.isConfigured) return;
    await db.insert('audit_trail', {
      action,
      table_name: table,
      record_id: recordId,
      new_data: data,
      created_at: new Date().toISOString(),
    });
  }
}

// Singleton
export const dbService = new DatabaseService();
