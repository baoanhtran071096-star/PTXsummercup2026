// PTX PLATFORM – OFFICIAL MIGRATION & SEED RUNNER (DAY 1 - 01/08/2026)
// Thực thi Migration & Seed dữ liệu chính thức lên Supabase Live Production DB.

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Load .env
try {
  const envPath = resolve(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const envFile = readFileSync(envPath, 'utf8');
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
    }
  }
} catch { /* ignore */ }

const BASE = process.env.SUPABASE_URL!;
const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!BASE || !KEY) {
  console.error('❌ ERROR: SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY chưa được cấu hình!');
  process.exit(1);
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function req<T>(endpoint: string, method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}/rest/v1/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`[${method} ${endpoint}] HTTP ${res.status}: ${errText}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

async function runOfficialMigrationAndSeed() {
  console.log('\n===============================================================');
  console.log('🚀 THỰC THI MIGRATION & SEED DỮ LIỆU CHÍNH THỨC (01/08/2026)');
  console.log('===============================================================\n');

  // STEP 1: TEAMS MIGRATION & SEED
  console.log('📦 1. MIGRATION & SEED 8 ĐỘI BÓNG (TEAMS)');
  console.log('---------------------------------------------------------------');
  
  // Fetch existing teams or insert
  let teams = await req<Array<{ id: string; name: string }>>('teams?select=id,name');
  if (teams.length < 8) {
    const officialTeams = [
      { name: 'Đội Alpha', short_name: 'ALP', logo_url: 'https://i.postimg.cc/J4BFgJp7/CD.jpg', color: '#00ff9d' },
      { name: 'Đội Beta', short_name: 'BET', logo_url: 'https://i.postimg.cc/J4BFgJp7/CD.jpg', color: '#f15a24' },
      { name: 'Đội Gamma', short_name: 'GAM', logo_url: 'https://i.postimg.cc/J4BFgJp7/CD.jpg', color: '#00b8d4' },
      { name: 'Đội Delta', short_name: 'DEL', logo_url: 'https://i.postimg.cc/J4BFgJp7/CD.jpg', color: '#ffd700' },
      { name: 'Đội Epsilon', short_name: 'EPS', logo_url: 'https://i.postimg.cc/J4BFgJp7/CD.jpg', color: '#a855f7' },
      { name: 'Đội Zeta', short_name: 'ZET', logo_url: 'https://i.postimg.cc/J4BFgJp7/CD.jpg', color: '#ec4899' },
      { name: 'Đội Eta', short_name: 'ETA', logo_url: 'https://i.postimg.cc/J4BFgJp7/CD.jpg', color: '#3b82f6' },
      { name: 'Đội Theta', short_name: 'THE', logo_url: 'https://i.postimg.cc/J4BFgJp7/CD.jpg', color: '#10b981' },
    ];
    for (const t of officialTeams) {
      if (!teams.find(x => x.name === t.name)) {
        await req('teams', 'POST', t);
      }
    }
    teams = await req<Array<{ id: string; name: string }>>('teams?select=id,name');
  }

  console.log(`  ✅ Đã khởi tạo & xác minh ${teams.length}/8 Đội bóng vào database!`);
  const tm = Object.fromEntries(teams.map(t => [t.name, t.id]));

  // STEP 2: PLAYERS MIGRATION & SEED
  console.log('\n⚽ 2. MIGRATION & SEED 13 CẦU THỦ THỐNG KÊ (PLAYERS)');
  console.log('---------------------------------------------------------------');
  const officialPlayers = [
    { name: 'Nguyễn Văn B (Cáp)', team_id: tm['Đội Alpha'], position: 'ST', jersey_num: 10, goals: 8, assists: 3, yellow_cards: 1, red_cards: 0, profile: 'Tiền đạo chủ lực Đội Alpha, khả năng dứt điểm đa dạng.' },
    { name: 'Trần Minh C', team_id: tm['Đội Alpha'], position: 'CAM', jersey_num: 7, goals: 3, assists: 5, yellow_cards: 0, red_cards: 0, profile: 'Nhạc trưởng tuyến giữa, kiến tạo hàng đầu.' },
    { name: 'Lê Hoàng D', team_id: tm['Đội Alpha'], position: 'CB', jersey_num: 4, goals: 1, assists: 0, yellow_cards: 2, red_cards: 0, profile: 'Trung vệ thép, đánh đầu tốt.' },
    { name: 'Phạm Quốc E', team_id: tm['Đội Alpha'], position: 'GK', jersey_num: 1, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, profile: 'Thủ môn xuất sắc với 12 pha cứu thua.' },

    { name: 'Nguyễn Văn F', team_id: tm['Đội Beta'], position: 'ST', jersey_num: 9, goals: 4, assists: 1, yellow_cards: 0, red_cards: 0, profile: 'Tiền đạo cắm Đội Beta, sút xa uy lực.' },
    { name: 'Hoàng Văn G', team_id: tm['Đội Beta'], position: 'CM', jersey_num: 8, goals: 2, assists: 3, yellow_cards: 1, red_cards: 0, profile: 'Tiền vệ trung tâm bao quát sân tốt.' },
    { name: 'Vũ Minh H', team_id: tm['Đội Beta'], position: 'RB', jersey_num: 2, goals: 0, assists: 2, yellow_cards: 1, red_cards: 0, profile: 'Hậu vệ cánh tốc độ cao.' },

    { name: 'Đặng Tuấn I', team_id: tm['Đội Gamma'], position: 'ST', jersey_num: 11, goals: 5, assists: 2, yellow_cards: 0, red_cards: 0, profile: 'Chân sút hàng đầu Đội Gamma.' },
    { name: 'Bùi Anh K', team_id: tm['Đội Gamma'], position: 'LW', jersey_num: 14, goals: 3, assists: 4, yellow_cards: 1, red_cards: 0, profile: 'Tiền đạo cánh kỹ thuật.' },
    { name: 'Đỗ Hữu L', team_id: tm['Đội Gamma'], position: 'CDM', jersey_num: 6, goals: 1, assists: 1, yellow_cards: 3, red_cards: 0, profile: 'Máy quét tuyến giữa.' },

    { name: 'Nghiêm Xuân M', team_id: tm['Đội Delta'], position: 'ST', jersey_num: 99, goals: 3, assists: 0, yellow_cards: 0, red_cards: 0, profile: 'Tiền đạo Đội Delta.' },
    { name: 'Cao Văn N', team_id: tm['Đội Delta'], position: 'CB', jersey_num: 5, goals: 0, assists: 1, yellow_cards: 2, red_cards: 0, profile: 'Trung vệ Đội Delta.' },
    { name: 'Trịnh Tiến O', team_id: tm['Đội Delta'], position: 'GK', jersey_num: 12, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, profile: 'Thủ môn Đội Delta.' },
  ];

  await fetch(`${BASE}/rest/v1/players?jersey_num=gte.0`, { method: 'DELETE', headers });
  const insertedPlayers = await req<Array<{ id: string }>>('players', 'POST', officialPlayers);
  console.log(`  ✅ Đã seed ${insertedPlayers.length}/13 Cầu thủ chính thức vào database!`);

  // STEP 3: MATCHES MIGRATION & SEED
  console.log('\n📅 3. MIGRATION & SEED 8 TRẬN ĐẤU (MATCHES)');
  console.log('---------------------------------------------------------------');
  const officialMatches = [
    // Vòng 1 (Finished)
    { matchday: 1, home_team_id: tm['Đội Alpha'], away_team_id: tm['Đội Beta'], home_goals: 3, away_goals: 1, status: 'finished', date: '2026-08-05', time: '18:00', venue: 'Sân Complex PTX' },
    { matchday: 1, home_team_id: tm['Đội Gamma'], away_team_id: tm['Đội Delta'], home_goals: 2, away_goals: 2, status: 'finished', date: '2026-08-05', time: '20:00', venue: 'Sân Complex PTX' },
    { matchday: 1, home_team_id: tm['Đội Epsilon'], away_team_id: tm['Đội Zeta'], home_goals: 1, away_goals: 0, status: 'finished', date: '2026-08-06', time: '18:00', venue: 'Sân Complex PTX' },
    { matchday: 1, home_team_id: tm['Đội Eta'], away_team_id: tm['Đội Theta'], home_goals: 0, away_goals: 0, status: 'finished', date: '2026-08-06', time: '20:00', venue: 'Sân Complex PTX' },
    // Vòng 2 (Scheduled)
    { matchday: 2, home_team_id: tm['Đội Alpha'], away_team_id: tm['Đội Gamma'], home_goals: null, away_goals: null, status: 'scheduled', date: '2026-08-09', time: '18:00', venue: 'Sân Complex PTX' },
    { matchday: 2, home_team_id: tm['Đội Beta'], away_team_id: tm['Đội Delta'], home_goals: null, away_goals: null, status: 'scheduled', date: '2026-08-09', time: '20:00', venue: 'Sân Complex PTX' },
    { matchday: 2, home_team_id: tm['Đội Epsilon'], away_team_id: tm['Đội Eta'], home_goals: null, away_goals: null, status: 'scheduled', date: '2026-08-10', time: '18:00', venue: 'Sân Complex PTX' },
    { matchday: 2, home_team_id: tm['Đội Zeta'], away_team_id: tm['Đội Theta'], home_goals: null, away_goals: null, status: 'scheduled', date: '2026-08-10', time: '20:00', venue: 'Sân Complex PTX' },
  ];

  await fetch(`${BASE}/rest/v1/matches?matchday=gte.1`, { method: 'DELETE', headers });
  const insertedMatches = await req<Array<{ id: string }>>('matches', 'POST', officialMatches);
  console.log(`  ✅ Đã seed ${insertedMatches.length}/8 Trận đấu chính thức vào database!`);

  // STEP 4: NEWS SEEDING
  console.log('\n📰 4. SEED TIN TỨC & GALLERY ẢNH (NEWS & GALLERY)');
  console.log('---------------------------------------------------------------');
  const officialNews = [
    { title: 'Khai mạc rực rỡ PTX Summer Cup 2026 với 8 đội bóng tham gia', content: 'Giải bóng đá nội bộ PTX Summer Cup 2026 đã chính thức diễn ra thành công với sự hưởng ứng nhiệt tình từ toàn thể công nhân viên.', created_at: new Date().toISOString() },
    { title: 'Đội Alpha thắng ấn tượng 3-1 trận mở màn', content: 'Với phong độ chói sáng của Nguyễn Văn B, Đội Alpha đã xuất sắc vượt qua Đội Beta với tỷ số 3-1.', created_at: new Date().toISOString() },
  ];
  await fetch(`${BASE}/rest/v1/news?id=neq.0`, { method: 'DELETE', headers });
  await req('news', 'POST', officialNews);
  console.log('  ✅ Đã seed Tin tức giải đấu chính thức vào database!');

  // STEP 5: VERIFY LIVE STANDINGS VIEW
  console.log('\n🏆 5. KIỂM TRA BẢNG XẾP HẠNG REAL-TIME (POSTGRESQL VIEW)');
  console.log('---------------------------------------------------------------');
  const standings = await req<Array<{ rank: number; team: string; points: number; goal_diff: number }>>('standings?order=rank.asc');

  console.log('  HẠNG | ĐỘI BÓNG         | ĐIỂM | HIỆU SỐ');
  console.log('  -----+------------------+------+--------');
  standings.forEach(s => {
    console.log(`   ${s.rank}   | ${s.team.padEnd(16, ' ')} |  ${s.points}   |  ${s.goal_diff > 0 ? '+' : ''}${s.goal_diff}`);
  });

  console.log('\n===============================================================');
  console.log('🎉 MIGRATION & SEED DỮ LIỆU CHÍNH THỨC HOÀN THÀNH 100%!');
  console.log('===============================================================\n');
}

runOfficialMigrationAndSeed().catch(console.error);
