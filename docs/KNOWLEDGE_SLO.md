---
id: QUAL-SLO-001
title: PTX Knowledge Service Level Objectives (Knowledge SLO Specification)
layer: Foundation
category: Quality Standard
status: Specified
version: 1.0.0
owner: Knowledge Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-001
  - KOS-AUTO-007
related_docs:
  - QUAL-MODEL-001
  - KOS-AUTO-005
impacts_on: []
verification:
  automated: true
  integration_tests: false
  last_verified: 2026-07-28
evidence:
  implementation:
    - "docs/00-foundation/ARCHITECTURE_DASHBOARD.md"
  tests:
    - "docs/05-ai/KNOWLEDGE_CI_CD.md"
  metrics:
    - "knowledge_slo_pass_rate"
  dashboards:
    - "ARCHITECTURE_DASHBOARD.md"
  source_files:
    - "docs/00-foundation/KNOWLEDGE_SLO.md"
ai_context:
  ai_summary: "Đặc tả Mục tiêu Cấp độ Dịch vụ Tri thức (Knowledge SLO) quy định các chỉ số cam kết vận hành như Metadata Coverage ≥ 99%, Broken Links = 0, Freshness < 24h."
  key_entities: ["KnowledgeSlo", "SloTargetMetric", "SloErrorBudget"]
  business_terms: ["Knowledge SLO", "SLO Target", "Context Freshness", "Error Budget"]
  breaking_changes: ["Nếu Error Budget cạn kiệt, toàn bộ PR tính năng mới bị dừng lại để ưu tiên sửa tri thức"]
  implementation_notes: "Đo lường tự động qua npm run docs:verify trong CI."
  review_checklist: ["SLO Compliance Audit", "Error Budget Verification", "Freshness Metric Check"]
tags:
  - knowledge-slo
  - quality-standards
  - slo-targets
  - error-budget
---

# PTX KNOWLEDGE SERVICE LEVEL OBJECTIVES (SLO)

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa các **Mục tiêu Cấp độ Dịch vụ Tri thức (Knowledge Service Level Objectives - SLO)**. Cam kết chất lượng vận hành của chính hệ thống tri thức PTX Foundation.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-001` (Blueprint) và `KOS-AUTO-007` (Architecture Dashboard).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Quy trình kiểm thử CI/CD Linter và Health Dashboard.

---

## 1. CAM KẾT MỤC TIÊU KNOWLEDGE SLOS (KNOWLEDGE SLO TARGETS)

| Chỉ số SLO Objective | Mục tiêu Cam kết (SLO Target) | Cảnh báo Vi phạm |
| :--- | :--- | :--- |
| **1. Metadata Coverage** | **>= 99.0%** | < 99.0% |
| **2. Broken Links Count** | **0 Links** | > 0 Links |
| **3. Duplicate Primary IDs** | **0 IDs** | > 0 IDs |
| **4. Traceability Coverage** | **>= 99.0%** | < 99.0% |
| **5. AI Context Freshness** | **< 24 Giờ** (được cập nhật mới trong 24h) | >= 24h |
| **6. Knowledge Build Success**| **>= 99.9%** | < 99.9% |

---

## 2. QUY TẮC ERROR BUDGET CHO TRI THỨC (KNOWLEDGE ERROR BUDGET)

* Nếu **Knowledge Error Budget** giảm xuống dưới ngưỡng (Ví dụ: Broken links > 0 hoặc Metadata Coverage < 99%), toàn bộ PR phát triển tính năng mới sẽ bị **tạm dừng (Blocked)** để tập trung sửa đổi và cập nhật tài liệu tri thức theo đúng **KOS LAW-001**.
