---
id: SPRINT-04-RELEASE
title: Sprint 04 Release Notes — Capability Integration: Player & Team Experience
layer: Release Notes
category: Release Candidate Snapshot
status: Release Candidate (RC1)
version: 0.4.0-rc1
owner: Release Manager Engine
created: 2026-07-29
---

# PTX SUMMER CUP 2.0 — SPRINT 04 RELEASE NOTES (v0.4.0-rc1)

---

## 🌟 Added (Tính năng Mới)

* **Capability Integration**: Tích hợp xuyên suốt Enterprise DAM v1.2 vào Hồ sơ Cầu thủ (`PlayerApplicationService`) và Hồ sơ Đội bóng (`TeamApplicationService`).
* **Dynamic Asset Resolution**: Tự động chuyển đổi `avatarAssetId` và `logoAssetId` thành CDN WebP URLs sắc nét thông qua `AssetResolver`.
* **Architecture Freeze Compliance**: Đảm bảo 100% không rò rỉ URL chuỗi thô trong Business Entities.

---

## 🚀 Executable Verification Command (Demo Integration Script)

```bash
npx tsx tests/sprint4/capability-integration-player-team.test.ts
```
