---
id: DB-SCHEMA-001
title: Supabase PostgreSQL Schema v1.0.7 Frozen & DDD Aggregates Spec
layer: Engineering
category: Database Spec
status: Approved
version: 1.0.7
owner: Lead Database Engineer
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - ENG-ARCH-001
  - DOMAIN-001
  - ADR-001
related_docs:
  - PROD-MATCH-001
  - PROD-TOURN-001
  - PROD-PLAY-001
impacts_on:
  - API-SPEC-001
ai_context:
  ai_summary: "Đặc tả Database Schema v1.0.7 FROZEN thiết kế theo chuẩn DDD Domain Persistence, bao gồm Aggregates Root, Tables, Views, RLS Policies và RPC Functions."
  key_entities: ["organizations", "seasons", "teams", "players", "matches", "match_events", "dam_assets", "audit_logs"]
  business_terms: ["DDD Aggregate Persistence", "Atomic RPC", "Immutable Audit Log", "RLS Policy"]
  breaking_changes: ["Schema v1.0.7 đã FROZEN, mọi thay đổi phải qua Migration DDL và ADR"]
  implementation_notes: "fn_add_goal thực thi trong 1 DB Transaction duy nhất."
  review_checklist: ["RLS Multi-tenant Audit", "RPC Atomic Transaction Check", "Index Coverage Audit"]
tags:
  - database-schema
  - postgresql
  - rpc-functions
  - ddd-aggregates
  - v1.0.7-frozen
---

# SUPABASE POSTGRESQL SCHEMA V1.0.7 (FROZEN)

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Mô tả toàn bộ Cơ sở Dữ liệu Supabase PostgreSQL v1.0.7 đóng băng (FROZEN) thiết kế chuẩn **DDD Domain Persistence** (Aggregate Roots, Entities, Value Objects, RLS Policies, và RPC Functions).
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `ENG-ARCH-001` (Kiến trúc Master), `DOMAIN-001` (Domain Model), và `ADR-001` (PostgreSQL RPC Atomicity).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Toàn bộ API Route Handlers, Repositories Layer và các Migration Scripts SQL.

---

## 1. DDD AGGREGATE PERSISTENCE MAPPING (BẢN ĐỒ AGGREGATES)

### Aggregate 1: Tournament & Season Aggregate
* **Aggregate Root**: `seasons` (Entity).
* **Entities**: `divisions`.
* **Value Objects**: `season_year`, `format_type`.
* **Transaction Boundary**: Khi đóng Mùa giải (`COMPLETED`), toàn bộ các trận đấu con thuộc Mùa giải phải ở trạng thái kết thúc.

### Aggregate 2: Match Aggregate
* **Aggregate Root**: `matches` (Entity).
* **Entities**: `match_events` (Goals, Cards, Substitutions).
* **Value Objects**: `Score` (home_score, away_score), `MatchClock` (minute, period).
* **Transaction Boundary**: RPC `fn_add_goal()` thực thi trong 1 DB Transaction duy nhất (Ghi `match_events` ➔ Cập nhật `matches.home_score` ➔ Kích hoạt `v_standings`).

---

## 2. DANH SÁCH BẢNG CỐT LÕI (CORE TABLES SPECIFICATION)

1. `organizations`: `id` (UUID, PK), `name`, `slug`, `logo_url`, `created_at`.
2. `seasons`: `id` (UUID, PK), `org_id` (FK), `name`, `year`, `is_active`.
3. `teams`: `id` (UUID, PK), `season_id` (FK), `name`, `full_name`, `icon`, `color_primary`, `stats_json`.
4. `players`: `id` (UUID, PK), `team_id` (FK), `name`, `shirt_number`, `position`, `goals`, `assists`, `mvp`.
5. `matches`: `id` (UUID, PK), `season_id` (FK), `home_team_id` (FK), `away_team_id` (FK), `home_score`, `away_score`, `status`, `scheduled_at`.
6. `match_events`: `id` (UUID, PK), `match_id` (FK), `event_type`, `player_id` (FK), `minute`, `details_json`.
7. `dam_assets`: `id` (UUID, PK), `url`, `blurhash`, `ai_tags`, `caption`.
8. `audit_logs`: `id` (UUID, PK), `user_id`, `action`, `entity`, `details_json`, `timestamp` (**Immutable: Block UPDATE/DELETE**).

---

## 3. STORED PROCEDURES & VIEWS (RPC & VIEWS)

* **RPC `fn_add_goal(...)`**: Hàm ghi nhận bàn thắng Atomic RPC bọc DB Transaction duy nhất (`ADR-001`).
* **View `v_standings`**: View tự động tính toán Bảng xếp hạng tức thì theo `RULE-001` & `RULE-002`.
