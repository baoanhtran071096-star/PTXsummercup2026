---
id: SPRINT-01-RELEASE
title: Sprint 01 Release Notes — PTX Summer Cup 2.0 MVP
layer: Release Notes
category: Release Snapshot
status: Released
version: 0.1.0
owner: AI Coding Team
created: 2026-07-29
---

# PTX SUMMER CUP 2.0 — SPRINT 01 RELEASE NOTES (v0.1.0)

---

## 🌟 Added (Tính năng Mới)

* **Tournament Creation Capability**: API & Service cho phép Ban tổ chức khởi tạo giải đấu và sinh link đăng ký rút gọn.
* **Team Registration Capability**: API & Service cho phép Đội trưởng đăng ký thông tin đội & danh sách cầu thủ trên di động.
* **Team Approval Capability**: API & Service cho phép Ban tổ chức phê duyệt đội bóng.
* **PostgreSQL RPC Stored Procedures**: `fn_create_tournament`, `fn_register_team`, `fn_approve_team`.
* **Standardized Domain Events**: `TOURNAMENT_CREATED`, `REGISTRATION_OPENED`, `TEAM_REGISTERED`, `TEAM_APPROVED`.

---

## 🔧 Changed (Cải tiến)

* Tối ưu hóa Supabase Client Harness để xử lý RPCs đa luồng.
* Chuẩn hóa JWT Verification hỗ trợ phân quyền `ORGANIZER`.

---

## 🚀 Executable Verification Command

```bash
npx tsx tests/sprint1/vertical-slice-sprint1.test.ts
```
