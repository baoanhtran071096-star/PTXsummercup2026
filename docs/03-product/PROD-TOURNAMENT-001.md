---
id: PROD-TOURN-001
title: Tournament & Season Domain Module Specification
layer: Product
category: Module Spec
status: Approved
version: 2.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - BUS-CAP-001
  - BUS-RULE-001
  - DOMAIN-001
  - BUS-EVT-001
related_docs:
  - PROD-MATCH-001
  - PROD-PLAY-001
  - ENG-CON-001
impacts_on:
  - DB-SCHEMA-001
  - API-MATCH-001
ai_context:
  ai_summary: "Đặc tả Domain Gốc Tournament & Season quản lý toàn bộ vòng đời Organization, Tournament, Season, Division và động cơ tự động sinh lịch thi đấu (Fixture Engine)."
  key_entities: ["Organization", "Tournament", "Season", "Division", "Fixture"]
  business_terms: ["Tenant Isolation", "Season Lifecycle", "Fixture Engine", "Round Robin"]
  breaking_changes: ["Khóa chỉnh sửa thể thức khi Season đã chuyển trạng thái IN_PROGRESS"]
  implementation_notes: "Cấp phát org_id qua JWT Custom Claims, tự động xếp lịch qua Fixture Generator."
  review_checklist: ["20-Section Standard Audit", "Tenant Isolation Policy Check", "Invariant Enforcement Audit"]
tags:
  - tournament-domain
  - season-lifecycle
  - fixture-engine
  - product-spec-v2
---

# TOURNAMENT & SEASON DOMAIN MODULE SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa toàn bộ mô hình miền gốc (Root Domain) quản lý Tổ chức (`Organization`), Giải đấu (`Tournament`), Mùa giải (`Season`), Bảng đấu (`Division`) và Động cơ xếp lịch thi đấu tự động (`Fixture Engine`).
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `BUS-CAP-001` (Capability Model), `BUS-RULE-001` (Business Rules), `DOMAIN-001` (Domain Model), và `BUS-EVT-001` (Event Catalog).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * PostgreSQL Schema (`organizations`, `seasons`), API Routes quản lý Mùa giải, và các Module `PROD-MATCH-001`, `PROD-PLAY-001`.

---

## 1. SUMMARY (TÓM TẮT MODULE)
Module Tournament & Season quản lý cấu trúc tổ chức đa người dùng (Multi-tenant), thiết lập quy mô giải đấu, chia bảng đấu, quản lý vòng đời mùa giải và sinh lịch thi đấu tự động.

## 2. PRODUCT GOALS & NON-GOALS (MỤC TIÊU & NGOẠI TRỪ)
* **Goals**:
  * Đảm bảo cách ly dữ liệu đa tổ chức (`org_id`) 100%.
  * Tự động sinh lịch thi đấu Vòng tròn (Round Robin) hoặc Chia bảng Knock-out.
  * Quản lý chuyển đổi 5 trạng thái mùa giải (`DRAFT ➔ REGISTRATION ➔ FIXTURE_GEN ➔ IN_PROGRESS ➔ COMPLETED`).
* **Non-Goals**: Không quản lý bán vé hay thanh toán trực tuyến trong phiên bản này.

## 3. DOMAIN CAPABILITY MAPPING (ĐỊNH VỊ NĂNG LỰC)
Phục vụ cho Capability `2.1 Organization Management`, `2.2 Tournament Management` và `2.4 Competition Engine` trong `BUS-CAP-001`.

## 4. ACTORS & PERMISSIONS (TÁC NHÂN & PHÂN QUYỀN RBAC)
* **System Admin / Org Owner**: Tạo Mùa giải, duyệt cấu hình, đóng Mùa giải.
* **Tournament Director (BTC)**: Phân lịch sân, chỉnh giờ thi đấu, duyệt danh sách bảng đấu.
* **Public Viewer**: Xem lịch thi đấu và thông tin mùa giải (Read-only).

## 5. DOMAIN COMMANDS (CÁC LỆNH TÁC ĐỘNG) ⭐
1. `CreateSeasonCommand`: Khởi tạo Mùa giải mới.
2. `ConfigureTournamentFormatCommand`: Cấu hình thể thức (Chia bảng, Vòng tròn).
3. `GenerateFixturesCommand`: Kích hoạt Động cơ tự động xếp lịch thi đấu.
4. `ChangeSeasonStateCommand`: Chuyển trạng thái Mùa giải.

## 6. DOMAIN EVENTS (CÁC SỰ KIỆN NẰM TRONG EVENT CATALOG) ⭐
1. `SEASON_CREATED`: Sinh ra khi tạo mùa giải thành công.
2. `FIXTURES_GENERATED`: Sinh ra khi tạo lịch thi đấu hoàn tất.
3. `SEASON_STATE_CHANGED`: Sinh ra khi trạng thái mùa giải thay đổi.
4. `SEASON_COMPLETED`: Sinh ra khi mùa giải chính thức đóng.

## 7. INVARIANTS (QUY TẮC KHÔNG ĐƯỢC VI PHẠM) ⭐
1. **INV-TOURN-001**: Một Mùa giải chỉ thuộc về duy nhất 1 Organization (`org_id`).
2. **INV-TOURN-002**: Không thể sinh lịch thi đấu nếu số lượng Đội bóng đăng ký ít hơn 2.
3. **INV-TOURN-003**: Thể thức thi đấu không thể bị sửa đổi sau khi Mùa giải đã chuyển sang trạng thái `IN_PROGRESS`.
4. **INV-TOURN-004**: Không thể đóng Mùa giải (`COMPLETED`) nếu còn ít nhất 1 trận đấu ở trạng thái `SCHEDULED` hoặc `LIVE`.

## 8. BUSINESS RULES (QUY TẮC NGHIỆP VỤ LIÊN QUAN)
Tuân thủ `RULE-001` (Tính điểm) và `RULE-002` (Thứ tự ưu tiên xếp hạng 7 cấp) trong `BUS-RULE-001`.

## 9. STATE MACHINES (MÁY TRẠNG THÁI MÙA GIẢI)
```
[DRAFT] ──> [REGISTRATION] ──> [FIXTURE_GEN] ──> [IN_PROGRESS] ──> [COMPLETED]
```

## 10. READ MODELS (MÔ HÌNH DỮ LIỆU ĐỌC / PROJECTIONS) ⭐
1. `TournamentHeaderProjection`: Thông tin Logo, Tên Giải, Mùa giải hiện tại.
2. `FullFixtureCalendarProjection`: Lịch thi đấu tổng thể phân theo Vòng đấu & Ngày thi đấu.
3. `DivisionStandingsProjection`: Bảng xếp hạng theo từng Bảng đấu.

## 11. USE CASES & USER JOURNEYS (KỊCH BẢN NGUYÊN BẢN)
* BTC tạo Mùa giải PTX Summer Cup 2026 ➔ Cấu hình 8 Đội chia 2 Bảng ➔ Bấm nút "Generate Fixtures" ➔ Kiểm tra Lịch thi đấu ➔ Mở Mùa giải `IN_PROGRESS`.

## 12. DOMAIN SCENARIOS (HAPPY / ALT / FAIL PATHS) ⭐
* **Happy Path**: BTC bấm `GenerateFixturesCommand` ➔ Đội hình hợp lệ ➔ Tự động tạo 12 trận đấu ➔ Phát sự kiện `FIXTURES_GENERATED`.
* **Alternative Path**: BTC tùy chỉnh lại giờ thi đấu của một trận đấu cụ thể sau khi sinh lịch tự động.
* **Failure Path**: BTC bấm `GenerateFixturesCommand` khi có 1 đội chưa đóng danh sách Roster ➔ Validation thất bại ➔ Trả về `ERR_VALIDATION_FAILED` (Không phát Event).

## 13. UI COMPONENTS & SCREEN SPECS (GIAO DIỆN & COMPONENTS)
* Screen: `/admin/seasons/new`, `/seasons/[id]/fixtures`.
* Components: `SeasonStatusBadge`, `FixtureCalendarTable`, `DivisionTabs`.

## 14. API CONTRACTS (HỢP ĐỒNG API SCHEMAS)
* POST `/api/v1/seasons/generate-fixtures` bọc Zod Schema `GenerateFixturesContractSchema` tuân theo Envelope `ENG-CON-001`.

## 15. DATABASE ENTITIES (CÁC BẢNG DỮ LIỆU & RPC)
* Tables: `organizations`, `seasons`, `divisions`.
* RPC: `fn_generate_fixtures(season_id UUID)`.

## 16. NON-FUNCTIONAL TARGETS (NFR METRICS)
* Fixture Generation Execution Time: **< 1,000 ms** cho giải đấu 32 đội.
* Page Load LCP: **< 2.0s**.

## 17. ACCESSIBILITY & i18n (WCAG 2.1 AA & ĐA NGÔN NGỮ)
* Supported Locales: `vi`, `en`. Key: `season.status.in_progress`, `fixture.round_name`.

## 18. TESTING STRATEGY & QUALITY GATES (KỊCH BẢN KIỂM THỬ)
* Unit Test cho Fixture Generator Algorithm (Round Robin matrix check).
* Integration Test kiểm tra RLS Tenant Boundary trên bảng `seasons`.

## 19. TRACEABILITY & REVISION HISTORY (LỊCH SỬ VÀ TRUY VẾT)
* v2.0.0 (2026-07-28): Khởi tạo bản đặc tả Domain Tournament & Season v2.0 chuẩn 20 mục.

## 20. RELATED DOCUMENTS (TÀI LIỆU LIÊN QUAN)
* `BUS-CAP-001`, `BUS-RULE-001`, `DOMAIN-001`, `PROD-MATCH-001`.
