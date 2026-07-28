---
id: PROD-MATCH-001
title: Match & Live Control Operations Domain Module Specification
layer: Product
category: Module Spec
status: Approved
version: 2.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - PROD-TOURN-001
  - BUS-EVT-001
  - BUS-STM-001
  - BUS-RULE-001
related_docs:
  - PROD-PLAY-001
  - ENG-CON-001
  - ADR-001
impacts_on:
  - DB-SCHEMA-001
  - API-MATCH-001
ai_context:
  ai_summary: "Đặc tả Domain Trận đấu & Bàn Trọng tài Live Console quản lý ghi bàn Atomic RPC, thẻ phạt, sa bàn 3D, còi Web Audio và pháo hoa realtime."
  key_entities: ["Match", "MatchEvent", "Lineup", "PitchTactics"]
  business_terms: ["Atomic RPC", "Live Referee Console", "Tactical Pitch 3D", "Rollback Event"]
  breaking_changes: ["Tất cả ghi nhận bàn thắng bắt buộc qua PostgreSQL RPC fn_add_goal"]
  implementation_notes: "Canvas Fireworks lazy loaded, Web Audio Synthesizer singleton."
  review_checklist: ["20-Section Standard Audit", "Atomic RPC Verification", "Invariant Enforcement Check"]
tags:
  - match-domain
  - live-control
  - atomic-rpc
  - tactical-pitch-3d
  - product-spec-v2
---

# MATCH & LIVE CONTROL OPERATIONS DOMAIN SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa toàn bộ mô hình miền Vận hành Trận đấu (`Match Domain`), điều khiển Bàn Trọng tài Live Console (`/admin/live-control`), ghi nhận Bàn thắng Atomic RPC, rút Thẻ phạt, hiển thị Sa bàn Chiến thuật Sân 5 3D, và phát tin hiệu Realtime Broadcast cho khán giả.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `PROD-TOURN-001` (Domain Tournament), `BUS-EVT-001` (Event Catalog), `BUS-STM-001` (Event Storming Match), và `BUS-RULE-001` (Business Rules).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * PostgreSQL Schema (`matches`, `match_events`), PostgreSQL RPC `fn_add_goal`, API Endpoints Trận đấu, và UI Live Control Room.

---

## 1. SUMMARY (TÓM TẮT MODULE)
Module Match & Live Control Operations chịu trách nhiệm điều khiển toàn bộ diễn biến trận đấu theo thời gian thực, đảm bảo tính nhất quán dữ liệu 100% qua PostgreSQL RPC, đồng thời cung cấp trải nghiệm UI/UX sống động với Sa bàn 3D và pháo hoa ăn mừng bàn thắng.

## 2. PRODUCT GOALS & NON-GOALS (MỤC TIÊU & NGOẠI TRỪ)
* **Goals**:
  * Đảm bảo tính nhất quán dữ liệu bàn thắng và điểm số qua Atomic RPC (`ADR-001`).
  * Phát tín hiệu Realtime Goal Broadcast tới khán giả trong **< 500 ms**.
  * Hỗ trợ bộ 6 sơ đồ chiến thuật sân 5 3D và tính năng hoán đổi vị trí cầu thủ live.
  * Hỗ trợ khả năng hoàn tác sự kiện (`Rollback Event`) khi trọng tài nhập nhầm.
* **Non-Goals**: Không quay dựng video trực tiếp (Video Streaming) trong module này.

## 3. DOMAIN CAPABILITY MAPPING (ĐỊNH VỊ NĂNG LỰC)
Phục vụ cho Capability `2.5 Match Operations & Live Control` và `2.6 Statistics Engine` trong `BUS-CAP-001`.

## 4. ACTORS & PERMISSIONS (TÁC NHÂN & PHÂN QUYỀN RBAC)
* **Table Referee (Trọng tài bàn)**: Toàn quyền bấm nút ghi bàn, rút thẻ, bấm giờ, chọn lineup.
* **Main Referee (Trọng tài chính)**: Xác nhận kết quả trận đấu sau khi thổi còi hết giờ.
* **Public Viewer (Khán giả)**: Xem tỷ số, timeline và bảng xếp hạng realtime (Read-only).

## 5. DOMAIN COMMANDS (CÁC LỆNH TÁC ĐỘNG) ⭐
1. `ConfirmLineupCommand`: Xác nhận danh sách đăng ký thi đấu của 2 đội.
2. `StartMatchPeriodCommand`: Bắt đầu Hệp 1 hoặc Hệp 2.
3. `AddGoalCommand`: Ghi nhận bàn thắng (gọi RPC `fn_add_goal`).
4. `IssueCardCommand`: Rút thẻ Vàng / Thẻ đỏ.
5. `RollbackLastEventCommand`: Hoàn tác sự kiện vừa nhập nhầm.
6. `FinishMatchCommand`: Thổi còi kết thúc trận đấu.

## 6. DOMAIN EVENTS (CÁC SỰ KIỆN NẰM TRONG EVENT CATALOG) ⭐
1. `MATCH_KICKED_OFF`: Sinh ra khi trận đấu bắt đầu.
2. `MATCH_GOAL_ADDED`: Sinh ra khi bàn thắng ghi nhận thành công (`EVT-001`).
3. `MATCH_CARD_ISSUED`: Sinh ra khi có thẻ phạt (`EVT-002`).
4. `MATCH_EVENT_ROLLED_BACK`: Sinh ra khi hoàn tác sự kiện thành công.
5. `MATCH_FULL_TIME_REACHED`: Sinh ra khi kết thúc trận đấu.

## 7. INVARIANTS (QUY TẮC KHÔNG ĐƯỢC VI PHẠM) ⭐
1. **INV-MATCH-001**: Một trận đấu chỉ có đúng **1 trạng thái hoạt động** tại một thời điểm.
2. **INV-MATCH-002**: Không thể ghi nhận bàn thắng hay thẻ phạt nếu trận đấu không ở trạng thái `LIVE_HALF_1` hoặc `LIVE_HALF_2`.
3. **INV-MATCH-003**: Một bàn thắng chỉ thuộc về đúng 1 đội bóng và 1 trận đấu.
4. **INV-MATCH-004**: Không thể rút 2 thẻ đỏ cho cùng một hành động của một cầu thủ.

## 8. BUSINESS RULES (QUY TẮC NGHIỆP VỤ LIÊN QUAN)
Tuân thủ `RULE-001` (Tính điểm), `RULE-005` (Treo giò do thẻ), và `RULE-007` (Ghi nhận bàn thắng Atomic) trong `BUS-RULE-001`.

## 9. STATE MACHINES (MÁY TRẠNG THÁI TRẬN ĐẤU)
```
[SCHEDULED] ──> [LIVE_HALF_1] ──> [HALF_TIME] ──> [LIVE_HALF_2] ──> [COMPLETED]
```

## 10. READ MODELS (MÔ HÌNH DỮ LIỆU ĐỌC / PROJECTIONS) ⭐
1. `LiveScoreboardProjection`: Tỷ số thời gian thực, Tên 2 đội, Thời gian bấm giờ.
2. `MatchTimelineProjection`: Chuỗi các sự kiện bàn thắng, thẻ phạt theo phút.
3. `TacticalPitchProjection`: Sa bàn 3D vị trí 5 cầu thủ chính thức của 2 đội.
4. `AIMatchStoryContext`: Ngữ cảnh dữ liệu để Gemini tạo bài báo tường thuật.

## 11. USE CASES & USER JOURNEYS (KỊCH BẢN NGUYÊN BẢN)
* Trọng tài bàn chọn Lineup ➔ Bấm "Bắt đầu Hệp 1" ➔ Cầu thủ số 7 ghi bàn ➔ Trọng tài bấm "Ghi bàn" ➔ Canvas Pháo hoa nổ + Còi vang lên ➔ Khán giả thấy tỷ số đổi thành 1-0 trong 300ms.

## 12. DOMAIN SCENARIOS (HAPPY / ALT / FAIL PATHS) ⭐
* **Happy Path**: Trọng tài bấm `AddGoalCommand` ➔ RPC `fn_add_goal` thành công ➔ Phát `MATCH_GOAL_ADDED` ➔ Tỷ số cập nhật (1-0) ➔ Standings cập nhật.
* **Alternative Path**: Trọng tài bấm nhầm ghi bàn ➔ Bấm `RollbackLastEventCommand` ➔ Tỷ số khôi phục lại (0-0) ➔ Standings khôi phục.
* **Failure Path**: Trọng tài bấm ghi bàn khi trận đấu ở trạng thái `HALF_TIME` ➔ Validation thất bại ➔ Trả về `ERR_MATCH_NOT_LIVE` (Không phát Event).

## 13. UI COMPONENTS & SCREEN SPECS (GIAO DIỆN & COMPONENTS)
* Screen: `/admin/live-control`, `/matches/[id]`.
* Components: `TacticalPitch3D`, `ParticleFireworksCanvas`, `RefiningControlPanel`, `ScoreboardBanner`.

## 14. API CONTRACTS (HỢP ĐỒNG API SCHEMAS)
* POST `/api/v1/matches/add-goal` bọc Zod Schema `AddGoalContractSchema` (`ENG-CON-001`).

## 15. DATABASE ENTITIES (CÁC BẢNG DỮ LIỆU & RPC)
* Tables: `matches`, `match_events`.
* RPC: `fn_add_goal(...)`, `fn_rollback_event(...)`.

## 16. NON-FUNCTIONAL TARGETS (NFR METRICS)
* Realtime Goal Broadcast Delay: **< 500 ms**.
* RPC Execution Latency: **< 50 ms**.
* Tactical Pitch 3D Render: **60 FPS**.

## 17. ACCESSIBILITY & i18n (WCAG 2.1 AA & ĐA NGÔN NGỮ)
* Supported Locales: `vi`, `en`. Color Contrast AA certified. Keyboard shortcuts (`Space`: Pause/Play, `G`: Goal).

## 18. TESTING STRATEGY & QUALITY GATES (KỊCH BẢN KIỂM THỬ)
* Unit Test RPC `fn_add_goal` bằng `pgTAP`.
* E2E Test cho luồng bấm nút ghi bàn ➔ WebSocket Push ➔ UI Scoreboard Change.

## 19. TRACEABILITY & REVISION HISTORY (LỊCH SỬ VÀ TRUY VẾT)
* v2.0.0 (2026-07-28): Khởi tạo bản đặc tả Domain Match & Live Control v2.0 chuẩn 20 mục.

## 20. RELATED DOCUMENTS (TÀI LIỆU LIÊN QUAN)
* `PROD-TOURN-001`, `PROD-PLAY-001`, `BUS-EVT-001`, `ADR-001`.
