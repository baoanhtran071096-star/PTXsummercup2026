---
id: ENG-OBS-001
title: PTX Observability by Design Specification
layer: Quality
category: Observability Standards
status: Approved
version: 1.0.0
owner: Lead DevOps Engineer
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - ENG-ARCH-001
  - ENG-ERR-001
related_docs:
  - QUAL-MODEL-001
  - ENG-NFR-001
impacts_on: []
ai_context:
  ai_summary: "Đặc tả Observability by Design quy định 4 tín hiệu giám sát (Logs, Metrics, Traces, Audit) bắt buộc phải có cho mọi Module và Workflow."
  key_entities: ["ObservabilityMatrix", "TelemetrySignal", "StructuredLogger"]
  business_terms: ["Observability by Design", "Structured Logging", "Distributed Tracing", "Metrics Telemetry"]
  breaking_changes: ["Tất cả API Routes bắt buộc ghi Structured JSON Log kèm Request ID"]
  implementation_notes: "Request ID được truyền qua header X-Request-ID."
  review_checklist: ["Telemetry Signal Audit", "Structured Log Format Check", "Audit Log Immutable Verification"]
tags:
  - observability
  - logging
  - metrics
  - tracing
  - telemetry
---

# PTX OBSERVABILITY BY DESIGN

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa tiêu chuẩn **Observability by Design (Giám sát theo Thiết kế)**. Đảm bảo 100% các Module và Workflow kỹ thuật trong PTX Platform đều tích hợp sẵn 4 tín hiệu Telemetry (**Logs**, **Metrics**, **Traces**, **Audit**) ngay từ thời điểm thiết kế kiến trúc.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `ENG-ARCH-001` (Kiến trúc Master) và `ENG-ERR-001` (Error Taxonomy).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Logger Module, OpenTelemetry Collectors, Dashboard Analytics và Alert Notification Rules.

---

## 1. BỐN TÍN HIỆU TELEMETRY CỐT LÕI (FOUR TELEMETRY SIGNALS)

```
                       ┌──────────────────────────────┐
                       │    TELEMETRY SIGNALS         │
                       └──────────────┬───────────────┘
                                      │
       ┌──────────────┬───────────────┴───────────────┬──────────────┐
       ▼              ▼                               ▼              ▼
┌─────────────┐┌─────────────┐                 ┌─────────────┐┌─────────────┐
│ 1. LOGS     ││ 2. METRICS  │                 │ 3. TRACES   ││ 4. AUDIT    │
│ (Structured)││ (Telemetry) │                 │(Distributed)││ (Immutable) │
└─────────────┘└─────────────┘                 └─────────────┘└─────────────┘
```

---

## 2. MA TRẬN PHÂN BỔ OBSERVABILITY THEO MODULE (MODULE OBSERVABILITY MATRIX)

### Ví dụ đối với Module Match Operations (`PROD-MATCH-001`)

| Tín hiệu Telemetry | Định dạng / Chi tiết | Ngưỡng Cảnh báo (Alert Threshold) |
| :--- | :--- | :--- |
| **Log (Structured JSON)** | `{"event":"fn_add_goal_executed", "match_id": "...", "duration_ms": 18}` | Log level = `ERROR` khi RPC lỗi |
| **Metric (Gauge / Counter)**| `rpc_execution_latency_ms`, `live_concurrent_viewers_count` | Latency > 100ms hoặc Errors > 1% |
| **Trace (OpenTelemetry)** | `TraceID`: Theo vết từ Browser ➔ Next.js API Route ➔ Supabase RPC | Span Duration > 800ms |
| **Audit (Immutable)** | `audit_logs`: Bắt buộc lưu `user_id`, `action`, `entity_id`, `timestamp` | Mọi thao tác sửa bàn thắng/thẻ phạt |
