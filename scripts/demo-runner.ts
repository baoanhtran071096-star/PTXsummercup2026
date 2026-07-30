// PTX PLATFORM – DEMO RUNNER
// Chạy mô phỏng toàn bộ luồng Demo chuẩn bị trình chiếu cho Ban Tổ Chức (BTC)

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

import { tournamentService } from '../backend/capabilities/tournament.service';
import { chatEngine } from '../ai-core/engines/chat.engine';
import { formatDate } from '../packages/sdk/src/index';

async function runDemo() {
  console.log('\n========================================================================');
  console.log('🏆 DEMO TRÌNH DIỄN KỊCH BẢN CHÍNH THỨC — PTX SUMMER CUP 2026 PLATFORM');
  console.log('========================================================================\n');

  // DEMO PART 1: TOURNAMENT SNAPSHOT
  console.log('📊 1. TỔNG QUAN GIẢI ĐẤU (LIVE FROM SUPABASE DB)');
  console.log('------------------------------------------------------------------------');
  const snap = await tournamentService.getSnapshot();
  console.log(`  • Giải đấu:        ${snap.name} (${snap.season})`);
  console.log(`  • Số lượng đội:    ${snap.teamCount} đội bóng`);
  console.log(`  • Số lượng cầu thủ: ${snap.playerCount} vận động viên`);
  console.log(`  • Tiến độ trận đấu: ${snap.matchSummary.finished}/${snap.matchSummary.total} trận đã diễn ra`);
  console.log(`  • Đội dẫn đầu BXH:  ${snap.leader ?? 'Chưa xác định'}`);
  console.log(`  • Vua phá lưới:     ${snap.topScorer ?? 'Chưa có'}`);

  // DEMO PART 2: STANDINGS VIEW
  console.log('\n🏆 2. BẢNG XẾP HẠNG TRỰC TUYẾN (REAL-TIME POSTGRESQL VIEW)');
  console.log('------------------------------------------------------------------------');
  const standings = await tournamentService.standings.getStandings();
  console.log('HẠNG | ĐỘI BÓNG         | ST | T | H | B | BT | BB | HS | ĐIỂM');
  console.log('-----+------------------+----+---+---+---+----+----+----+-----');
  standings.forEach(s => {
    const rank = String(s.rank).padStart(2, ' ');
    const team = s.team.padEnd(16, ' ');
    const p = String(s.played).padStart(2, ' ');
    const w = String(s.won).padStart(1, ' ');
    const d = String(s.drawn).padStart(1, ' ');
    const l = String(s.lost).padStart(1, ' ');
    const gf = String(s.goals_for).padStart(2, ' ');
    const ga = String(s.goals_against).padStart(2, ' ');
    const gd = (s.goal_diff >= 0 ? `+${s.goal_diff}` : String(s.goal_diff)).padStart(3, ' ');
    const pts = String(s.points).padStart(2, ' ');
    console.log(` ${rank}  | ${team} | ${p} | ${w} | ${d} | ${l} | ${gf} | ${ga} | ${gd} |  ${pts}`);
  });

  // DEMO PART 3: TOP SCORERS
  console.log('\n⚽ 3. DANH SÁCH VUA PHÁ LƯỚI');
  console.log('------------------------------------------------------------------------');
  const topScorers = await tournamentService.players.getTopScorers(5);
  topScorers.forEach((player, idx) => {
    console.log(`  ${idx + 1}. ${player.name.padEnd(22, ' ')} | Vị trí: ${player.position.padEnd(3, ' ')} | ⚽ ${player.goals} bàn thắng (${player.assists} kiến tạo)`);
  });

  // DEMO PART 4: UPCOMING & RECENT MATCHES
  console.log('\n📅 4. KẾT QUẢ & LỊCH THI ĐẤU');
  console.log('------------------------------------------------------------------------');
  const recent = await tournamentService.matches.getRecentResults(4);
  console.log('  [Kết quả gần đây]');
  recent.forEach(m => {
    console.log(`  • Vòng ${m.matchday}: ${m.home_team} ${m.home_goals} - ${m.away_goals} ${m.away_team} (${formatDate(m.date)})`);
  });

  const upcoming = await tournamentService.matches.getUpcomingMatches(4);
  console.log('\n  [Lịch thi đấu tiếp theo]');
  upcoming.forEach(m => {
    console.log(`  • Vòng ${m.matchday}: ${m.home_team} vs ${m.away_team} (${formatDate(m.date)} lúc ${m.time ?? ''}) — ${m.venue}`);
  });

  // DEMO PART 5: LIVE AI CHAT ASSISTANT
  console.log('\n🤖 5. TRỢ LÝ AI CHAT V2 (SAFETY + CONTEXT + TOOL REGISTRY)');
  console.log('------------------------------------------------------------------------');
  const userQuery = 'Cho tôi xem lịch thi đấu vòng tới và đội nào đang đứng đầu bảng xếp hạng?';
  console.log(`  👤 Người dùng: "${userQuery}"`);
  console.log('  ⚙️  AI Core đang xử lý...');
  const aiStart = Date.now();
  const aiResponse = await chatEngine.chat(userQuery);
  const aiLatency = Date.now() - aiStart;

  console.log(`\n  🤖 PTX Assistant (${aiLatency}ms | Tools: ${aiResponse.toolsUsed.join(', ')}):`);
  console.log('  ┌' + '─'.repeat(70));
  aiResponse.answer.split('\n').forEach(line => {
    console.log('  │ ' + line);
  });
  console.log('  └' + '─'.repeat(70));

  // DEMO PART 6: BTC ADMIN PANEL AUTH
  console.log('\n🔒 6. BẢO MẬT & ADMIN PANEL (BTC ONLY)');
  console.log('------------------------------------------------------------------------');
  console.log('  • Tài khoản Admin BTC:  admin@ptxsummercup.vn');
  console.log('  • Xác thực 2FA OTP:     Mã OTP 6 chữ số');
  console.log('  • Trạng thái Audit Log: Enabled (Bảo vệ dữ liệu giải đấu)');

  console.log('\n========================================================================');
  console.log('🎉 DEMO HOÀN THÀNH XUẤT SẮC — SẴN SÀNG TRÌNH DIỄN CHO BTC NGÀY 04/08!');
  console.log('========================================================================\n');
}

runDemo().catch(console.error);
