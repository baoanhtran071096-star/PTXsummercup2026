---
id: KOS-001
title: PTX Knowledge Operating System Architecture Blueprint
layer: Foundation
category: System Architecture
status: Approved
version: 1.1.0
owner: Knowledge Architect
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on: []
related_docs:
  - MANIFESTO-001
  - PRINCIPLE-001
  - DNA-001
  - DOMAIN-001
  - GLOSSARY-001
  - AI-GOV-001
ai_context:
  ai_summary: "Bản thiết kế Hệ điều hành Tri thức PTX KOS v1.1.0 cập nhật DQI Scorecard, lộ trình tiến hóa Executable Knowledge và KOS LAW-001."
  key_entities: ["KOSBlueprint", "DQIScorecard", "ExecutableKnowledge"]
  business_terms: ["Decision Quality Index", "Executable Knowledge", "KOS LAW-001"]
  breaking_changes: ["Tất cả ADR mới bắt buộc chấm điểm theo 6 tiêu chí DQI Scorecard"]
  implementation_notes: "Cấu trúc Frontmatter bắt buộc chứa cả Human Metadata và ai_context Block."
  review_checklist: ["DQI Scorecard Compliance", "Machine-Readable Schema Audit"]
tags:
  - knowledge-os
  - architecture
  - metadata
  - dqi
  - executable-knowledge
---

# PTX Knowledge Operating System (PTX KOS)
## Architecture Blueprint & Specification v1.1.0

---

## 1. TỔNG QUAN HỆ ĐIỀU HÀNH TRI THỨC (SYSTEM OVERVIEW)

PTX Knowledge Operating System (PTX KOS) là **Hệ điều hành Tri thức 6 Lớp** hướng tới tầm nhìn **Executable Knowledge Platform** và **Digital Twin of the Product**. 

PTX KOS đóng vai trò là Nguồn Chân lý Duy nhất (Single Source of Truth) cho cả Con người (Architect, PM, Developer, QA, CTO) và các Hệ thống AI Agents (Role-Based AI Architecture).

```
[Knowledge Evolution Roadmap]
Documentation ➔ Knowledge Base ➔ Knowledge OS ➔ Digital Twin ➔ Executable Knowledge ➔ Autonomous Platform
```

---

## 2. SÁU LỚP HỆ THỐNG TRI THỨC (6-LAYER SYSTEM ARCHITECTURE)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. INTELLIGENCE LAYER                                                       │
│    • Knowledge Graph  • AI Context Engine  • Search Index  • Traceability     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. QUALITY LAYER                                                            │
│    • NFR Metrics  • Quality Gates  • DoD / DoR  • DQI Scorecard  • AI Review │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. EXECUTION LAYER                                                          │
│    • Playbooks  • Checklists  • Templates  • Release Guides  • CI/CD Rules    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. GOVERNANCE LAYER                                                         │
│    • KOS LAW-001  • RFC Workflow  • ADR Records  • Standards  • Versioning    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. KNOWLEDGE LAYER                                                          │
│    • Executive Spec  • Business Rules  • Product Spec  • Engineering  • AI  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. FOUNDATION LAYER                                                         │
│    • Manifesto  • Blueprint  • Principles  • Product DNA  • Domain  • Glossary│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. DECISION QUALITY INDEX (DQI SCORECARD CHO ADR)

Mọi Architecture Decision Record (ADR) bắt buộc phải được đánh giá và chấm điểm dựa trên **DQI Scorecard 6 Tiêu chuẩn**:

| Tiêu chuẩn DQI | Thang điểm | Ngưỡng Phê duyệt Tối thiểu |
| :--- | :--- | :--- |
| **1. Business Alignment** | 1 - 10 | **>= 9** (Bám sát Capability & Product DNA) |
| **2. Maintainability** | 1 - 10 | **>= 9** (Code sạch, dễ bảo trì lâu dài) |
| **3. Scalability** | 1 - 10 | **>= 8** (Chịu tải cao, đáp ứng NFR) |
| **4. Simplicity** | 1 - 10 | **>= 8** (Đơn giản, chống Over-engineering) |
| **5. Risk Mitigation** | 1 - 10 | **>= 9** (Chỉ rõ Trade-offs và giải pháp) |
| **6. AI Readability** | 1 - 10 | **>= 9** (Đạt chuẩn Machine-Readable Schema) |

---

## 4. METADATA SPECIFICATION V1.1 (MACHINE-READABLE SCHEMA)

Mọi file Markdown trong PTX KOS bắt buộc chứa định dạng YAML Frontmatter kép gồm **Human Metadata** và **AI Context Block**:

```yaml
---
id: PROD-MATCH-001
title: Match Domain Module Specification
layer: Product
category: Module Spec
status: Approved
version: 1.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - BUS-EVT-001
  - ENG-CON-001
related_docs:
  - ADR-001
ai_context:
  ai_summary: "Tóm tắt ngắn gọn dành riêng cho AI Agents..."
  key_entities: ["Entity1", "Entity2"]
  business_terms: ["Term1", "Term2"]
  breaking_changes: ["Detail..."]
  implementation_notes: "Ghi chú kỹ thuật..."
  review_checklist: ["Check 1", "Check 2"]
tags:
  - match
  - domain
---
```

---

## 5. LỊCH SỬ THAY ĐỔI (REVISION HISTORY)

| Phiên bản | Ngày | Người thực hiện | Tóm tắt thay đổi |
| :--- | :--- | :--- | :--- |
| **1.0.0** | 2026-07-28 | Chief Architect & Knowledge Architect | Khởi tạo Bản thiết kế Kiến trúc PTX KOS v1.0.0. |
| **1.1.0** | 2026-07-28 | CTO & Knowledge Architect | Thể chế hóa DQI Scorecard, KOS LAW-001 và tầm nhìn Executable Knowledge. |
