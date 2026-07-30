# PTX Platform Business Data Contract v1.0

**Date:** 2026-08-01  
**Status:** Approved & Active  
**Author:** Backend & Data Governance Team  
**Target:** Product A (Public Consumer / Read-Only) & Product B (Management / Full Access)

---

## 1. Governance & Security Rules

1. **SERVICE_ROLE_KEY Restriction:**
   - `SERVICE_ROLE_KEY` is strictly reserved for Backend services (Node.js API, Supabase Edge Functions).
   - `SERVICE_ROLE_KEY` must NEVER be exposed in any browser client bundle, HTML file, or public repo commit.
2. **ANON_KEY Scope:**
   - Client applications (Product A and Product B frontend) interact with Supabase using `ANON_KEY`.
   - Row Level Security (RLS) ensures `ANON_KEY` can only READ Public Tables and CANNOT WRITE or READ Internal Tables.
3. **Schema Change Management:**
   - Any schema changes must be updated in this Data Contract document before applying to PostgreSQL.
   - All migrations belong strictly to Backend Ownership (`data-platform/supabase/migrations/`).

---

## 2. Table Classification Matrix

### 🟢 Public Tables (Product A Read-Only & Product B Read/Write)
Product A is authorized to read these tables directly via `ANON_KEY` or REST API endpoints.

| Table Name | Description | Key Primary Columns | Access Control (ANON_KEY) |
|---|---|---|---|
| `teams` | Listing of participating teams | `id`, `name`, `short_name`, `logo_url`, `color` | `SELECT` allowed |
| `players` | Registered players & performance stats | `id`, `name`, `team_id`, `position`, `jersey_num`, `goals`, `assists`, `yellow_cards`, `red_cards` | `SELECT` allowed |
| `matches` | Tournament schedule and match scores | `id`, `matchday`, `home_team_id`, `away_team_id`, `home_goals`, `away_goals`, `status`, `date`, `time`, `venue` | `SELECT` allowed |
| `news` | Tournament news & media articles | `id`, `title`, `content`, `created_at` | `SELECT` allowed |
| `gallery` | Photo & media gallery items | `id`, `title`, `url`, `match_id`, `created_at` | `SELECT` allowed |
| `hall_of_fame` | Historic tournament honorees | `id`, `year`, `category`, `winner_name`, `details` | `SELECT` allowed |
| `sponsors` | Official sponsors & partners | `id`, `name`, `logo_url`, `tier` | `SELECT` allowed |

#### 📊 Public Views
- **`standings`**: Calculated view aggregating `played`, `won`, `drawn`, `lost`, `goals_for`, `goals_against`, `goal_diff`, and `points` per team ordered by `rank`.

---

### 🔴 Internal Tables (Product A NO ACCESS — Product B Backend Only)
Product A (and public `ANON_KEY`) is strictly BLOCKED by RLS from reading or writing these tables.

| Table Name | Purpose | Authorized Role |
|---|---|---|
| `audit_trail` | Operational & admin mutation audit logs | `service_role` only |
| `admin_users` | Admin authentication & credentials | `service_role` only |
| `internal_logs` | System execution & stack traces | `service_role` only |
| `ai_logs` | AI Core prompt & token usage logs | `service_role` only |
| `system_config` | Core platform & environment configs | `service_role` only |
| `migrations` | Database schema migration history | `service_role` only |
| `feature_flags` | Experimental feature toggles | `service_role` only |

---

## 3. Schema Contracts & Data Types

### 3.1 `teams`
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  short_name TEXT NOT NULL,
  logo_url TEXT,
  color TEXT DEFAULT '#00ff9d',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.2 `players`
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  position TEXT DEFAULT 'FW',
  jersey_num INT CHECK (jersey_num >= 0),
  goals INT DEFAULT 0 CHECK (goals >= 0),
  assists INT DEFAULT 0 CHECK (assists >= 0),
  yellow_cards INT DEFAULT 0 CHECK (yellow_cards >= 0),
  red_cards INT DEFAULT 0 CHECK (red_cards >= 0),
  profile TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.3 `matches`
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matchday INT NOT NULL,
  home_team_id UUID REFERENCES teams(id),
  away_team_id UUID REFERENCES teams(id),
  home_goals INT DEFAULT NULL,
  away_goals INT DEFAULT NULL,
  status TEXT CHECK (status IN ('scheduled', 'live', 'finished', 'postponed')) DEFAULT 'scheduled',
  date DATE NOT NULL,
  time TIME,
  venue TEXT DEFAULT 'Sân Complex PTX',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Contract Version History

| Version | Date | Description | Author |
|---|---|---|---|
| `v1.0` | 2026-08-01 | Initial Business Data Contract release for PTX Platform v3.0.0 | Backend & Data Governance |
