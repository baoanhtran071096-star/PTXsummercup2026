-- ================================================================
-- PTX SUMMER CUP 2026 – ROW LEVEL SECURITY (RLS) POLICIES
-- Phân loại Public vs Internal Tables & Khóa quyền GHI đối với ANON_KEY
-- ================================================================

-- ─── 1. PUBLIC TABLES RLS ───────────────────────────────────────

-- TEAMS
ALTER TABLE IF EXISTS teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read teams" ON teams;
CREATE POLICY "Public read teams" ON teams FOR SELECT TO anon, authenticated USING (true);

-- PLAYERS
ALTER TABLE IF EXISTS players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read players" ON players;
CREATE POLICY "Public read players" ON players FOR SELECT TO anon, authenticated USING (true);

-- MATCHES
ALTER TABLE IF EXISTS matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read matches" ON matches;
CREATE POLICY "Public read matches" ON matches FOR SELECT TO anon, authenticated USING (true);

-- NEWS
ALTER TABLE IF EXISTS news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read news" ON news;
CREATE POLICY "Public read news" ON news FOR SELECT TO anon, authenticated USING (true);

-- GALLERY (If exists)
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read gallery" ON gallery;
CREATE POLICY "Public read gallery" ON gallery FOR SELECT TO anon, authenticated USING (true);

-- ─── 2. INTERNAL TABLES RLS ─────────────────────────────────────

-- AUDIT TRAIL
CREATE TABLE IF NOT EXISTS audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  performed_by TEXT DEFAULT 'system',
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
-- No policy for anon/authenticated = BLOCKED for anon!

-- ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- No policy for anon/authenticated = BLOCKED for anon!

-- INTERNAL LOGS
CREATE TABLE IF NOT EXISTS internal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE internal_logs ENABLE ROW LEVEL SECURITY;

-- AI LOGS
CREATE TABLE IF NOT EXISTS ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  response TEXT,
  tokens INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- SYSTEM CONFIG
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
