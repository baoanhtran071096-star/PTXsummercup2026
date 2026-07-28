---
id: KOS-AUTO-007
title: PTX Architecture Health Dashboard & Knowledge KPI Specification
layer: Foundation
category: Quality Dashboard
status: Approved
version: 1.0.0
owner: Knowledge Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-001
  - KOS-AUTO-005
related_docs:
  - QUAL-MODEL-001
  - ENG-FIT-001
impacts_on: []
ai_context:
  ai_summary: "Đặc tả Bảng theo dõi Sức khỏe Tri thức (Architecture Health Dashboard) quản lý 8 chỉ số KPI chất lượng tri thức tiêu chuẩn Level 3."
  key_entities: ["ArchitectureDashboard", "KnowledgeKpiMetrics", "HealthScorecard"]
  business_terms: ["Architecture Dashboard", "Knowledge Health Score", "KPI Metrics", "Level 3 Maturity"]
  breaking_changes: ["Target KPI bắt buộc đạt 100% trên toàn bộ 8 chỉ tiêu"]
  implementation_notes: "Render dữ liệu KPI realtime qua /knowledge/dashboard-stats API."
  review_checklist: ["KPI Threshold Verification", "Dashboard Metric Audit", "Fitness Pass Rate Check"]
tags:
  - architecture-dashboard
  - knowledge-kpi
  - health-scorecard
  - enterprise-level-3
---

# PTX ARCHITECTURE HEALTH DASHBOARD

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa Bảng theo dõi Sức khỏe Kiến trúc & Tri thức **(Architecture Health Dashboard)**. Dashboard này đo lường và hiển thị thời gian thực 8 chỉ số KPI Chất lượng Tri thức nhằm đảm bảo hệ thống duy trì cấp độ trưởng thành **Enterprise Grade – Level 3 Maturity**.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-001` (KOS Blueprint), `QUAL-MODEL-001` (Quality Model), và `KOS-AUTO-005` (Knowledge CI/CD).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Màn hình Dashboard quản trị hệ thống và báo cáo Health Check trong CI/CD Build.

---

## 1. MA TRẬN 8 CHỈ SỐ KPI SỨC KHỎE TRI THỨC (KNOWLEDGE HEALTH KPIS)

| Chỉ số KPI | Mục tiêu (Target) | Ngưỡng Cảnh báo (Warning) | Ngưỡng Báo động (Critical) |
| :--- | :--- | :--- | :--- |
| **1. Metadata Coverage** | **100%** | < 100% | < 95% |
| **2. Traceability Coverage** | **100%** | < 100% | < 90% |
| **3. Broken Links Count** | **0** | > 0 | > 5 |
| **4. Duplicate IDs Count** | **0** | > 0 | > 0 |
| **5. ADR Coverage** | **100%** | < 100% | < 95% |
| **6. Business Rule Coverage**| **100%** | < 100% | < 90% |
| **7. AI Context Coverage** | **100%** | < 100% | < 95% |
| **8. Fitness Pass Rate** | **100%** | < 100% | < 100% (PR Blocked) |

---

## 2. KNOWLEDGE HEALTH SCORE (ĐIỂM SỨC KHỎE TỔNG HỢP)

Công thức tính Điểm Sức khỏe Tri thức tổng hợp (`Health Score`):
$$\text{Health Score} = \frac{\sum_{i=1}^{8} \text{KPI}_i}{8} \times 100\%$$

* **100%**: Certified Enterprise Level 3 Platform.
* **< 95%**: Cảnh báo cần chạy `npm run docs:verify` để bổ sung tri thức còn thiếu.
