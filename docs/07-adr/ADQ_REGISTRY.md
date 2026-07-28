---
id: ADQ-REG-006
title: GITHUB PR PRE-MERGE REVIEW & RELEASE MANAGER GOVERNANCE
layer: Governance
category: Release Architecture
status: Approved & Frozen
version: 3.1.0
owner: Ren (Chief Product & Architecture Officer)
reviewer: Product Owner & Release Manager
created: 2026-07-29
updated: 2026-07-29
---

# GITHUB PR PRE-MERGE REVIEW & RELEASE MANAGER GOVERNANCE
## Khung Kiểm Soát Chất Lượng Phát Hành & Quy Trình Review PR 4 Vai Trò v3.1.0

---

## 1. QUY TRÌNH HỢP NHẤT MÃ NGUỒN (PRE-MERGE REVIEW FLOW)

```text
AI CODING TEAM  ──>  GITHUB PR & DIFFS  ──>  SPRINT REVIEW DOCS  ──>  REN REVIEW  ──>  RELEASE MANAGER AUDIT  ──>  MERGE MAIN
```

> [!IMPORTANT]
> **"KHÔNG MERGE PR TRƯỚC KHI CHIEF ARCHITECTURE REN REVIEW & PHÊ DUYỆT HOÀN TẤT!"**

---

## 2. MA TRẬN 4 VAI TRÒ ĐIỀU HÀNH TỔ CHỨC (4-ROLE GOVERNANCE MATRIX)

1. 🎯 **Product Owner (User)**: Tầm nhìn sản phẩm, Quyết định kinh doanh & Phê duyệt chiến lược.
2. 🧠 **Chief Product & Architecture Officer (Ren)**: Review Kiến trúc, Product & UX; Phê duyệt/Request Changes trên PR trước khi Merge.
3. 🛡️ **Release Manager (Codex Governance Engine)**: Soạn Release Notes, Kiểm tra Sprint Review, Thẩm định Dashboard & Kiểm soát tiêu chí DoD trước khi cho phép Merge.
4. ⚡ **AI Coding Team (Claude, Gemini, DeepSeek)**: Phát triển mã nguồn theo lát cắt dọc (Vertical Slices), tạo PR Diffs & Test Suites.

---

## 3. RELEASE MANAGER CHECKLIST BEFORE MERGE

- [x] **Sprint Review Document**: `docs/reviews/sprint-XX-review.md` đầy đủ 5 Tầng Review.
- [x] **Release Notes Snapshot**: `docs/release/sprint-XX-release.md` cập nhật chi tiết Added/Changed/Removed.
- [x] **Delivery Dashboard Update**: `docs/reviews/PTX_DELIVERY_DASHBOARD.md` cập nhật chỉ số Kỹ thuật & UX Real User.
- [x] **Definition of Done (DoD)**: Đạt đủ 5/5 tiêu chí (`Architecture`, `Impl`, `Evidence`, `UX Benchmark`, `User Value`).
