-- ================================================================
-- PTX SUMMER CUP 2026 – DATABASE SCHEMA
-- Supabase PostgreSQL Migration v1.0
-- Frozen: 31/07/2026
-- ================================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TEAMS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  short_name  TEXT,
  logo_url    TEXT,
  color       TEXT DEFAULT '#1D3557',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLAYERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS players (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  team_id     UUID REFERENCES teams(id) ON DELETE SET NULL,
  position    TEXT CHECK (position IN ('GK','CB','LB','RB','CDM','CM','CAM','LW','RW','ST','SS')),
  jersey_num  INTEGER,
  avatar_url  TEXT,
  profile     TEXT,             -- AI-generated profile
  goals       INTEGER DEFAULT 0,
  assists     INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── MATCHES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS matches (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matchday        INTEGER NOT NULL,
  home_team_id    UUID REFERENCES teams(id),
  away_team_id    UUID REFERENCES teams(id),
  home_goals      INTEGER,
  away_goals      INTEGER,
  date            DATE NOT NULL,
  time            TIME,
  venue           TEXT DEFAULT 'Sân PTX',
  status          TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','finished','postponed')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STANDINGS (View – tự tính từ matches) ──────────────────────
CREATE OR REPLACE VIEW standings AS
WITH match_points AS (
  SELECT
    home_team_id AS team_id,
    CASE WHEN home_goals > away_goals THEN 3
         WHEN home_goals = away_goals THEN 1
         ELSE 0 END AS points,
    CASE WHEN home_goals > away_goals THEN 1 ELSE 0 END AS won,
    CASE WHEN home_goals = away_goals THEN 1 ELSE 0 END AS drawn,
    CASE WHEN home_goals < away_goals THEN 1 ELSE 0 END AS lost,
    home_goals AS goals_for, away_goals AS goals_against
  FROM matches WHERE status = 'finished'
  UNION ALL
  SELECT
    away_team_id AS team_id,
    CASE WHEN away_goals > home_goals THEN 3
         WHEN away_goals = home_goals THEN 1
         ELSE 0 END AS points,
    CASE WHEN away_goals > home_goals THEN 1 ELSE 0 END AS won,
    CASE WHEN away_goals = home_goals THEN 1 ELSE 0 END AS drawn,
    CASE WHEN away_goals < home_goals THEN 1 ELSE 0 END AS lost,
    away_goals AS goals_for, home_goals AS goals_against
  FROM matches WHERE status = 'finished'
)
SELECT
  ROW_NUMBER() OVER (
    ORDER BY SUM(points) DESC,
             SUM(goals_for - goals_against) DESC,
             SUM(goals_for) DESC
  ) AS rank,
  t.id AS team_id,
  t.name AS team,
  t.logo_url,
  COUNT(*) AS played,
  SUM(won) AS won,
  SUM(drawn) AS drawn,
  SUM(lost) AS lost,
  SUM(goals_for) AS goals_for,
  SUM(goals_against) AS goals_against,
  SUM(goals_for - goals_against) AS goal_diff,
  SUM(points) AS points
FROM match_points mp
JOIN teams t ON t.id = mp.team_id
GROUP BY t.id, t.name, t.logo_url
ORDER BY SUM(points) DESC;

-- ─── NEWS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  meta_title      TEXT,
  meta_description TEXT,
  keywords        TEXT[],
  cover_image_url TEXT,
  match_id        UUID REFERENCES matches(id),
  published_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── GALLERY ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url       TEXT NOT NULL,
  description     TEXT,
  tags            TEXT[],
  match_id        UUID REFERENCES matches(id),
  team_id         UUID REFERENCES teams(id),
  uploaded_by     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUDIT TRAIL ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_trail (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action      TEXT NOT NULL,     -- INSERT, UPDATE, DELETE
  table_name  TEXT NOT NULL,
  record_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  user_id     TEXT,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_teams_updated    BEFORE UPDATE ON teams    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_players_updated  BEFORE UPDATE ON players  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_matches_updated  BEFORE UPDATE ON matches  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── INDEXES ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_date    ON matches(date);
CREATE INDEX IF NOT EXISTS idx_matches_status  ON matches(status);
CREATE INDEX IF NOT EXISTS idx_news_published  ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_match   ON gallery(match_id);
CREATE INDEX IF NOT EXISTS idx_audit_table     ON audit_trail(table_name, created_at DESC);
