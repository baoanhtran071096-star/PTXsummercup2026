---
id: ENG-RUN-001
title: PTX Platform Master Runtime Architecture Specification
layer: Engineering
category: Runtime Architecture
status: Specified
version: 1.0.0
owner: Lead System Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - ENG-ARCH-001
  - DB-SCHEMA-001
  - API-SPEC-001
related_docs:
  - ENG-OBS-001
  - ENG-ERR-001
impacts_on: []
verification:
  automated: true
  integration_tests: false
  last_verified: 2026-07-28
evidence:
  implementation:
    - "docs/04-engineering/ENG-ARCH-001.md"
  tests:
    - "docs/04-engineering/ARCHITECTURE_FITNESS_FUNCTIONS.md"
  metrics:
    - "rpc_execution_latency_ms"
  dashboards:
    - "ARCHITECTURE_DASHBOARD.md"
  source_files:
    - "docs/04-engineering/RUNTIME_ARCHITECTURE.md"
ai_context:
  ai_summary: "Đặc tả Kiến trúc Vận hành Thực thi (Runtime Architecture) mô tả luồng Request, Event, Cache, Realtime Broadcast, Failure Recovery, Background Jobs và AI Pipeline."
  key_entities: ["RuntimeArchitecture", "RequestFlow", "EventFlow", "FailureRecoveryFlow"]
  business_terms: ["Runtime Architecture", "Realtime SSE Broadcast", "Circuit Breaker", "Failure Recovery"]
  breaking_changes: ["Nghiêm cấm blocking I/O trên Main Event Loop thread"]
  implementation_notes: "Timeout cho Realtime SSE Broadcast là 500ms."
  review_checklist: ["Runtime Flow Verification", "Circuit Breaker Config Check", "Async Worker Boundary Audit"]
tags:
  - runtime-architecture
  - request-flow
  - event-flow
  - failure-recovery
---

# PTX MASTER RUNTIME ARCHITECTURE

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Mô tả toàn bộ Kiến trúc Vận hành Thực thi **(Runtime Architecture)** trong môi trường thực tế (Request Flow, Event Flow, Cache Flow, Realtime Broadcast Flow, Failure Recovery Flow, Background Jobs, và AI Pipeline).
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `ENG-ARCH-001` (Kiến trúc Master), `DB-SCHEMA-001` (Database Schema), và `API-SPEC-001` (API Spec).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Hạ tầng CDN, Redis Cache Policies, Supabase Realtime Channels, và Background Workers.

---

## 1. BẢY LUỒNG VẬN HÀNH THỰC THI (SEVEN RUNTIME FLOWS)

```
                       ┌──────────────────────────────┐
                       │   PTX RUNTIME ARCHITECTURE   │
                       └──────────────┬───────────────┘
                                      │
 ┌────────────┬────────────┬──────────┼───────────┬────────────┬────────────┬────────────┐
 ▼            ▼            ▼          ▼           ▼            ▼            ▼            ▼
┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐ ┌──────────┐ ┌──────────┐
│1.REQUEST ││ 2.EVENT  ││ 3.CACHE  ││4.REALTIME││5.FAILURE │ │6.WORKER  │ │ 7.AI     │
│   FLOW   ││   FLOW   ││   FLOW   ││BROADCAST ││ RECOVERY │ │  JOBS    │ │ PIPELINE │
└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘ └──────────┘ └──────────┘
```

### 1. Request Flow (Luồng Xử lý Yêu cầu HTTP)
* `Client Browser ➔ Cloudflare Edge CDN ➔ Next.js 14 Server Component ➔ Zod Validation ➔ Service Layer ➔ Supabase PostgreSQL RPC`.

### 2. Event Flow (Luồng Sự kiện Trực tiếp)
* `Referee Add Goal ➔ RPC fn_add_goal ➔ Event Outbox ➔ CDC Stream ➔ Realtime Subscribers`.

### 3. Cache Flow (Luồng Cache Dữ liệu)
* `Redis L1 Cache (TTL 3,600s) ➔ SWR Invalidation on Event ➔ Fresh Fetch`.

### 4. Realtime Broadcast Flow (Luồng Phát sóng Khán giả)
* `SSE / WebSockets Push ➔ Viewers Scoreboard < 500 ms`.

### 5. Failure Recovery Flow (Luồng Tự chữa lành & Phục hồi)
* `Circuit Breaker Trigger ➔ Fallback Read Model ➔ Retry Exponential Backoff`.

### 6. Background Jobs (Luồng Công việc Chạy ngầm)
* `BullMQ Workers ➔ Re-indexing Standings & DAM Asset Tagging`.

### 7. AI Pipeline (Luồng Xử lý AI Thể thao)
* `Goal Event ➔ Gemini Flash API ➔ Match Story Generation < 3,000 ms`.
