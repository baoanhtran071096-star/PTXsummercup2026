---
id: BUS-EVT-001
title: PTX Platform Master Event Catalog Specification
layer: Business
category: Event Architecture
status: Approved
version: 1.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - BUS-CAP-001
  - BUS-RULE-001
  - DOMAIN-001
related_docs:
  - BUS-FLOW-001
  - ENG-CON-001
impacts_on:
  - PROD-MATCH-001
  - ENG-ARCH-001
  - DB-SCHEMA-001
ai_context:
  ai_summary: "Catalog toàn bộ các sự kiện nghiệp vụ và kỹ thuật trong hệ thống PTX Platform đóng vai trò là Tài liệu Gốc trước API và DB."
  key_entities: ["MatchEvent", "GoalEvent", "CardEvent", "StandingUpdateEvent", "BroadcastEvent"]
  business_terms: ["Event Catalog", "CDC Broadcast", "Event Outbox", "Event-Driven"]
  breaking_changes: ["Thay đổi tên Event bắt buộc qua RFC/ADR và cập nhật Zod Schemas"]
  implementation_notes: "Sự kiện bàn thắng phát qua WebSocket/SSE trong < 500ms."
  review_checklist: ["Bi-directional Event Mapping", "Payload Type Verification", "Idempotency Key Check"]
tags:
  - event-catalog
  - event-driven
  - realtime-events
  - master-spec
---

# PTX MASTER EVENT CATALOG
## Thư Mục Sự Kiện Hệ Thống Gốc v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Đóng vai trò là **Tài liệu Gốc (Root Master Specification)** quản lý toàn bộ danh mục các Sự kiện Nghiệp vụ (Business Events) và Sự kiện Hệ thống (System Events) xảy ra trong PTX Platform. Mọi API Route, PostgreSQL RPC Function, UI Component, Notification Engine và AI Story Generator đều phản ánh dựa trên danh mục Sự kiện này.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `BUS-CAP-001` (Mô hình Năng lực), `BUS-RULE-001` (Quy tắc Nghiệp vụ), và `DOMAIN-001` (Mô hình Miền).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Bảng `match_events`, Supabase Realtime Channels, Event Outbox, API Payload Contracts (`ENG-CON-001`), và AI Match Story Generator.

---

## 1. CHUỖI SỰ KIỆN PHÂN HỦY (EVENT REACTION CHAINS)

```
[GOAL_ADDED] ──> [STANDING_UPDATED] ──> [STATISTICS_UPDATED] ──> [TIMELINE_UPDATED]
      │
      ├──> [REALTIME_BROADCAST_SENT] (< 500ms to Viewers)
      ├──> [PUSH_NOTIFICATION_SENT]
      └──> [AI_MATCH_STORY_TRIGGERED]
```

---

## 2. DANH MỤC CÁC SỰ KIỆN NGHIỆP VỤ CỐT LÕI (CORE EVENT REGISTRY)

### EVT-001: `MATCH_GOAL_ADDED` (Ghi nhận Bàn thắng)
* **Mô tả**: Bàn thắng được ghi nhận thành công từ Bảng điều khiển Trọng tài bàn.
* **Producer**: Trọng tài bàn Console (`/admin/live-control`).
* **Payload Structure**:
  ```json
  {
    "event_id": "evt_goal_987654",
    "event_type": "MATCH_GOAL_ADDED",
    "match_id": "match_123456",
    "team_id": "team_home_01",
    "player_id": "player_07",
    "minute": 24,
    "goal_type": "NORMAL",
    "current_score": { "home": 2, "away": 1 },
    "timestamp": "2026-07-28T15:30:00Z"
  }
  ```
* **Downstream Consumers**:
  * Standings Calculation Engine (`v_standings`).
  * Live Broadcast Channel (`WebSocket / SSE`).
  * Canvas Fireworks Animation & Web Audio Synthesizer.
  * AI Match Story Generator.

### EVT-002: `MATCH_CARD_ISSUED` (Thẻ phạt được Rút)
* **Mô tả**: Trọng tài phạt thẻ Vàng hoặc thẻ Đỏ đối với cầu thủ.
* **Payload Structure**: `event_id`, `match_id`, `player_id`, `card_type` (`YELLOW` | `RED`), `minute`, `reason`.
* **Downstream Consumers**: Disciplinary Engine, Fair-play Points Counter, Live Timeline.

### EVT-003: `MATCH_STATUS_CHANGED` (Thay đổi Trạng thái Trận đấu)
* **Mô tả**: Trận đấu chuyển trạng thái (`SCHEDULED ➔ LIVE_HALF_1 ➔ HALF_TIME ➔ LIVE_HALF_2 ➔ COMPLETED`).
* **Downstream Consumers**: Match Timer Controller, Realtime Scoreboard Banner.

### EVT-004: `STANDINGS_RECALCULATED` (Bảng xếp hạng Cập nhật)
* **Mô tả**: Đã hoàn thành tính toán lại Bảng xếp hạng tức thì sau khi có bàn thắng hoặc kết thúc trận đấu.
* **Downstream Consumers**: Standings Table Component, AI Analyst Bot.

### EVT-005: `SEASON_COMPLETED` (Mùa giải Kết thúc)
* **Mô tả**: Trận đấu cuối cùng của Mùa giải hoàn tất.
* **Downstream Consumers**: Awards Calculation Engine, Player Lifetime Stats Indexer, AI Tournament Summary Generator.

---

## 3. TÍNH BẢO ĐẢM VÀ NGUYÊN TẮC XỬ LÝ SỰ KIỆN (EVENT GUARANTEES)

1. **Idempotency (Tính Đẳng hạ)**: Mọi Consumer khi xử lý Sự kiện bắt buộc phải kiểm tra `event_id` để tránh việc xử lý lặp lại dữ liệu khi nghẽn mạng.
2. **Strict Ordering (Thứ tự Nghiêm ngặt)**: Sự kiện trong cùng một trận đấu (`match_id`) phải giữ đúng thứ tự thời gian (`minute` & `timestamp`).
