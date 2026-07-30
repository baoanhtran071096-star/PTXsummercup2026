// ================================================================
// PTX DATA PLATFORM API
// REST endpoints cho Website & Admin Panel.
// Chạy bằng: node --import tsx/esm api/server.ts (hoặc tsx)
// ================================================================

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { dbService } from '../supabase/db.service';
import { AIOrchestrator } from '../../ai-core/orchestrator/orchestrator';

const orchestrator = new AIOrchestrator();
const PORT = parseInt(process.env.API_PORT ?? '8001', 10);

// ─── HELPERS ────────────────────────────────────────────────────

function json(res: ServerResponse, data: unknown, status = 200): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

async function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
  });
}

// ─── ROUTER ─────────────────────────────────────────────────────

async function router(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = req.url ?? '/';
  const method = req.method ?? 'GET';

  // CORS preflight
  if (method === 'OPTIONS') { json(res, {}); return; }

  try {
    // ── Health ──────────────────────────────────────────────────
    if (url === '/health' && method === 'GET') {
      json(res, { status: 'ok', version: '1.2.0', time: new Date().toISOString() });
      return;
    }

    // ── Teams ───────────────────────────────────────────────────
    if (url === '/api/teams' && method === 'GET') {
      const teams = await dbService.getTeams();
      json(res, { data: teams, count: teams.length });
      return;
    }

    if (url === '/api/teams' && method === 'POST') {
      const body = await readBody(req);
      const team = await dbService.createTeam(body as never);
      json(res, { data: team }, 201);
      return;
    }

    // ── Players ─────────────────────────────────────────────────
    if (url.startsWith('/api/players') && method === 'GET') {
      const teamId = new URL(url, 'http://x').searchParams.get('team_id') ?? undefined;
      const players = await dbService.getPlayers(teamId);
      json(res, { data: players, count: players.length });
      return;
    }

    if (url === '/api/players/top-scorers' && method === 'GET') {
      const scorers = await dbService.getTopScorers(10);
      json(res, { data: scorers });
      return;
    }

    // ── Matches ─────────────────────────────────────────────────
    if (url.startsWith('/api/matches') && method === 'GET') {
      const status = new URL(url, 'http://x').searchParams.get('status') as 'finished' | 'scheduled' | undefined;
      const matches = await dbService.getMatches(status);
      json(res, { data: matches, count: matches.length });
      return;
    }

    // ── Standings ────────────────────────────────────────────────
    if (url === '/api/standings' && method === 'GET') {
      const standings = await dbService.getStandings();
      json(res, { data: standings });
      return;
    }

    // ── News ─────────────────────────────────────────────────────
    if (url === '/api/news' && method === 'GET') {
      const news = await dbService.getNews(20);
      json(res, { data: news, count: news.length });
      return;
    }

    // ── Gallery ──────────────────────────────────────────────────
    if (url === '/api/gallery' && method === 'GET') {
      const gallery = await dbService.getGallery(undefined, 50);
      json(res, { data: gallery, count: gallery.length });
      return;
    }

    // ── AI Chat ──────────────────────────────────────────────────
    if (url === '/api/ai/chat' && method === 'POST') {
      const body = await readBody(req);
      const result = await orchestrator.process({
        type: 'chat',
        payload: {
          message: body.message as string,
          sessionId: body.sessionId as string ?? `session_${Date.now()}`,
          userId: body.userId as string,
        },
      });
      json(res, result);
      return;
    }

    // ── AI Match Result (Workflow) ────────────────────────────────
    if (url === '/api/ai/match-result' && method === 'POST') {
      const body = await readBody(req);
      const result = await orchestrator.process({
        type: 'match-result',
        payload: body,
      });
      json(res, result);
      return;
    }

    // ── AI Upload Image (Workflow) ────────────────────────────────
    if (url === '/api/ai/upload-image' && method === 'POST') {
      const body = await readBody(req);
      const result = await orchestrator.process({
        type: 'upload-image',
        payload: body,
      });
      json(res, result);
      return;
    }

    // 404
    json(res, { error: `Route not found: ${method} ${url}` }, 404);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[API] Error:', message);
    json(res, { error: message }, 500);
  }
}

// ─── SERVER ─────────────────────────────────────────────────────

const server = createServer(router);

server.listen(PORT, () => {
  console.log(`\n🚀 PTX API Server running at http://localhost:${PORT}`);
  console.log('   Endpoints:');
  console.log('   GET  /health');
  console.log('   GET  /api/teams');
  console.log('   GET  /api/players');
  console.log('   GET  /api/matches');
  console.log('   GET  /api/standings');
  console.log('   GET  /api/news');
  console.log('   GET  /api/gallery');
  console.log('   POST /api/ai/chat');
  console.log('   POST /api/ai/match-result');
  console.log('   POST /api/ai/upload-image\n');
});

export { server };
