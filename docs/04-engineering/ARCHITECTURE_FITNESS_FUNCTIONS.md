---
id: ENG-FIT-001
title: PTX Architecture Fitness Functions & Automated CI Rules
layer: Quality
category: Architecture Fitness
status: Approved
version: 1.0.0
owner: Chief Software Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - ENG-ARCH-001
  - QUAL-MODEL-001
  - KOS-001
related_docs:
  - DB-SCHEMA-001
  - API-SPEC-001
impacts_on: []
ai_context:
  ai_summary: "Đặc tả các Hàm kiểm thử tự động Kiến trúc (CI Fitness Functions) kiểm tra vi phạm kiến trúc 6-Layer, RLS, Metadata, và Zod Validation trong mỗi Pull Request."
  key_entities: ["FitnessFunction", "CiRule", "ArchitectureLinter"]
  business_terms: ["Architecture Fitness Functions", "CI/CD Linter", "Layer Boundary Audit", "Enterprise Level 2"]
  breaking_changes: ["PR bị tự động Block nếu vi phạm bất kỳ Fitness Function nào trong 5 quy tắc chính"]
  implementation_notes: "Fitness Functions được thực thi qua npm run docs:verify và CI pipeline."
  review_checklist: ["CI Pipeline Rule Enforcement", "Layer Boundary Linter Check", "Metadata Integrity Audit"]
tags:
  - architecture-fitness-functions
  - ci-cd-rules
  - automated-verification
  - enterprise-level-2
---

# PTX ARCHITECTURE FITNESS FUNCTIONS

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Thiết lập bộ **Hàm kiểm thử tự động Kiến trúc (Architecture Fitness Functions)** đưa PTX Foundation đạt chuẩn **Enterprise Grade – Level 2 Maturity**. Bộ Fitness Functions này tự động ngăn chặn các vi phạm kiến trúc (Architecture Erosion) ngay ở luồng CI/CD Pipeline trước khi mã nguồn được phép Merge.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `ENG-ARCH-001` (Kiến trúc Master), `QUAL-MODEL-001` (Quality Model), và `KOS-001` (KOS Blueprint).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Tệp cấu hình CI/CD (`.github/workflows/`), Custom Linters, và Quy trình Merge Pull Request.

---

## 1. NĂM QUY TẮC FITNESS FUNCTIONS CỐT LÕI (FIVE CORE FITNESS FUNCTIONS)

### FIT-001: Strict Layering Boundary Check (Kiểm tra Ranh giới 6 Lớp)
* **Quy tắc**: Không một UI Component nào (`/components` hoặc `/app`) được phép gọi trực tiếp câu lệnh SQL DatabaseClient hoặc Supabase Query mà không đi qua Service / Repository Layer.
* **Cơ chế tự động**: Static AST Linter quét import statements trong PR.

### FIT-002: Mandatory Zod Validation Check (Kiểm tra Zod Validation API)
* **Quy tắc**: 100% Next.js 14 API Route Handlers (`/app/api/...`) bắt buộc phải bọc payload bằng Zod Validation Schema trước khi xử lý logic.
* **Cơ chế tự động**: Linter quét mã nguồn API Route tìm `Zod.parse()` hoặc `Zod.safeParse()`.

### FIT-003: ADR Linkage Enforcement (Bắt buộc Liên kết ADR cho DB RPC)
* **Quy tắc**: Mọi hàm RPC PostgreSQL mới trong `supabase/migrations/` bắt buộc phải có ít nhất 1 file ADR tương ứng thuộc `docs/07-adr/` khai báo trong phần comments.

### FIT-004: Zero Business Rule Duplication (Chống Lặp Quy tắc Nghiệp vụ)
* **Quy tắc**: Một Business Rule (`BUS-RULE-xxx`) chỉ được phép định nghĩa chính thức tại 1 file duy nhất. Không được phép copy-paste lại quy tắc ở nhiều file tài liệu khác nhau.

### FIT-005: Knowledge Object Metadata & AI Context Verification
* **Quy tắc**: 100% các file Markdown trong `docs/` bắt buộc phải chứa YAML Frontmatter với đầy đủ trường thông tin bắt buộc và khối `ai_context` hợp lệ.
