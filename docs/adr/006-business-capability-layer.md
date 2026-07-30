# ADR-006: Business Capability Layer

**Date:** 2026-07-31  
**Status:** Accepted

## Context
AI Engine đang gọi trực tiếp dbService (Data Platform). Điều này tạo coupling chặt giữa AI và DB.

## Decision
Tạo Business Capability Layer: Tất cả AI Engines phải đi qua Business Services (TournamentService, MatchService, PlayerService...) thay vì gọi DB trực tiếp.

## Consequences
- (✓) AI không biết DB là Supabase hay MongoDB
- (✓) Business logic tập trung
- (✓) Dễ test (mock service)
- (✓) Dễ mở rộng sang giải đấu khác
- (✓) Đúng với Clean Architecture
