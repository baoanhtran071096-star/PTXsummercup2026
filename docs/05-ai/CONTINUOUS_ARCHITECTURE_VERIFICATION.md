---
id: CAV-001
title: PTX Continuous Architecture Verification & FQI Specification
layer: AI Governance
category: Verification Spec
status: Specified
version: 1.0.0
owner: Lead System Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-AUTO-005
  - ENG-FIT-001
related_docs:
  - ARCHITECTURE_DASHBOARD.md
  - QUAL-MODEL-001
impacts_on: []
verification:
  automated: true
  integration_tests: true
  last_verified: 2026-07-28
evidence:
  implementation:
    - "tools/knowledge/compiler/build.ts"
    - "tests/contract/match-api-contract.test.ts"
  tests:
    - "tests/contract/match-api-contract.test.ts"
  metrics:
    - "fqi_index_score"
  dashboards:
    - "ARCHITECTURE_DASHBOARD.md"
  source_files:
    - "docs/05-ai/CONTINUOUS_ARCHITECTURE_VERIFICATION.md"
ai_context:
  ai_summary: "Đặc tả Quy trình Xác minh Kiến trúc Liên tục (Continuous Architecture Verification - CAV), PR Architecture Compliance Report và Chỉ số FQI."
  key_entities: ["ContinuousArchitectureVerification", "ArchitectureComplianceReport", "FoundationQualityIndex"]
  business_terms: ["CAV Pipeline", "FQI Metric", "Architecture Compliance Report", "Proof over Report"]
  breaking_changes: ["PR bị từ chối Merge nếu FQI < 95% hoặc vi phạm CAV Pipeline"]
  implementation_notes: "Sinh file architecture_report.json tự động trong CI build."
  review_checklist: ["CAV Pipeline Integration Check", "FQI Metric Audit", "Compliance Report Verification"]
tags:
  - cav-pipeline
  - fqi-metric
  - continuous-verification
  - architecture-report
---

# PTX CONTINUOUS ARCHITECTURE VERIFICATION (CAV)

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa Quy trình **Continuous Architecture Verification (CAV)** và công thức tính chỉ số **Foundation Quality Index (FQI)**. Đảm bảo tính nhất quán kiến trúc được tự động kiểm chứng liên tục qua mỗi Pull Request theo nguyên tắc *"Proof over Report"*.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-AUTO-005` (Knowledge CI/CD) và `ENG-FIT-001` (Fitness Functions).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * GitHub Actions Workflows và Dashboard Analytics API.

---

## 1. LUỒNG CAV PIPELINE TRONG CI/CD

```
[Commit / PR] ──> [1. Knowledge Verify] ──> [2. Code Gen] ──> [3. Build] ──> [4. Tests] ──> [5. Arch Verify] ──> [6. Evidence Collection] ──> [7. Report]
```

---

## 2. CÔNG THỨC CHỈ SỐ FOUNDATION QUALITY INDEX (FQI)

$$\text{FQI} = \frac{\text{Knowledge Coverage} + \text{Arch Compliance} + \text{Gen Coverage} + \text{Runtime Verification} + \text{Freshness} + \text{AI Readiness}}{6}$$

* **FQI >= 95%**: PASS (Sẵn sàng Merge).
* **FQI < 95%**: FAIL (PR bị từ chối, yêu cầu cập nhật Foundation hoặc sửa code).
