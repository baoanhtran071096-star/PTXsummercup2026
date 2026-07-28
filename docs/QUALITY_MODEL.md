---
id: QUAL-MODEL-001
title: PTX Platform Quality Model & Quality Gate Specifications
layer: Foundation
category: Quality Architecture
status: Approved
version: 1.0.0
owner: Knowledge Architect
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - MANIFESTO-001
  - KOS-001
related_docs:
  - ENG-NFR-001
  - KOS-LIFE-001
impacts_on:
  - PLAY-DEPLOY-001
  - TEST-MATCH-001
tags:
  - quality-model
  - definition-of-done
  - definition-of-ready
  - quality-gates
---

# PTX QUALITY MODEL
## Mô Hình Chất Lượng & Định Nghĩa Tiêu Chuẩn Phê Duyệt v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Xác lập Mô hình Chất lượng (Quality Layer), định nghĩa chính thức về **Definition of Ready (DoR)**, **Definition of Done (DoD)**, và bộ tiêu chuẩn kiểm duyệt tự động dành cho Kỹ sư và AI Reviewers.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `MANIFESTO-001` (Tuyên ngôn) và `KOS-001` (Kiến trúc KOS).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Toàn bộ quy trình kiểm thử QA, Pull Request Merge Policies, và Kịch bản Release Guides.

---

## 1. MÔ HÌNH CHẤT LƯỢNG SÁU CHỈ SỐ (SIX QUALITY ATTRIBUTES)

```
                       ┌──────────────────────────────┐
                       │  PTX QUALITY ATTRIBUTES      │
                       └──────────────┬───────────────┘
                                      │
       ┌──────────────┬───────────────┼───────────────┬──────────────┬──────────────┐
       ▼              ▼               ▼               ▼              ▼              ▼
┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐
│ FUNCTIONAL  ││ RELIABILITY ││ PERFORMANCE ││  SECURITY   ││ MAINTAIN-   ││  AI CONTEXT │
│ SUITABILITY ││ & ACCURACY  ││ & VITALS    ││ & PRIVACY   ││ ABILITY     ││ READINESS   │
└─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘
```

---

## 2. DEFINITION OF READY (DoR — TIÊU CHUẨN SẴN SÀNG SẢN XUẤT)

Một Tính năng, Module hoặc Yêu cầu Kỹ thuật chỉ được xem là **Ready for Implementation** (Sẵn sàng Lập trình) khi vượt qua các tiêu chí:

- [ ] **1. Business Clarity**: Đã có câu chuyện người dùng (User Story) và Mô tả Quy tắc Nghiệp vụ (`BUS-RULE-xxx`) rõ ràng.
- [ ] **2. Architecture Alignment**: Đã định vị chính xác vị trí trong `CAPABILITY_MODEL.md` và `STRICT_6_LAYER_ARCHITECTURE.md`.
- [ ] **3. Data Schema Specified**: Đã có định nghĩa PostgreSQL Table / View / RPC Schema tương ứng.
- [ ] **4. API Contract Signed**: Đã có định nghĩa Zod Payload Schemas và HTTP Status Codes.
- [ ] **5. NFR Defined**: Đã ghi rõ ngưỡng Performance (Latency, Web Vitals) yêu cầu.

---

## 3. DEFINITION OF DONE (DoD — TIÊU CHUẨN HOÀN THÀNH HOÀN HẢO)

Một Mã nguồn Pull Request chỉ được phép **Merge & Deploy** khi vượt qua các tiêu chí nghiêm ngặt:

- [ ] **1. Code Quality**: Mã nguồn TypeScript 100% strict mode, không có cảnh báo linter, không `any` ngầm định.
- [ ] **2. Test Coverage**: Đã viết Unit Tests / Integration Tests và tất cả tests chạy thành công (`exit code = 0`).
- [ ] **3. Security Audit**: RLS Policies bọc JWT Tenant Claim đã được xác minh.
- [ ] **4. NFR Verified**: Thời gian phản hồi API và render UI đạt chỉ số trong `ENG-NFR-001`.
- [ ] **5. Documentation Updated**: Đã cập nhật tài liệu tri thức trong `docs/` đồng thời trong cùng Pull Request.
- [ ] **6. Dual Review Approved**: Đã được ký duyệt bởi 1 Senior Human Engineer và 1 Review AI Agent.

---

## 4. CHECKLIST KIỂM DUYỆT DÀNH CHO AI REVIEW AGENT (AI REVIEW STANDARDS)

Khi **Review AI** tham gia kiểm duyệt Pull Request, AI bắt buộc phải chạy checklist 5 bước:

1. **Schema Integrity Check**: Kiểm tra xem PR có làm phá vỡ Database Schema v1.0.7 hay không.
2. **Layering Rule Violation**: Kiểm tra xem UI Component có gọi trực tiếp SQL Database mà không qua Service/Repo Layer hay không.
3. **Zod Validation Verification**: Kiểm tra xem 100% input parameters từ Client đã qua Zod Validator chưa.
4. **Symptom Patching Audit**: Đảm bảo không có đoạn code `try/catch` rỗng nuốt lỗi hay xóa bỏ assertion test.
5. **Metadata Update Verification**: Đảm bảo mọi file `.md` sửa đổi đều đã được nâng cấp trường `version` và `updated` date.
