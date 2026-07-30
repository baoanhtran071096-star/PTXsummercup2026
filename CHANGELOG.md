# CHANGELOG

All notable changes to the PTX Platform project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v3.0.0] - 2026-07-31 — ARCHITECTURE FREEZE 🏛️
### Added
- **Business Capability Layer:** `backend/capabilities/` (`TournamentService` facade, `MatchService`, `TeamService`, `PlayerService`, `StandingService`, `NewsService`, `GalleryService`, `HofService`).
- **AI Safety Layer:** `ai-core/safety/` (Prompt Injection Check, Sensitive Data Filter, Output Redaction).
- **Tool Registry:** `ai-core/tools/` (`ToolRegistry`, `schedule`, `standings`, `players`, `news` tools).
- **AI Chat Engine v2:** Updated flow (`Chat` → `Safety` → `Context` → `Tools` → `Gemini` → `Business Services` → `Supabase`).
- **Versioned Prompts:** `ai-core/prompts/` (Chat `v1.md`, News `v1.md`, Vision `v1.md`).
- **Shared SDK:** `@ptx/sdk` in `packages/sdk/` (Logger, Config, Date Utils, Types).
- **Architecture Decision Records:** `docs/adr/001` - `007`.
- **Operational Framework:** `docs/rollback-plan.md`, `docs/smoke-test-checklist.md`, `docs/success-metrics.md`.
- **Real Supabase Database:** Connected live project `wmamuqylqqikvseuqerm.supabase.co` with 8 teams, 13 players, 8 matches, and dynamic standings view.

### Changed
- Refactored project architecture to Domain-Centric Clean Architecture.
- Freeze architecture from further major additions until post-launch.

---

## [v2.0.0] - 2026-07-30
### Added
- Supabase Integration v2 & Migration Runner.
- Admin Panel authentication system.
- REST API Server (`data-platform/api/server.ts`).

---

## [v1.0.0] - 2026-07-29
### Added
- Initial PTX Summer Cup 2026 Single Page Application.
- Static Standings, Schedule, Teams, and Players presentation.
