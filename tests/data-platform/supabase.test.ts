// ================================================================
// PTX SUPABASE DATA LAYER – TEST SUITE
// Kiểm thử DatabaseService với mock data (không cần DB thực).
// ================================================================

import { DatabaseService } from '../../data-platform/supabase/db.service';

const db = new DatabaseService();
const results: { name: string; passed: boolean; error?: string }[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  ✅ ${name}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, error: msg });
    console.error(`  ❌ ${name}: ${msg}`);
  }
}

async function runTests() {
  console.log('\n🧪 PTX SUPABASE DATA LAYER TEST SUITE\n' + '─'.repeat(50));

  // TC1: Teams – mock data khi không có Supabase URL
  await test('TC1: getTeams() returns mock data (no DB)', async () => {
    const teams = await db.getTeams();
    if (!Array.isArray(teams)) throw new Error('Expected array');
    if (teams.length === 0) throw new Error('Expected at least 1 team');
    console.log(`    ${teams.length} đội: ${teams.slice(0, 3).map(t => t.name).join(', ')}...`);
  });

  // TC2: Standings – mock BXH
  await test('TC2: getStandings() returns mock standings', async () => {
    const standings = await db.getStandings();
    if (!Array.isArray(standings)) throw new Error('Expected array');
    if (standings.length === 0) throw new Error('Expected standings data');
    const leader = standings[0];
    console.log(`    Leader: ${leader.team} – ${leader.points} điểm (${leader.won}W ${leader.drawn}D ${leader.lost}L)`);
  });

  // TC3: Matches – scheduled
  await test('TC3: getMatches("scheduled") returns future fixtures', async () => {
    const matches = await db.getMatches('scheduled');
    if (!Array.isArray(matches)) throw new Error('Expected array');
    console.log(`    ${matches.length} trận sắp diễn ra`);
    if (matches.length > 0) {
      console.log(`    Ví dụ: ${matches[0].home_team ?? '?'} vs ${matches[0].away_team ?? '?'} (${matches[0].date})`);
    }
  });

  // TC4: Matches – finished
  await test('TC4: getMatches("finished") returns results', async () => {
    const matches = await db.getMatches('finished');
    if (!Array.isArray(matches)) throw new Error('Expected array');
    console.log(`    ${matches.length} trận đã kết thúc`);
    if (matches.length > 0) {
      const m = matches[0];
      console.log(`    Ví dụ: ${m.home_team ?? '?'} ${m.home_goals}-${m.away_goals} ${m.away_team ?? '?'}`);
    }
  });

  // TC5: saveNews – mock insert
  await test('TC5: saveNews() inserts article (mock)', async () => {
    const saved = await db.saveNews({
      title: 'PTX Alpha thắng Beta 3-1 trong trận mở màn',
      content: 'Đội Alpha giành chiến thắng ấn tượng...',
      meta_title: 'PTX Summer Cup – Alpha 3-1 Beta',
      keywords: ['ptx', 'bóng đá', 'alpha', 'beta'],
    });
    if (!saved) throw new Error('saveNews returned null');
    console.log(`    Saved news ID: ${saved.id ?? '(mock)'}`);
  });

  // TC6: saveGalleryItem – mock insert
  await test('TC6: saveGalleryItem() inserts image (mock)', async () => {
    const saved = await db.saveGalleryItem({
      image_url: 'https://example.com/ptx-goal.jpg',
      description: 'Khoảnh khắc bàn thắng của Nguyễn Văn An',
      tags: ['bàn thắng', 'alpha', 'vòng 1'],
      uploaded_by: 'BTC',
    });
    if (!saved) throw new Error('saveGalleryItem returned null');
    console.log(`    Saved gallery ID: ${saved.id ?? '(mock)'}`);
  });

  // TC7: createTeam – mock insert
  await test('TC7: createTeam() creates new team (mock)', async () => {
    const team = await db.createTeam({
      name: 'Đội Test FC',
      short_name: 'TST',
      color: '#FF0000',
    });
    if (!team?.name) throw new Error('createTeam returned invalid data');
    console.log(`    Created team: ${team.name} (ID: ${team.id ?? 'mock'})`);
  });

  // TC8: getPlayers – returns array (may be empty without DB)
  await test('TC8: getPlayers() returns array', async () => {
    const players = await db.getPlayers();
    if (!Array.isArray(players)) throw new Error('Expected array');
    console.log(`    ${players.length} cầu thủ (từ DB hoặc [])`);
  });

  // Summary
  console.log('\n' + '─'.repeat(50));
  const passed = results.filter(r => r.passed).length;
  console.log(`📊 KẾT QUẢ: ${passed}/${results.length} tests passed ${passed === results.length ? '🎉' : '⚠️'}`);
  console.log('─'.repeat(50) + '\n');

  if (passed < results.length) process.exit(1);
}

runTests().catch(console.error);
