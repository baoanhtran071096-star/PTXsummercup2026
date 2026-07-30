// Seed tất cả matches còn lại (insert từng trận)
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...vals] = trimmed.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  }
} catch { /* ignore */ }

const BASE = process.env.SUPABASE_URL!;
const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function insert(table: string, data: Record<string, unknown>) {
  const r = await fetch(`${BASE}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: KEY, Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const err = await r.text();
    console.error(`  ❌ ${table} insert failed ${r.status}:`, err.slice(0, 200));
    return false;
  }
  return true;
}

async function main() {
  console.log('\n🌱 SEED REMAINING MATCHES\n' + '─'.repeat(50));

  // Get team IDs
  const res = await fetch(`${BASE}/rest/v1/teams?select=id,name`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const teams = await res.json() as Array<{ id: string; name: string }>;
  const m = Object.fromEntries(teams.map(t => [t.name, t.id]));

  // Clear existing matches first to avoid duplicates
  const delRes = await fetch(`${BASE}/rest/v1/matches?matchday=gte.1`, {
    method: 'DELETE',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  console.log(`🗑️  Cleared existing matches (${delRes.status})`);

  // All 8 matches with explicit null for optional fields
  const matches = [
    { matchday: 1, home_team_id: m['Đội Alpha'],   away_team_id: m['Đội Beta'],    home_goals: 3,    away_goals: 1,    date: '2026-08-05', time: '18:00:00', status: 'finished',  venue: 'San PTX' },
    { matchday: 1, home_team_id: m['Đội Gamma'],   away_team_id: m['Đội Delta'],   home_goals: 2,    away_goals: 2,    date: '2026-08-05', time: '20:00:00', status: 'finished',  venue: 'San PTX' },
    { matchday: 1, home_team_id: m['Đội Epsilon'], away_team_id: m['Đội Zeta'],    home_goals: 1,    away_goals: 0,    date: '2026-08-06', time: '18:00:00', status: 'finished',  venue: 'San PTX' },
    { matchday: 1, home_team_id: m['Đội Eta'],     away_team_id: m['Đội Theta'],   home_goals: 0,    away_goals: 0,    date: '2026-08-06', time: '20:00:00', status: 'finished',  venue: 'San PTX' },
    { matchday: 2, home_team_id: m['Đội Alpha'],   away_team_id: m['Đội Gamma'],   home_goals: null, away_goals: null, date: '2026-08-09', time: '18:00:00', status: 'scheduled', venue: 'San PTX' },
    { matchday: 2, home_team_id: m['Đội Beta'],    away_team_id: m['Đội Delta'],   home_goals: null, away_goals: null, date: '2026-08-09', time: '20:00:00', status: 'scheduled', venue: 'San PTX' },
    { matchday: 2, home_team_id: m['Đội Epsilon'], away_team_id: m['Đội Eta'],     home_goals: null, away_goals: null, date: '2026-08-10', time: '18:00:00', status: 'scheduled', venue: 'San PTX' },
    { matchday: 2, home_team_id: m['Đội Zeta'],    away_team_id: m['Đội Theta'],   home_goals: null, away_goals: null, date: '2026-08-10', time: '20:00:00', status: 'scheduled', venue: 'San PTX' },
  ];

  let ok = 0;
  for (const match of matches) {
    const success = await insert('matches', match as Record<string, unknown>);
    if (success) { ok++; console.log(`  ✅ Vòng ${match.matchday}: ${teams.find(t => t.id === match.home_team_id)?.name} vs ${teams.find(t => t.id === match.away_team_id)?.name}`); }
  }

  // Final verify
  const countRes = await fetch(`${BASE}/rest/v1/matches?select=count`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'count=exact' },
  });
  const total = countRes.headers.get('content-range')?.split('/')[1];

  console.log(`\n📊 Kết quả: ${ok}/8 matches | DB: ${total} bản ghi`);

  // Live standings
  const sv = await fetch(`${BASE}/rest/v1/standings?order=rank`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (sv.ok) {
    const standings = await sv.json() as Array<{ rank: number; team: string; points: number; won: number; drawn: number; lost: number; goals_for: number; goals_against: number }>;
    console.log('\n🏆 BẢNG XẾP HẠNG LIVE TỪ SUPABASE:');
    console.log('─'.repeat(55));
    standings.forEach(s =>
      console.log(`  ${s.rank}. ${s.team.padEnd(14)} | ${s.won}W ${s.drawn}D ${s.lost}L | GD:${(s.goals_for-s.goals_against)>0?'+':''}${s.goals_for-s.goals_against} | ${s.points}đ`)
    );
    console.log('─'.repeat(55));
  }

  console.log('\n✅ Database LIVE — PTX Summer Cup 2026 ready!\n');
}

main().catch(console.error);
