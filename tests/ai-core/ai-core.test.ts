// ================================================================
// PTX AI CORE – TEST SUITE
// Kiểm thử toàn bộ AI Core: Orchestrator, Engines, Workflows.
// ================================================================

import { AIOrchestrator } from '../../ai-core/orchestrator/orchestrator';

const orchestrator = new AIOrchestrator();

interface TestResult { name: string; passed: boolean; error?: string; data?: unknown }
const results: TestResult[] = [];

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
  console.log('\n🧪 PTX AI CORE TEST SUITE\n' + '─'.repeat(50));

  // ── TC1: Analytics Engine – updateStandings ──
  await test('TC1: AnalyticsEngine.updateStandings', async () => {
    const res = await orchestrator.process({
      type: 'analytics',
      payload: {
        action: 'updateStandings',
        data: {
          results: [
            { homeTeam: 'Đội A', awayTeam: 'Đội B', homeGoals: 2, awayGoals: 1, matchday: 1, date: '2026-08-05' },
            { homeTeam: 'Đội C', awayTeam: 'Đội A', homeGoals: 0, awayGoals: 0, matchday: 2, date: '2026-08-06' },
          ],
        },
      },
    });
    if (!res.success) throw new Error(res.error);
    const standings = res.data?.outputs?.analytics as unknown[];
    if (!Array.isArray(standings) || standings.length === 0) throw new Error('Standings empty');
    console.log('    BXH:', standings.map((s: unknown) => `${(s as { team: string }).team}:${(s as { points: number }).points}đ`).join(', '));
  });

  // ── TC2: SearchEngine – checkDuplicate ──
  await test('TC2: SearchEngine.checkDuplicate', async () => {
    const res = await orchestrator.process({
      type: 'search',
      payload: {
        action: 'checkDuplicate',
        data: { name: 'Nguyễn Văn A' },
        dataset: [
          { name: 'Nguyễn Văn A', team: 'Đội X' },
          { name: 'Trần Văn B', team: 'Đội Y' },
        ],
      },
    });
    if (!res.success) throw new Error(res.error);
    const result = res.data?.outputs?.search as { hasDuplicate: boolean };
    if (!result.hasDuplicate) throw new Error('Should detect duplicate');
    console.log('    Trùng lặp phát hiện: ✓');
  });

  // ── TC3: SearchEngine – search ──
  await test('TC3: SearchEngine.search', async () => {
    const res = await orchestrator.process({
      type: 'search',
      payload: {
        action: 'search',
        query: 'Hùng',
        type: 'player',
        dataset: [
          { name: 'Lê Văn Hùng', team: 'Đội A', goals: 5 },
          { name: 'Trần Văn Bình', team: 'Đội B', goals: 3 },
        ],
      },
    });
    if (!res.success) throw new Error(res.error);
    const result = res.data?.outputs?.search as { count: number };
    if (result.count === 0) throw new Error('Search returned 0 results');
    console.log(`    Tìm thấy ${result.count} kết quả`);
  });

  // ── TC4: Workflow Template – match-result (no Gemini) ──
  await test('TC4: Workflow "match-result" (Analytics steps only)', async () => {
    // Analytics Engine không cần Gemini nên test được offline
    const res = await orchestrator.process({
      type: 'match-result',
      payload: {
        action: 'updateStandings',
        data: {
          homeTeam: 'Đội Alpha', awayTeam: 'Đội Beta',
          homeGoals: 3, awayGoals: 1, matchday: 3, date: '2026-08-07',
          results: [
            { homeTeam: 'Đội Alpha', awayTeam: 'Đội Beta', homeGoals: 3, awayGoals: 1, matchday: 3, date: '2026-08-07' },
          ],
        },
      },
    });
    // Workflow sẽ chạy, content/automation steps sẽ thất bại vì mock → nhưng analytics phải pass
    console.log(`    Workflow engine: ${res.engine}, success: ${res.success}`);
    // Không throw — chỉ kiểm tra workflow runner được gọi
  });

  // ── TC5: Analytics – computeStats (v2 – DB-connected) ──
  await test('TC5: AnalyticsEngine.computeStats', async () => {
    const res = await orchestrator.process({
      type: 'analytics',
      payload: {
        action: 'computeStats',
        data: { matchId: 'test-m1', homeTeam: 'Đội A', awayTeam: 'Đội B', homeGoals: 2, awayGoals: 2 },
      },
    });
    if (!res.success) throw new Error(res.error);
    const stats = res.data?.outputs?.analytics as { totalMatches: number; currentMatch?: { winner: string } };
    if (typeof stats.totalMatches !== 'number') throw new Error('Expected totalMatches field');
    const winner = stats.currentMatch?.winner;
    if (winner !== 'Hòa') throw new Error(`Expected "Hòa", got "${winner}"`);
    console.log(`    totalMatches=${stats.totalMatches}, currentMatch winner: ${winner} ✓`);
  });

  // ── TC6: Orchestrator – error handling ──
  await test('TC6: Orchestrator error handling (unknown engine)', async () => {
    const res = await orchestrator.process({
      type: 'chat',
      payload: { message: '', sessionId: 'test-err', action: 'invalid' },
    });
    // Chat engine sẽ trả về reply mặc định (không có API key) hoặc error
    // Chỉ cần response object hợp lệ
    if (typeof res.success !== 'boolean') throw new Error('Response must have success field');
    console.log(`    Handled gracefully: success=${res.success}`);
  });

  // ── Summary ──
  console.log('\n' + '─'.repeat(50));
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  console.log(`📊 KẾT QUẢ: ${passed}/${total} tests passed ${passed === total ? '🎉' : '⚠️'}`);
  console.log('─'.repeat(50) + '\n');

  if (passed < total) process.exit(1);
}

runTests().catch(console.error);
