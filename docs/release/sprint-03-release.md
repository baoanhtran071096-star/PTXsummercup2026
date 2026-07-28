---
id: SPRINT-03-RELEASE
title: Sprint 03 Release Notes — PTX Summer Cup 2.0 Live Match Console
layer: Release Notes
category: Release Candidate Snapshot
status: Release Candidate (RC1)
version: 0.3.0-rc1
owner: Release Manager Engine
created: 2026-07-29
---

# PTX SUMMER CUP 2.0 — SPRINT 03 RELEASE NOTES (v0.3.0-rc1)

---

## 🌟 Added (Tính năng Mới)

* **Event-Driven Live Match Console Capability**: Mô hình hóa 6 sự kiện nghiệp vụ trận đấu (`MATCH_STARTED`, `GOAL_SCORED`, `YELLOW_CARD_ISSUED`, `RED_CARD_ISSUED`, `PLAYER_SUBSTITUTED`, `MATCH_ENDED`).
* **Realtime Event Bus**: `MatchEventBus` đồng bộ Single Source of Truth cho Leaderboard & Match Center.
* **PostgreSQL RPC Stored Procedure**: `fn_record_match_event`.
* **Standardized API Route**: `POST /api/v1/matches/record-event`.

---

## 🔧 Changed (Cải tiến)

* Cập nhật PTX Delivery Dashboard với dữ liệu Sprint 3 (Grade A+ Performance).
* Bổ sung tài liệu `sprint-03-review.md` đầy đủ 5 Tầng Review.

---

## 🚀 Executable Verification Command (Demo Script)

```bash
npx tsx tests/sprint3/live-match-console.test.ts
```
