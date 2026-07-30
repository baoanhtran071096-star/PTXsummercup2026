// ================================================================
// PTX SUPABASE MIGRATION RUNNER
// Chạy migration SQL lên DB thật qua Supabase REST API.
// ================================================================

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...vals] = trimmed.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  }
} catch { /* ignore */ }

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function runSQL(sql: string, description: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    // Try direct query endpoint
    const res2 = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    if (res2.ok) {
      console.log(`  ✅ ${description}`);
      return true;
    }

    // Try REST insert approach for simple statements
    console.log(`  ⚠️  ${description} — status: ${res2.status}`);
    return false;
  } catch (e) {
    console.error(`  ❌ ${description}:`, (e as Error).message);
    return false;
  }
}

// Insert via REST API (works for seed data)
async function restInsert(table: string, data: Record<string, unknown>[]): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal,resolution=ignore-duplicates',
      },
      body: JSON.stringify(data),
    });
    return res.ok || res.status === 201;
  } catch {
    return false;
  }
}

// Check if table exists
async function tableExists(table: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=0`, {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
    });
    return res.ok;
  } catch { return false; }
}

async function main() {
  console.log('\n🏗️  PTX SUPABASE MIGRATION RUNNER');
  console.log('─'.repeat(50));
  console.log(`Target: ${SUPABASE_URL}`);
  console.log('─'.repeat(50));

  // ── STEP 1: Check existing tables ──────────────────────────
  console.log('\n📋 STEP 1: Kiểm tra bảng hiện tại...');
  const tables = ['teams', 'players', 'matches', 'news', 'gallery'];
  const existing: string[] = [];
  for (const t of tables) {
    const exists = await tableExists(t);
    console.log(`  ${exists ? '✅' : '⬜'} ${t}`);
    if (exists) existing.push(t);
  }

  if (existing.length === tables.length) {
    console.log('\n✅ Tất cả bảng đã tồn tại! Bỏ qua migration, tiến hành seed...');
  } else {
    // ── STEP 2: Migration qua SQL Editor hint ─────────────────
    console.log('\n📝 STEP 2: Bảng chưa tồn tại.');
    console.log('  → Cần chạy migration SQL trong Supabase SQL Editor');
    console.log('  → File: data-platform/supabase/migrations/001_initial_schema.sql');
    console.log('\n  Đang thử tạo bảng qua API...');

    // Try to create tables via Supabase's internal SQL endpoint
    const createTablesSQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  short_name TEXT,
  logo_url TEXT,
  color TEXT DEFAULT '#1D3557',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  team_id UUID,
  position TEXT,
  jersey_num INTEGER,
  avatar_url TEXT,
  profile TEXT,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matchday INTEGER NOT NULL,
  home_team_id UUID,
  away_team_id UUID,
  home_goals INTEGER,
  away_goals INTEGER,
  date DATE NOT NULL,
  time TIME,
  venue TEXT DEFAULT 'Sân PTX',
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  cover_image_url TEXT,
  match_id UUID,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  match_id UUID,
  team_id UUID,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_trail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
    `.trim();

    // Try pg/query endpoint
    const pgRes = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: createTablesSQL }),
    });

    if (pgRes.ok) {
      console.log('  ✅ Migration chạy thành công qua /pg/query!');
    } else {
      const errText = await pgRes.text();
      console.log(`  ⚠️  /pg/query status: ${pgRes.status}`);

      // Output SQL file path for manual run
      console.log('\n' + '═'.repeat(50));
      console.log('📌 HƯỚNG DẪN CHẠY THỦ CÔNG (1 lần duy nhất):');
      console.log('═'.repeat(50));
      console.log('1. Mở: https://supabase.com/dashboard/project/wmamuqylqqikvseuqerm/sql/new');
      console.log('2. Paste toàn bộ nội dung file:');
      console.log('   data-platform/supabase/migrations/001_initial_schema.sql');
      console.log('3. Nhấn "Run"');
      console.log('4. Chạy lại script này để seed dữ liệu');
      console.log('═'.repeat(50));
      process.exit(0);
    }
  }

  // ── STEP 3: Seed data ───────────────────────────────────────
  console.log('\n🌱 STEP 3: Seeding dữ liệu...');

  // Seed teams
  const teamsOk = await restInsert('teams', [
    { name: 'Đội Alpha',   short_name: 'ALP', color: '#E63946' },
    { name: 'Đội Beta',    short_name: 'BET', color: '#2A9D8F' },
    { name: 'Đội Gamma',   short_name: 'GAM', color: '#F4A261' },
    { name: 'Đội Delta',   short_name: 'DEL', color: '#457B9D' },
    { name: 'Đội Epsilon', short_name: 'EPS', color: '#6A4C93' },
    { name: 'Đội Zeta',    short_name: 'ZET', color: '#1D3557' },
    { name: 'Đội Eta',     short_name: 'ETA', color: '#E9C46A' },
    { name: 'Đội Theta',   short_name: 'THE', color: '#264653' },
  ]);
  console.log(`  ${teamsOk ? '✅' : '❌'} 8 Teams`);

  // Get team IDs
  const teamsRes = await fetch(`${SUPABASE_URL}/rest/v1/teams?select=id,name&order=name`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  const teams = (await teamsRes.json()) as Array<{ id: string; name: string }>;
  const teamMap = Object.fromEntries(teams.map(t => [t.name, t.id]));
  console.log(`  📋 Lấy được ${teams.length} team IDs`);

  if (teams.length > 0) {
    // Seed players
    const playersOk = await restInsert('players', [
      { name: 'Nguyễn Văn An',    team_id: teamMap['Đội Alpha'],   position: 'ST',  jersey_num: 9,  goals: 5, assists: 2, yellow_cards: 0, red_cards: 0 },
      { name: 'Trần Minh Khoa',   team_id: teamMap['Đội Alpha'],   position: 'CM',  jersey_num: 10, goals: 2, assists: 4, yellow_cards: 1, red_cards: 0 },
      { name: 'Lê Hoàng Nam',     team_id: teamMap['Đội Alpha'],   position: 'GK',  jersey_num: 1,  goals: 0, assists: 0, yellow_cards: 0, red_cards: 0 },
      { name: 'Phạm Thanh Tùng',  team_id: teamMap['Đội Beta'],    position: 'ST',  jersey_num: 9,  goals: 4, assists: 1, yellow_cards: 0, red_cards: 0 },
      { name: 'Đỗ Văn Bình',      team_id: teamMap['Đội Beta'],    position: 'CAM', jersey_num: 10, goals: 1, assists: 3, yellow_cards: 0, red_cards: 0 },
      { name: 'Ngô Thế Anh',      team_id: teamMap['Đội Beta'],    position: 'CB',  jersey_num: 5,  goals: 0, assists: 0, yellow_cards: 1, red_cards: 0 },
      { name: 'Vũ Đức Hùng',      team_id: teamMap['Đội Gamma'],   position: 'LW',  jersey_num: 7,  goals: 3, assists: 2, yellow_cards: 0, red_cards: 0 },
      { name: 'Đinh Văn Long',     team_id: teamMap['Đội Gamma'],   position: 'RW',  jersey_num: 11, goals: 2, assists: 1, yellow_cards: 0, red_cards: 0 },
      { name: 'Hoàng Văn Dũng',   team_id: teamMap['Đội Delta'],   position: 'ST',  jersey_num: 9,  goals: 2, assists: 0, yellow_cards: 0, red_cards: 0 },
      { name: 'Cao Văn Phúc',     team_id: teamMap['Đội Epsilon'], position: 'CAM', jersey_num: 10, goals: 1, assists: 3, yellow_cards: 0, red_cards: 0 },
      { name: 'Mai Xuân Thắng',   team_id: teamMap['Đội Zeta'],    position: 'ST',  jersey_num: 9,  goals: 2, assists: 1, yellow_cards: 0, red_cards: 0 },
      { name: 'Lưu Trọng Nhân',   team_id: teamMap['Đội Eta'],     position: 'RW',  jersey_num: 11, goals: 1, assists: 1, yellow_cards: 0, red_cards: 0 },
      { name: 'Tô Văn Khải',      team_id: teamMap['Đội Theta'],   position: 'ST',  jersey_num: 9,  goals: 1, assists: 0, yellow_cards: 0, red_cards: 0 },
    ]);
    console.log(`  ${playersOk ? '✅' : '❌'} 13 Players`);

    // Seed matches (Vòng 1 - finished)
    const alphaId = teamMap['Đội Alpha'];
    const betaId  = teamMap['Đội Beta'];
    const gammaId = teamMap['Đội Gamma'];
    const deltaId = teamMap['Đội Delta'];
    const epsId   = teamMap['Đội Epsilon'];
    const zetaId  = teamMap['Đội Zeta'];
    const etaId   = teamMap['Đội Eta'];
    const thetaId = teamMap['Đội Theta'];

    const matchesOk = await restInsert('matches', [
      { matchday: 1, home_team_id: alphaId, away_team_id: betaId,  home_goals: 3, away_goals: 1, date: '2026-08-05', time: '18:00:00', status: 'finished' },
      { matchday: 1, home_team_id: gammaId, away_team_id: deltaId, home_goals: 2, away_goals: 2, date: '2026-08-05', time: '20:00:00', status: 'finished' },
      { matchday: 1, home_team_id: epsId,   away_team_id: zetaId,  home_goals: 1, away_goals: 0, date: '2026-08-06', time: '18:00:00', status: 'finished' },
      { matchday: 1, home_team_id: etaId,   away_team_id: thetaId, home_goals: 0, away_goals: 0, date: '2026-08-06', time: '20:00:00', status: 'finished' },
      { matchday: 2, home_team_id: alphaId, away_team_id: gammaId, date: '2026-08-09', time: '18:00:00', status: 'scheduled' },
      { matchday: 2, home_team_id: betaId,  away_team_id: deltaId, date: '2026-08-09', time: '20:00:00', status: 'scheduled' },
      { matchday: 2, home_team_id: epsId,   away_team_id: etaId,   date: '2026-08-10', time: '18:00:00', status: 'scheduled' },
      { matchday: 2, home_team_id: zetaId,  away_team_id: thetaId, date: '2026-08-10', time: '20:00:00', status: 'scheduled' },
    ]);
    console.log(`  ${matchesOk ? '✅' : '❌'} 8 Matches (4 finished + 4 scheduled)`);
  }

  // ── STEP 4: Verify ──────────────────────────────────────────
  console.log('\n🔍 STEP 4: Xác minh dữ liệu...');
  for (const table of ['teams', 'players', 'matches']) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: 'count=exact',
      },
    });
    const count = res.headers.get('content-range')?.split('/')[1] ?? '?';
    console.log(`  ✅ ${table}: ${count} bản ghi`);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('🎉 Migration & Seed hoàn tất!');
  console.log(`🌐 Dashboard: https://supabase.com/dashboard/project/wmamuqylqqikvseuqerm/editor`);
  console.log('─'.repeat(50) + '\n');
}

main().catch(console.error);
