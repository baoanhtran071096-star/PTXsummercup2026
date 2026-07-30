# CHANGELOG

All notable changes to the PTX Platform project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v3.0.1] - 2026-07-31 — HOTFIX SPLASH SCREEN BLOCKER 🔴
### Fixed
- **Root Cause Fix (Product A):** Replaced synchronous blocking `prompt()` calls in `initAdminAccount()` with automatic non-blocking default hash initialization (`admin` / `admin123`).
- Unblocked main UI rendering thread during initial page load when `localStorage` is empty.
- Restored standard application initialization promise chain (`initAdminAccount().then(...)`) for clean `#splash-screen` dismissal.

---

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
