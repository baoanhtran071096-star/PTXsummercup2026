---
id: GOV-BOARD-001
title: PTX Architecture Governance Board & Operational Charter
layer: Governance
category: Governance Charter
status: Specified
version: 1.0.0
owner: Chief Software Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - MANIFESTO-001
  - KOS-001
related_docs:
  - ADR-001
  - KOS-LIFE-001
impacts_on: []
verification:
  automated: true
  integration_tests: false
  last_verified: 2026-07-28
evidence:
  implementation:
    - "docs/00-foundation/MANIFESTO.md"
  tests:
    - "docs/04-engineering/ARCHITECTURE_FITNESS_FUNCTIONS.md"
  metrics:
    - "adr_dqi_pass_rate"
  dashboards:
    - "ARCHITECTURE_DASHBOARD.md"
  source_files:
    - "docs/07-adr/ARCHITECTURE_GOVERNANCE.md"
ai_context:
  ai_summary: "Hiến pháp Vận hành Hội đồng Kiến trúc Architecture Governance Board quy định quyền phê duyệt RFC/ADR, quy trình ngoại lệ Exception, Deprecation và Migration Policy."
  key_entities: ["ArchitectureGovernanceBoard", "RfcWorkflow", "ExceptionHandling", "DeprecationPolicy"]
  business_terms: ["Governance Board", "RFC Workflow", "Exception Handling", "Deprecation Policy"]
  breaking_changes: ["Nghiêm cấm tự ý phá vỡ kiến trúc nếu chưa qua phê duyệt của Governance Board"]
  implementation_notes: "Cuộc họp Architecture Review Cadence diễn ra định kỳ 2 tuần/lần."
  review_checklist: ["Governance Voting Rule Audit", "Exception Limit Verification", "Deprecation Lifecycle Check"]
tags:
  - architecture-governance
  - governance-board
  - rfc-approval
  - deprecation-policy
---

# PTX ARCHITECTURE GOVERNANCE BOARD

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Xác lập **Hiến pháp Vận hành Hội đồng Kiến trúc (Architecture Governance Board Charter)**. Quy định rõ thẩm quyền phê duyệt RFC/ADR, quy trình xử lý ngoại lệ phá vỡ kiến trúc, quy định Deprecation/Migration Policy và nhịp độ kiểm duyệt định kỳ (Review Cadence).
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `MANIFESTO-001` (KOS LAW-001) và `KOS-001` (KOS Blueprint).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Tất cả các quy trình duyệt Pull Request, luồng nộp RFC và phê duyệt ADR.

---

## 1. HỘI ĐỒNG KIẾN TRÚC VÀ THẨM QUYỀN PHÊ DUYỆT (GOVERNANCE BOARD ROLES)

* **CTO**: Phê duyệt các quyết định chiến lược (Level 3 Ready, Open Source Policy, Breaking Schema Changes).
* **Chief Software Architect**: Chủ tọa Hội đồng Kiến trúc, duyệt RFC, đánh giá chỉ số DQI cho ADR.
* **Knowledge Architect**: Quản trị tính toàn vẹn của PTX KOS, đảm bảo Metadata, Traceability và AI Context Freshness.
* **Lead Engineers**: Trình nộp RFC và phản biện kỹ thuật.

---

## 2. QUY TRÌNH PHÁT THẢO RFC VÀ PHÊ DUYỆT ADR (RFC ➔ ADR WORKFLOW)

```
[Idea / Proposed Change] ──> [RFC Document Submitted] ──> [Board Review & Discussion]
                                                                  │
[Official Implementation] <── [ADR Published (DQI >= 9)] <───[Approved]
```

---

## 3. QUY TRÌNH XỬ LÝ NGOẠI LỆ KIẾN TRÚC (EXCEPTION HANDLING PROTOCOL)

1. Trong trường hợp khẩn cấp (Hotfix Sự cố sản xuất), Kỹ sư được phép cấp **Temporary Architecture Waiver (Ngoại lệ tạm thời)**.
2. Ngoại lệ có hiệu lực tối đa **72 giờ**.
3. Sau 72 giờ, Kỹ sư bắt buộc bổ sung tài liệu ADR và cập nhật Foundation theo đúng **KOS LAW-001**.
