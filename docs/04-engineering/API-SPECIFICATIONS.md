---
id: API-SPEC-001
title: PTX Platform Master API Contract & Endpoint Specifications
layer: Engineering
category: API Spec
status: Approved
version: 1.0.0
owner: Lead Backend Engineer
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - ENG-ARCH-001
  - DB-SCHEMA-001
  - ENG-CON-001
related_docs:
  - PROD-MATCH-001
  - PROD-TOURN-001
  - PROD-PLAY-001
impacts_on: []
ai_context:
  ai_summary: "Đặc tả API Master quy định danh mục RESTful HTTP Endpoints, WebSockets SSE Broadcast Channels và Zod Validation Contracts."
  key_entities: ["ApiEndpoints", "ResponseEnvelope", "ZodContracts"]
  business_terms: ["Master API Spec", "RESTful Endpoints", "Response Envelope", "Zod Validation"]
  breaking_changes: ["Tất cả API Endpoints bắt buộc gói trong Response Envelope chuẩn ENG-CON-001"]
  implementation_notes: "Headers bắt buộc chứa Authorization Bearer Token."
  review_checklist: ["Response Envelope Compliance", "Zod Schema Audit", "HTTP Status Codes Check"]
tags:
  - api-specifications
  - endpoints
  - zod-contracts
  - response-envelope
---

# PTX MASTER API SPECIFICATIONS

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa toàn bộ Danh mục API Endpoints, HTTP Methods, Zod Schemas và Kênh phát sóng Realtime Broadcast Channels áp dụng thống nhất trên hệ thống PTX Platform.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `ENG-ARCH-001` (Kiến trúc Master), `DB-SCHEMA-001` (Database Schema), và `ENG-CON-001` (Contract Standards).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Tất cả Client Fetchers, React Query Hooks, và API Route Handlers.

---

## 1. DANH MỤC API ENDPOINTS CỐT LÕI (CORE ENDPOINTS REGISTRY)

### 1.1 Match & Live Operations API
* **POST `/api/v1/matches/add-goal`**: Ghi nhận bàn thắng Atomic (gọi `fn_add_goal`).
* **POST `/api/v1/matches/issue-card`**: Ghi nhận rút thẻ Vàng/Đỏ.
* **POST `/api/v1/matches/rollback-event`**: Hoàn tác sự kiện vừa nhập nhầm.
* **GET `/api/v1/matches/{id}/live-summary`**: Lấy thông tin tỷ số và timeline live.

### 1.2 Tournament & Standings API
* **GET `/api/v1/seasons/{id}/standings`**: Truy vấn Bảng xếp hạng tức thì (`v_standings`).
* **POST `/api/v1/seasons/generate-fixtures`**: Kích hoạt động cơ sinh lịch thi đấu tự động.

### 1.3 AI Services API
* **POST `/api/ai/match-story`**: Tạo bài báo tường thuật trận đấu qua Gemini Flash API.
* **POST `/api/ai/search`**: Tìm kiếm hình ảnh DAM bằng câu lệnh tự nhiên (Semantic Search).

---

## 2. CHUẨN ĐÓNG GÓI RESPONSE ENVELOPE (ENVELOPE PATTERN)
100% Endpoints trả về định dạng bọc thống nhất tuân theo `ENG-CON-001`:
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... },
  "timestamp": "2026-07-28T15:30:00Z"
}
```
