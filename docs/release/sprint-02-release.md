---
id: SPRINT-02-RELEASE
title: Sprint 02 Release Notes — PTX Summer Cup 2.0 Scheduling Engine
layer: Release Notes
category: Release Candidate Snapshot
status: Release Candidate (RC1)
version: 0.2.0-rc1
owner: Release Manager Engine
created: 2026-07-29
---

# PTX SUMMER CUP 2.0 — SPRINT 02 RELEASE NOTES (v0.2.0-rc1)

---

## 🌟 Added (Tính năng Mới)

* **Scheduling Engine Capability**: Thuật toán tự động sinh trận đấu và vòng đấu theo thể thức Vòng tròn (Round Robin Match Matrix Generator).
* **Conflict Detection Engine**: Bộ kiểm tra xung đột sân đấu (Pitch Conflict Check) & xung đột giờ đấu (Time Slot Conflict Check).
* **PostgreSQL RPC Stored Procedure**: `fn_generate_tournament_schedule`.
* **Standardized API Route**: `POST /api/v1/tournaments/generate-schedule`.

---

## 🔧 Changed (Cải tiến)

* Cập nhật PTX Delivery Dashboard với dữ liệu Sprint 2 (Grade A+ Performance).
* Thêm tài liệu `sprint-02-review.md` đầy đủ 5 Tầng Review.

---

## 🚀 Executable Verification Command (Demo Script)

```bash
npx tsx tests/sprint2/scheduling-engine.test.ts
```
