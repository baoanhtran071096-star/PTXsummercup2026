---
id: ENG-CON-001
title: PTX Engineering Contract Standards & API Payload Specifications
layer: Engineering
category: Engineering Standards
status: Approved
version: 1.0.0
owner: Chief Software Architect
reviewer: Knowledge Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - BUS-EVT-001
  - BUS-RULE-001
  - ENG-NFR-001
related_docs:
  - STRICT_6_LAYER_ARCHITECTURE.md
  - QUALITY_MODEL.md
impacts_on:
  - PROD-MATCH-001
  - DB-SCHEMA-001
ai_context:
  ai_summary: "Quy chuẩn Contract-Driven Engineering quy định 100% API Route phải qua Zod Validation, HTTP Status Codes chuẩn mực và Response Envelope đồng nhất."
  key_entities: ["ApiResponseEnvelope", "ZodSchema", "HttpErrorContract", "StateContract"]
  business_terms: ["Contract-Driven", "Zod Validation", "Envelope Pattern"]
  breaking_changes: ["Nghiêm cấm trả về response không đúng định dạng Envelope"]
  implementation_notes: "Response Envelope chứa data, error, meta, timestamp."
  review_checklist: ["Zod Strict Check", "Response Envelope Audit", "HTTP Status Match"]
tags:
  - contract-standards
  - zod-validation
  - api-contract
  - envelope-pattern
---

# PTX CONTRACT STANDARDS
## Chuẩn Hóa Hợp Đồng Kỹ Thuật API & Payload v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Thiết lập **Contract-Driven Engineering Standards** cho PTX Platform. Đảm bảo Backend, Frontend, QA và AI Agents làm việc hoàn toàn dựa trên một Hợp đồng Kỹ thuật (Contract) thống nhất trước khi viết code triển khai.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `BUS-EVT-001` (Event Catalog), `BUS-RULE-001` (Quy tắc Nghiệp vụ) và `ENG-NFR-001` (NFR).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Tất cả các file API Routes Next.js 14, Client Fetchers, Zod Validators và TypeScript Type Definitions.

---

## 1. LUỒNG PHÁT TRIỂN THEO CONTRACT (CONTRACT-DRIVEN WORKFLOW)

```
[Use Case Definition] ──> [Business Rule] ──> [Contract (Zod Schema)] ──> [API Route & Client Fetcher]
```

Mọi API Endpoint bắt buộc phải có một Zod Validation Schema xác lập Contract trước khi lập trình.

---

## 2. STANDARD API RESPONSE ENVELOPE (ĐỊNH DẠNG RESPONSE CHUẨN)

Mọi API HTTP Response từ Next.js 14 Server Routes bắt buộc gói trong **Response Envelope**:

### 2.1 Success Response Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  },
  "timestamp": "2026-07-28T15:30:00.000Z"
}
```

### 2.2 Error Response Envelope (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "ERR_INVALID_PLAYER_ROSTER",
    "message": "Cầu thủ đã được đăng ký ở một đội bóng khác trong cùng mùa giải.",
    "details": [
      {
        "field": "player_id",
        "issue": "Duplicate registration under team_id: team_456"
      }
    ]
  },
  "timestamp": "2026-07-28T15:30:00.000Z"
}
```

---

## 3. QUY TRÌNH XÁC THỰC VÀ ZOD SCHEMA CONTRACTS (ZOD VALIDATION)

```typescript
// Mẫu Zod Contract Standard dành cho API Ghi Bàn Trận Đấu
import { z } from 'zod';

export const AddGoalContractSchema = z.object({
  match_id: z.string().uuid({ message: "match_id phải là định dạng UUID hợp lệ." }),
  team_id: z.string().uuid({ message: "team_id phải là định dạng UUID hợp lệ." }),
  player_id: z.string().uuid({ message: "player_id phải là định dạng UUID hợp lệ." }),
  minute: z.number().int().min(1).max(120),
  goal_type: z.enum(['NORMAL', 'PENALTY', 'FREE_KICK', 'OWN_GOAL']),
});

export type AddGoalContractInput = z.infer<typeof AddGoalContractSchema>;
```

---

## 4. BẢNG MÃ LỖI CHUẨN HÓA (STANDARD ERROR CODES REGISTRY)

| Error Code | HTTP Status | Mô tả chi tiết |
| :--- | :--- | :--- |
| `ERR_UNAUTHORIZED` | 401 | Người dùng chưa đăng nhập hoặc Token hết hạn. |
| `ERR_FORBIDDEN_TENANT` | 403 | Thao tác vi phạm cách ly RLS Tenant `org_id`. |
| `ERR_VALIDATION_FAILED` | 422 | Dữ liệu đầu vào vi phạm Zod Contract Schema. |
| `ERR_MATCH_ALREADY_COMPLETED` | 409 | Trận đấu đã kết thúc, không thể ghi thêm sự kiện. |
| `ERR_DATABASE_RPC_FAILURE` | 500 | Hàm RPC PostgreSQL bị lỗi khi thực thi giao dịch. |
