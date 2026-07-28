---
id: ENG-ARCH-001
title: PTX Platform Master Engineering Architecture Specification
layer: Engineering
category: Architecture Spec
status: Approved
version: 1.0.0
owner: Chief Software Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - PRINCIPLE-001
  - BUS-CAP-001
  - PROD-MATCH-001
related_docs:
  - DB-SCHEMA-001
  - API-SPEC-001
  - ADR-001
impacts_on:
  - DB-SCHEMA-001
  - API-SPEC-001
ai_context:
  ai_summary: "Đặc tả Kiến trúc Kỹ thuật Master mô tả 4 Tầng Hạ tầng và Mô hình Backend Strict 6-Layer Architecture Pattern."
  key_entities: ["FourLayerFramework", "Strict6LayerArchitecture", "DomainService", "RepositoryBoundary"]
  business_terms: ["Strict 6-Layer", "Hexagonal Architecture", "ADT Traceability"]
  breaking_changes: ["Nghiêm cấm UI Component truy vấn trực tiếp DB ngoài Repository Layer"]
  implementation_notes: "Tuân thủ mô hình 6 lớp: API Route ➔ Zod ➔ Auth ➔ Service ➔ Repo ➔ DB RPC."
  review_checklist: ["Strict 6-Layer Audit", "ADT Traceability Check", "Dependency Direction Verification"]
tags:
  - engineering-architecture
  - strict-6-layer
  - four-layer-framework
  - adt-traceability
---

# PTX MASTER ENGINEERING ARCHITECTURE

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa toàn bộ Mô hình Kiến trúc Kỹ thuật 4 Tầng (`Four-Layer Framework`) và Mô hình Backend 6 Lớp Nghiêm ngặt (`Strict 6-Layer Architecture Pattern`). Đảm bảo tính phân tách trách nhiệm (Separation of Concerns) và khả năng bảo trì bền vững.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `PRINCIPLE-001` (Engineering Principles), `BUS-CAP-001` (Capability Model) và các Product Modules (`PROD-xxx`).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Toàn bộ cấu trúc folder dự án Next.js 14 App Router, các file Services, Repositories, Supabase Clients và API Routes.

---

## 1. KHUNG KIẾN TRÚC BỐN TẦNG (FOUR-LAYER FRAMEWORK)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. APPLICATION LAYER                                                        │
│    • Match App  • Team App  • Standings App  • Media App  • Admin Console   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. PLATFORM LAYER                                                           │
│    • Realtime Broadcast (SSE/WS)  • Push Notification  • Gemini AI Engine     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. INFRASTRUCTURE LAYER                                                     │
│    • Supabase PostgreSQL DB  • Edge CDN  • Auth Policies  • DAM Storage     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. ARCHITECTURE LAYER                                                       │
│    • Strict 6-Layer Pattern  • DDD Aggregates  • Event Outbox  • ADT Trace   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. MÔ HÌNH BACKEND SÁU LỚP NGHIÊM NGẶT (STRICT 6-LAYER PATTERN)

Mọi luồng xử lý dữ liệu Backend bắt buộc tuân thủ đúng 6 lớp theo 1 chiều suy nhất:

```
[1. API Route] ──> [2. Zod Validation] ──> [3. Auth Policy] ──> [4. Service Layer] ──> [5. Repository Layer] ──> [6. Supabase RPC / DB]
```

1. **Layer 1: API Route**: Nhận HTTP Requests từ Next.js 14 App Router `/app/api/v1/...`.
2. **Layer 2: Zod Validation**: Xác thực cấu trúc dữ liệu đầu vào dựa trên Contract Schemas (`ENG-CON-001`).
3. **Layer 3: Auth Policy**: Kiểm tra Token xịn, JWT Custom Claims `org_id` và quyền RBAC.
4. **Layer 4: Service Layer**: Xử lý logic nghiệp vụ, điều phối các Repositories và gọi Event Broadcast.
5. **Layer 5: Repository Layer**: Thực hiện các truy vấn dữ liệu thuần túy tới Database Client.
6. **Layer 6: Supabase PostgreSQL RPC**: Thực thi các giao dịch tính toán phức tạp Atomic trực tiếp trong Database (`ADR-001`).

---

## 3. CHUỖI TRUY VẾT QUYẾT ĐỊNH KIẾN TRÚC (ADT TRACEABILITY)

```
[BUS-RULE-001] ──> [ADR-001] ──> [ENG-ARCH-001] ──> [DB-SCHEMA-001] ──> [API-SPEC-001] ──> [Implementation] ──> [Integration Tests]
```
