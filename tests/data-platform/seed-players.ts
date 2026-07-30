// Seed 13 players lên Supabase DB thật
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

async function main() {
  console.log('\n🌱 SEED PLAYERS TO REAL DB\n' + '─'.repeat(50));

  // Get teams
  const res = await fetch(`${BASE}/rest/v1/teams?select=id,name`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const teams = await res.json() as Array<{ id: string; name: string }>;
  const tm = Object.fromEntries(teams.map(t => [t.name, t.id]));

  const alphaId = tm['Đội Alpha'] ?? Object.values(tm)[0];
  const betaId  = tm['Đội Beta']  ?? Object.values(tm)[1];
  const gammaId = tm['Đội Gamma'] ?? Object.values(tm)[2];
  const deltaId = tm['Đội Delta'] ?? Object.values(tm)[3];

  const players = [
    { name: 'Nguyễn Văn B (Cáp)', team_id: alphaId, position: 'ST', jersey_num: 10, goals: 8, assists: 3, yellow_cards: 1, red_cards: 0, profile: 'Tiền đạo chủ lực Đội Alpha, khả năng dứt điểm đa dạng.' },
    { name: 'Trần Minh C', team_id: alphaId, position: 'CAM', jersey_num: 7, goals: 3, assists: 5, yellow_cards: 0, red_cards: 0, profile: 'Nhạc trưởng tuyến giữa, kiến tạo hàng đầu.' },
    { name: 'Lê Hoàng D', team_id: alphaId, position: 'CB', jersey_num: 4, goals: 1, assists: 0, yellow_cards: 2, red_cards: 0, profile: 'Trung vệ thép, đánh đầu tốt.' },
    { name: 'Phạm Quốc E', team_id: alphaId, position: 'GK', jersey_num: 1, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, profile: 'Thủ môn xuất sắc với 12 pha cứu thua.' },

    { name: 'Nguyễn Văn F', team_id: betaId, position: 'ST', jersey_num: 9, goals: 4, assists: 1, yellow_cards: 0, red_cards: 0, profile: 'Tiền đạo cắm Đội Beta, sút xa uy lực.' },
    { name: 'Hoàng Văn G', team_id: betaId, position: 'CM', jersey_num: 8, goals: 2, assists: 3, yellow_cards: 1, red_cards: 0, profile: 'Tiền vệ trung tâm bao quát sân tốt.' },
    { name: 'Vũ Minh H', team_id: betaId, position: 'RB', jersey_num: 2, goals: 0, assists: 2, yellow_cards: 1, red_cards: 0, profile: 'Hậu vệ cánh tốc độ cao.' },

    { name: 'Đặng Tuấn I', team_id: gammaId, position: 'ST', jersey_num: 11, goals: 5, assists: 2, yellow_cards: 0, red_cards: 0, profile: 'Chân sút hàng đầu Đội Gamma.' },
    { name: 'Bùi Anh K', team_id: gammaId, position: 'LW', jersey_num: 14, goals: 3, assists: 4, yellow_cards: 1, red_cards: 0, profile: 'Tiền đạo cánh kỹ thuật.' },
    { name: 'Đỗ Hữu L', team_id: gammaId, position: 'CDM', jersey_num: 6, goals: 1, assists: 1, yellow_cards: 3, red_cards: 0, profile: 'Máy quét tuyến giữa.' },

    { name: 'Nghiêm Xuân M', team_id: deltaId, position: 'ST', jersey_num: 99, goals: 3, assists: 0, yellow_cards: 0, red_cards: 0, profile: 'Tiền đạo Đội Delta.' },
    { name: 'Cao Văn N', team_id: deltaId, position: 'CB', jersey_num: 5, goals: 0, assists: 1, yellow_cards: 2, red_cards: 0, profile: 'Trung vệ Đội Delta.' },
    { name: 'Trịnh Tiến O', team_id: deltaId, position: 'GK', jersey_num: 12, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, profile: 'Thủ môn Đội Delta.' },
  ];

  // Delete existing players first
  await fetch(`${BASE}/rest/v1/players?jersey_num=gte.0`, {
    method: 'DELETE',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });

  let count = 0;
  for (const p of players) {
    const r = await fetch(`${BASE}/rest/v1/players`, {
      method: 'POST',
      headers: {
        apikey: KEY, Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(p),
    });
    if (r.ok) count++;
  }

  console.log(`✅ Seeded ${count}/13 players to live Supabase DB!\n`);
}

main().catch(console.error);
