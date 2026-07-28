---
id: ENG-CON-002
title: PTX Internal Service Contracts & Inter-Service Communications
layer: Engineering
category: Engineering Contracts
status: Approved
version: 1.0.0
owner: Lead Backend Engineer
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - ENG-ARCH-001
  - BUS-EVT-001
related_docs:
  - ENG-CON-001
  - API-SPEC-001
impacts_on: []
ai_context:
  ai_summary: "Quy chuẩn Hợp đồng Kỹ thuật Nội bộ (Internal Service Contracts) giữa các Services (MatchService ➔ StandingService ➔ NotificationService ➔ StoryService)."
  key_entities: ["InternalContract", "ServiceBoundary", "RetryPolicy", "IdempotencyKey"]
  business_terms: ["Internal Service Contract", "Idempotency", "Retry Policy", "Circuit Breaker"]
  breaking_changes: ["Giao tiếp giữa các Internal Services phải bọc bối cảnh Idempotency Key"]
  implementation_notes: "Timeout tối đa cho internal call là 1,500ms."
  review_checklist: ["Internal Contract Integrity", "Retry Policy Verification", "Timeout Boundary Audit"]
tags:
  - engineering-contracts
  - internal-contracts
  - idempotency
  - retry-policy
---

# PTX INTERNAL SERVICE CONTRACTS

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa các **Hợp đồng Kỹ thuật Nội bộ (Internal Service Contracts)** giữa các Services nội bộ (`MatchService ➔ StandingService ➔ NotificationService ➔ StoryService`). Đảm bảo khả năng thay đổi implementation bên trong một Service mà không làm phá vỡ ranh giới kiến trúc.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `ENG-ARCH-001` (Kiến trúc Master) và `BUS-EVT-001` (Event Catalog).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Các file Service Handlers, Inter-service Bus, và Background Job Processors.

---

## 1. MÔ HÌNH THÔNG TIN GIỮA CÁC SERVICES (INTER-SERVICE BOUNDARIES)

```
[MatchService] ──(Goal Event)──> [StandingService] ──> [NotificationService] ──> [StoryService]
```

Mỗi Internal Contract bắt buộc phải quy định 6 thành phần:
1. **Input Interface**: Payload TypeScript Strict Type.
2. **Output Interface**: Return Type / Envelope Type.
3. **Error Contract**: Các trường hợp lỗi nội bộ có thể nổ ra.
4. **Retry Policy**: Cấu hình tự động gọi lại (Exponential Backoff: 3 lần, delay 100ms/300ms/900ms).
5. **Idempotency Key**: Mã định danh duy nhất chống xử lý trùng lặp.
6. **Timeout Boundary**: Giới hạn thời gian chờ tối đa (**< 1,500 ms**).
