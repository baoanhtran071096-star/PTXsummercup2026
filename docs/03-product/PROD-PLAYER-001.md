---
id: PROD-PLAY-001
title: Team & Player Roster Domain Module Specification
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
  - BUS-RULE-001
  - DOMAIN-001
related_docs:
  - PROD-MATCH-001
  - ENG-CON-001
impacts_on:
  - DB-SCHEMA-001
  - API-MATCH-001
ai_context:
  ai_summary: "Đặc tả Domain Đội bóng & Cầu thủ quản lý hồ sơ VĐV, đăng ký số áo, duyệt Roster, tính điểm OVR Rating và theo dõi trạng thái treo giò."
  key_entities: ["Team", "Player", "Roster", "DisciplinaryRecord"]
  business_terms: ["Roster Validation", "Shirt Number Rule", "OVR Rating", "Suspension Rule"]
  breaking_changes: ["Cầu thủ bị thẻ đỏ/2 thẻ vàng tự động chuyển trạng thái SUSPENDED cho trận kế tiếp"]
  implementation_notes: "Hình ảnh avatar được xử lý tối ưu qua DAM Assets."
  review_checklist: ["20-Section Standard Audit", "Roster Limit Verification", "Suspension Invariant Check"]
tags:
  - player-domain
  - team-roster
  - ovr-rating
  - suspension-rules
  - product-spec-v2
---

# TEAM & PLAYER ROSTER DOMAIN SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa toàn bộ mô hình miền Đội bóng (`Team Domain`) và Cầu thủ (`Player Domain`), bao gồm đăng ký danh sách thi đấu (`Roster`), kiểm soát số áo, tính toán chỉ số OVR Rating, và tự động xử lý trạng thái bị treo giò (`Suspended`).
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `PROD-TOURN-001` (Domain Tournament), `BUS-RULE-001` (Business Rules), và `DOMAIN-001` (Domain Model).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * PostgreSQL Schema (`teams`, `players`), API Routes Đội bóng/Cầu thủ, và Đội hình Đăng ký Trận đấu (`Lineup`).

---

## 1. SUMMARY (TÓM TẮT MODULE)
Module Team & Player Roster chịu trách nhiệm quản lý danh sách đội bóng, hồ sơ cá nhân vận động viên, kiểm soát số áo, đánh giá chỉ số chuyên môn OVR Rating và tự động áp dụng các hình phạt treo giò do thẻ phạt.

## 2. PRODUCT GOALS & NON-GOALS (MỤC TIÊU & NGOẠI TRỪ)
* **Goals**:
  * Đảm bảo danh sách đăng ký tối đa 20 cầu thủ/đội theo `RULE-003`.
  * Đảm bảo không trùng số áo trong cùng một đội thi đấu theo `RULE-004`.
  * Tự động áp dụng lệnh treo giò (`SUSPENDED`) đối với cầu thủ nhận thẻ đỏ/2 thẻ vàng theo `RULE-005`.
* **Non-Goals**: Không quản lý thị trường chuyển nhượng mua bán cầu thủ chuyên nghiệp.

## 3. DOMAIN CAPABILITY MAPPING (ĐỊNH VỊ NĂNG LỰC)
Phục vụ cho Capability `2.3 Team & Roster Management` trong `BUS-CAP-001`.

## 4. ACTORS & PERMISSIONS (TÁC NHÂN & PHÂN QUYỀN RBAC)
* **Team Manager (Lãnh đội)**: Đăng ký đội bóng, cập nhật danh sách cầu thủ và phân số áo.
* **BTC / Registrar**: Duyệt hồ sơ thi đấu, xác nhận tư cách hợp lệ của VĐV.
* **Public Viewer**: Xem hồ sơ cầu thủ, danh hiệu MVP và lịch sử ghi bàn (Read-only).

## 5. DOMAIN COMMANDS (CÁC LỆNH TÁC ĐỘNG) ⭐
1. `RegisterTeamCommand`: Đăng ký Đội bóng mới vào Mùa giải.
2. `AddPlayerToRosterCommand`: Thêm Cầu thủ vào danh sách thi đấu.
3. `AssignShirtNumberCommand`: Phân số áo cho Cầu thủ.
4. `SuspendPlayerCommand`: Treo giò cầu thủ do án kỷ luật/thẻ phạt.
5. `UnsuspendPlayerCommand`: Mở khóa treo giò sau khi thụ án xong.

## 6. DOMAIN EVENTS (CÁC SỰ KIỆN NẰM TRONG EVENT CATALOG) ⭐
1. `TEAM_REGISTERED`: Sinh ra khi đăng ký đội bóng thành công.
2. `PLAYER_ADDED_TO_ROSTER`: Sinh ra khi thêm cầu thủ vào danh sách.
3. `PLAYER_SUSPENDED`: Sinh ra khi cầu thủ bị tự động treo giò.
4. `PLAYER_OVR_UPDATED`: Sinh ra khi chỉ số OVR Rating của cầu thủ thay đổi.

## 7. INVARIANTS (QUY TẮC KHÔNG ĐƯỢC VI PHẠM) ⭐
1. **INV-PLAY-001**: Một đội bóng không thể đăng ký quá **20 cầu thủ** trong 1 Mùa giải (`RULE-003`).
2. **INV-PLAY-002**: Không được phép có **2 cầu thủ trùng số áo** trong cùng 1 Đội bóng ở 1 Mùa giải (`RULE-004`).
3. **INV-PLAY-003**: Cầu thủ ở trạng thái `SUSPENDED` (Đang bị treo giò) **không thể đăng ký vào Lineup** chính thức hoặc dự bị của bất kỳ trận đấu nào.
4. **INV-PLAY-004**: Một cầu thủ không thể đăng ký thi đấu cho 2 Đội bóng khác nhau trong cùng 1 Mùa giải.

## 8. BUSINESS RULES (QUY TẮC NGHIỆP VỤ LIÊN QUAN)
Tuân thủ `RULE-003` (Roster Limits), `RULE-004` (Shirt Numbers), và `RULE-005` (Treo giò thẻ phạt) trong `BUS-RULE-001`.

## 9. STATE MACHINES (MÁY TRẠNG THÁI CẦU THỦ)
```
[PENDING_APPROVAL] ──> [ELIGIBLE] ──(Dính thẻ đỏ / 2 thẻ vàng)──> [SUSPENDED]
                               ▲                                       │
                               └─────────(Thụ án treo giò xong)────────┘
```

## 10. READ MODELS (MÔ HÌNH DỮ LIỆU ĐỌC / PROJECTIONS) ⭐
1. `TeamRosterProjection`: Danh sách cầu thủ kèm số áo, vị trí, chỉ số OVR và avatar.
2. `PlayerProfileProjection`: Hồ sơ VĐV, số bàn thắng, số kiến tạo, danh hiệu MVP.
3. `SuspensionListProjection`: Danh sách cầu thủ đang bị treo giò ở vòng đấu tiếp theo.

## 11. USE CASES & USER JOURNEYS (KỊCH BẢN NGUYÊN BẢN)
* Lãnh đội đăng nhập ➔ Tạo thông tin Đội ➔ Nhập danh sách 15 VĐV ➔ Gán số áo từ 1 đến 15 ➔ BTC duyệt Roster ➔ Trạng thái VĐV chuyển sang `ELIGIBLE`.

## 12. DOMAIN SCENARIOS (HAPPY / ALT / FAIL PATHS) ⭐
* **Happy Path**: Lãnh đội nhập `AddPlayerToRosterCommand` ➔ Số áo chưa bị trùng ➔ Roster < 20 ➔ Thêm cầu thủ thành công ➔ Trả về `PLAYER_ADDED_TO_ROSTER`.
* **Alternative Path**: Lãnh đội đổi số áo của cầu thủ trước khi Mùa giải chính thức bắt đầu.
* **Failure Path**: Lãnh đội đăng ký VĐV mang số áo 10 khi đã có VĐV khác mang số 10 ➔ Validation thất bại ➔ Trả về `ERR_DUPLICATE_SHIRT_NUMBER` (Không phát Event).

## 13. UI COMPONENTS & SCREEN SPECS (GIAO DIỆN & COMPONENTS)
* Screen: `/admin/teams/[id]/roster`, `/players/[id]`.
* Components: `PlayerCardWidget`, `RosterTable`, `SuspensionBadge`, `OVRRatingBadge`.

## 14. API CONTRACTS (HỢP ĐỒNG API SCHEMAS)
* POST `/api/v1/players/add` bọc Zod Schema `AddPlayerContractSchema` (`ENG-CON-001`).

## 15. DATABASE ENTITIES (CÁC BẢNG DỮ LIỆU & RPC)
* Tables: `teams`, `players`.
* RPC / Functions: `fn_check_roster_eligibility(player_id UUID)`.

## 16. NON-FUNCTIONAL TARGETS (NFR METRICS)
* Roster Eligibility Query Execution: **< 30 ms**.
* Player Avatar Load Time: **< 500 ms** (qua Next.js Image Optimization).

## 17. ACCESSIBILITY & i18n (WCAG 2.1 AA & ĐA NGÔN NGỮ)
* Supported Locales: `vi`, `en`. Key: `player.position.fixo`, `player.status.suspended`.

## 18. TESTING STRATEGY & QUALITY GATES (KỊCH BẢN KIỂM THỬ)
* Unit Test kiểm tra Constraint không trùng số áo.
* Integration Test xác minh cầu thủ `SUSPENDED` bị chặn khi gọi API Lineup.

## 19. TRACEABILITY & REVISION HISTORY (LỊCH SỬ VÀ TRUY VẾT)
* v2.0.0 (2026-07-28): Khởi tạo bản đặc tả Domain Team & Player Roster v2.0 chuẩn 20 mục.

## 20. RELATED DOCUMENTS (TÀI LIỆU LIÊN QUAN)
* `PROD-TOURN-001`, `PROD-MATCH-001`, `BUS-RULE-001`.
