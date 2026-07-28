---
id: ARCH-LOG-001
title: PTX Architecture Decision Log
layer: Governance
category: Architectural History
status: Active
version: 1.0.0
owner: Ren (Chief Product & Architecture Officer)
reviewer: Product Owner
created: 2026-07-29
updated: 2026-07-29
---

# PTX ARCHITECTURE DECISION LOG

| ID | Quyết Định (Decision) | Lý Do (Reason) | Phương Án Thay Thế (Alternative) | Đánh Đổi (Trade-off) | Owner | Ngày |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ADL-001** | Database-First via Supabase Stored Procedures (RPCs) | Đảm bảo tính toàn vẹn dữ liệu và cách ly hoàn toàn business logic khỏi UI Layer | Viết logic trong Next.js API route handlers | Cần duy trì các tệp SQL migration / harness | Ren & Claude | 2026-07-29 |
| **ADL-002** | 5-Tier Review System & Multi-Sprint Delivery Dashboard | Thay thế file ZIP đồ sộ, tăng 5x tốc độ review và minh bạch hóa số liệu | Gửi ZIP archive đồ sộ sau mỗi Sprint | Cần duy trì các tệp Markdown trong `docs/reviews/` | Ren | 2026-07-29 |
| **ADL-003** | Standardized Domain Events (`TOURNAMENT_CREATED`, `TEAM_APPROVED`) | Chuẩn hóa cho Event Bus, Notification Engine và Audit Log sau này | Gọi trực tiếp API nội bộ | Tăng nhẹ số lượng event payload types | Claude | 2026-07-29 |
