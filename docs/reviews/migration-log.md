---
id: KOS-DOC-MIGRATION-LOG-001
type: KNOWLEDGE_DOCUMENT
title: PTX Summer Cup 2026 Master Data Migration Audit Log
version: 1.0.1
status: APPROVED
owner: ren-chief-architect
layer: reviews
category: audit
updatedAt: 2026-07-30
tags:
  - migration
  - audit-log
  - master-data
---

# PTX Summer Cup 2026 — Migration Audit Log

**Owner**: Ren (Data Architect & QA Lead)
**Status**: APPROVED & AUDITED
**Date**: 2026-07-30

---

## 📜 LOG LỊCH SỬ BIẾN ĐỔI DỮ LIỆU (DATA CHANGELOG)

### Version v1.0.1 (2026-07-30) — Data Reconciliation & QA Finding #001:
* **Reconciliation 3 Tên Đội Gốc**: Đã điều chỉnh tên 3 đội bóng từ tên suy diễn về đúng 100% tên gốc trên tài nguyên giải đấu: **Đội P (Team P)**, **Đội T (Team T)**, **Đội X (Team X)** (*Thuộc hệ thống nhận diện PTX Group*).
* **Phân loại Cầu Thủ**: Đã gắn nhãn `"type": "special"` cho `ToQ` (ID: `ply_009`, không in số) và `"type": "reserve"` cho `Cầu thủ Dự bị` (ID: `ply_026`).
* **Hall of Fame Metadata**: Bổ sung `"verified": true` và `"source": "PTX Summer Cup 2026 Official Result"` cho Vua dội bom **Kylian mBAppé (#9.5)**.
* **Tách Asset Manifest**: Thêm `master-data/asset-manifest.json` ánh xạ ảnh `linh vật đội P.jpg`, `linh vật đội T.jpg`, `linh vật đội X.jpg`, `Áo đấu đội P.jpg`, `áo đấu đội X.jpg`.
