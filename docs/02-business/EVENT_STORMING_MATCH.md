---
id: BUS-STM-001
title: PTX Match Domain Event Storming Specification
layer: Business
category: Event Storming
status: Approved
version: 1.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - BUS-EVT-001
  - DOMAIN-001
related_docs:
  - BUS-FLOW-001
  - PROD-MATCH-001
impacts_on:
  - ENG-CON-001
  - DB-SCHEMA-001
ai_context:
  ai_summary: "Bản phân tích Event Storming toàn bộ diễn biến vòng đời trận đấu từ Kick Off đến Result Confirmed làm cơ sở sinh ra Domain, API, DB và UI."
  key_entities: ["MatchState", "EventSequence", "CommandChain", "ReadModel"]
  business_terms: ["Event Storming", "Command", "Domain Event", "Read Model"]
  breaking_changes: ["Chuỗi sự kiện trận đấu bắt buộc tuân thủ đúng trình tự máy trạng thái"]
  implementation_notes: "Mọi Command đổi trạng thái trận đấu phải qua Zod Validation."
  review_checklist: ["State Transition Integrity", "Command-to-Event Mapping", "Rollback Capability Check"]
tags:
  - event-storming
  - match-domain
  - state-transitions
  - command-events
---

# PTX MATCH DOMAIN EVENT STORMING
## Phân Tích Chuỗi Sự Kiện Vòng Đời Trận Đấu v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Phân tích và trực quan hóa toàn bộ chuỗi Sự kiện Nghiệp vụ (Domain Events), Lệnh tác động (Commands), và Mô hình Dữ liệu Đọc (Read Models) theo phương pháp **Event Storming** cho miền Trận đấu (Match Domain).
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `BUS-EVT-001` (Event Catalog) và `DOMAIN-001` (Mô hình Miền).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Đặc tả Module Trận đấu (`PROD-MATCH-001`), API Route Contracts (`ENG-CON-001`), và PostgreSQL State Machine Views.

---

## 1. CHUỖI VÒNG ĐỜI TRẬN ĐẤU (END-TO-END MATCH EVENT TIMELINE)

```
[1. Lineup Confirmed] ──> [2. Kick Off] ──> [3. Goal / Card / Timeout] ──> [4. Half Time]
                                                                                │
[7. Result Confirmed] <── [6. Full Time] <── [5. Resume Half 2] <───────────────┘
```

---

## 2. BẢNG MÁP CÂU LỆNH (COMMANDS) ➔ SỰ KIỆN (EVENTS) ➔ TÁC ĐỘNG (READ MODELS)

| Bước | Lệnh tác động (Command) | Sự kiện sinh ra (Domain Event) | Mô hình Đọc cập nhật (Read Model) |
| :--- | :--- | :--- | :--- |
| **01** | `ConfirmMatchLineup` | `MATCH_LINEUP_CONFIRMED` | Team Lineup Sheet, Tactical Pitch 3D |
| **02** | `StartMatchPeriod(1)` | `MATCH_KICKED_OFF` | Match Timer Console, Realtime Scoreboard |
| **03** | `RecordGoal` | `MATCH_GOAL_ADDED` | Live Score (2-1), Top Scorers, Standings |
| **04** | `IssueDisciplinaryCard` | `MATCH_CARD_ISSUED` | Disciplinary Counter, Fair-play Points |
| **05** | `RequestTimeout` | `MATCH_TIMEOUT_STARTED` | Stopwatch Timer Pause, Timeout Banner |
| **06** | `EndMatchPeriod(1)` | `MATCH_HALF_TIME_REACHED` | Period Status Indicator (HT) |
| **07** | `StartMatchPeriod(2)` | `MATCH_PERIOD_2_STARTED` | Period Status Indicator (H2) |
| **08** | `FinishMatch` | `MATCH_FULL_TIME_REACHED` | Final Result (3-2), Standings Freeze |
| **09** | `ApproveMatchReport` | `MATCH_RESULT_CONFIRMED` | Official Season Standings, AI Story Trigger |

---

## 3. KHẢ NĂNG HOÀN TÁC KHI NHẬP SAI (ROLLBACK & UNDO EVENT CHAIN)

1. Khi Lệnh `UndoLastEvent` được phát ra từ Trọng tài bàn:
2. Hệ thống hủy bỏ Sự kiện gần nhất (`MATCH_GOAL_ADDED` hoặc `MATCH_CARD_ISSUED`).
3. Phát ra Sự kiện đối ứng `MATCH_EVENT_ROLLED_BACK`.
4. Động cơ Bảng xếp hạng tự động trừ đi bàn thắng/thẻ phạt tương ứng và khôi phục trạng thái Bảng xếp hạng trước đó trong **< 50ms**.
