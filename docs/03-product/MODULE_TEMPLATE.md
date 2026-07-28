---
id: PROD-TMPL-001
title: PTX Product Module Standard Specification Template v2.0
layer: Product
category: Module Template
status: Approved
version: 2.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-001
  - BUS-CAP-001
  - BUS-EVT-001
related_docs:
  - ENG-CON-001
  - QUAL-MODEL-001
impacts_on: []
ai_context:
  ai_summary: "Mẫu thiết kế Module Sản phẩm v2.0 gồm 20 mục bắt buộc theo chuẩn Domain-Centric Architecture, Commands vs Events, Read Models, Invariants và Domain Scenarios."
  key_entities: ["ModuleTemplateV2", "DomainCanonicalModel"]
  business_terms: ["Product Module v2.0", "Domain Commands", "Domain Events", "Invariants", "Read Models", "Domain Scenarios"]
  breaking_changes: ["Tất cả Product Module mới bắt buộc dùng 100% cấu trúc mẫu 20 mục v2.0 này"]
  implementation_notes: "Cung cấp đủ 20 mục từ Metadata đến Traceability, phân tách rõ Commands vs Events."
  review_checklist: ["20-Section Integrity Check", "Invariants Verification", "Commands vs Events Mapping Audit"]
tags:
  - module-template-v2
  - product-template
  - domain-canonical
  - invariants
---

# PTX PRODUCT MODULE TEMPLATE V2.0
## Mẫu Thiết Kế Module Sản Phẩm Chuẩn 20 Mục v2.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa cấu trúc mẫu (Template v2.0) chuẩn hóa gồm **20 mục bắt buộc** dành cho tất cả các bản Đặc tả Module Sản phẩm (`PROD-xxx`). Mẫu v2.0 bổ sung chuẩn Domain Canonical Model, Commands vs Events, Read Models, Invariants và Domain Scenarios (Happy/Alt/Fail Paths).
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-001` (Kiến trúc KOS), `BUS-CAP-001` (Mô hình Năng lực) và `BUS-EVT-001` (Event Catalog).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Toàn bộ các file Đặc tả Module Sản phẩm thuộc phân vùng `docs/03-product/`.

---

## 20 MỤC CẤU TRÚC BẮT BUỘC CỦA MỖI PRODUCT MODULE SPECIFICATION

```markdown
---
id: PROD-<DOMAIN>-<NUMBER>
title: <MODULE_NAME> Domain Module Specification
layer: Product
category: Module Spec
status: Draft | Review | Approved
version: 1.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: YYYY-MM-DD
updated: YYYY-MM-DD
depends_on: []
related_docs: []
ai_context:
  ai_summary: "<BẢN TÓM TẮT DÀNH CHO AI AGENT>"
  key_entities: []
  business_terms: []
  breaking_changes: []
  implementation_notes: ""
  review_checklist: []
tags: []
---

# <MODULE_NAME> DOMAIN MODULE SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC
1. **Nó giải quyết vấn đề gì?**
2. **Nó phụ thuộc vào những tài liệu nào?**
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**

---

## 1. SUMMARY (TÓM TẮT MODULE)
Tóm tắt ngắn gọn phạm vi và mục tiêu chính của Module trong 2-3 câu.

## 2. PRODUCT GOALS & NON-GOALS (MỤC TIÊU & NGOẠI TRỪ)
* **Goals**: Những gì Module bắt buộc phải thực hiện.
* **Non-Goals**: Những gì Module rõ ràng không làm trong phiên bản này.

## 3. DOMAIN CAPABILITY MAPPING (ĐỊNH VỊ NĂNG LỰC)
Chỉ rõ Module phục vụ cho Capability nào trong `CAPABILITY_MODEL.md`.

## 4. ACTORS & PERMISSIONS (TÁC NHÂN & PHÂN QUYỀN RBAC)
Bảng định nghĩa các vai trò (Admin, Referee, Team Manager, Viewer) và quyền hạn tác động.

## 5. DOMAIN COMMANDS (CÁC LỆNH TÁC ĐỘNG) ⭐
Danh sách các Command tác động (`User Action ➔ Command ➔ Validation ➔ Business Rule`).

## 6. DOMAIN EVENTS (CÁC SỰ KIỆN NẰM TRONG EVENT CATALOG) ⭐
Danh sách các Event thuộc `EVENT_CATALOG.md` được sinh ra khi Command thành công.

## 7. INVARIANTS (QUY TẮC KHÔNG ĐƯỢC VI PHẠM) ⭐
Danh sách các quy tắc bất biến (Invariants) không bao giờ bị vi phạm dưới mọi hình thức công nghệ.

## 8. BUSINESS RULES (QUY TẮC NGHIỆP VỤ LIÊN QUAN)
Liệt kê các `BUS-RULE-xxx` trực tiếp điều chỉnh logic của Module.

## 9. STATE MACHINES (MÁY TRẠNG THÁI)
Sơ đồ chuyển đổi trạng thái của thực thể chính trong Module.

## 10. READ MODELS (MÔ HÌNH DỮ LIỆU ĐỌC / PROJECTIONS) ⭐
Mô tả các góc nhìn dữ liệu đọc (Live Scoreboard, Standings, Player Stats, AI Story Context).

## 11. USE CASES & USER JOURNEYS (KỊCH BẢN NGUYÊN BẢN)
Mô tả luồng thao tác nguyên bản của người dùng từ đầu đến cuối (End-to-End).

## 12. DOMAIN SCENARIOS (HAPPY / ALT / FAIL PATHS) ⭐
* **Happy Path**: Luồng xử lý hoàn hảo.
* **Alternative Path**: Luồng xử lý thay thế/dự phòng.
* **Failure Path**: Luồng xử lý khi vi phạm Validation/Invariant.

## 13. UI COMPONENTS & SCREEN SPECS (GIAO DIỆN & COMPONENTS)
Danh sách Screens (`/pages` hoặc `/app`) và Components tương tác (`/components`).

## 14. API CONTRACTS (HỢP ĐỒNG API SCHEMAS)
Các Zod Schemas và API Endpoints tương ứng theo `CONTRACT_STANDARDS.md`.

## 15. DATABASE ENTITIES (CÁC BẢNG DỮ LIỆU & RPC)
Danh sách Bảng Database, Columns, Constraints và hàm RPC liên quan.

## 16. NON-FUNCTIONAL TARGETS (NFR METRICS)
Các ngưỡng Latency, Web Vitals, và FPS bắt buộc từ `NON_FUNCTIONAL_REQUIREMENTS.md`.

## 17. ACCESSIBILITY & i18n (WCAG 2.1 AA & ĐA NGÔN NGỮ)
Quy định tương phản màu sắc, keyboard navigation và key dịch thuật (`vi` / `en`).

## 18. TESTING STRATEGY & QUALITY GATES (KỊCH BẢN KIỂM THỬ)
Kịch bản Unit Tests, Integration Tests và tiêu chí DoD cần đạt.

## 19. TRACEABILITY & REVISION HISTORY (LỊCH SỬ VÀ TRUY VẾT)
Bảng lịch sử thay đổi tài liệu và danh sách liên kết chéo 360°.

## 20. RELATED DOCUMENTS (TÀI LIỆU LIÊN QUAN)
Danh sách ID tài liệu liên quan đến Module này.
```
