---
id: KOS-AUTO-001
title: PTX Knowledge Compiler Architecture Specification
layer: AI Governance
category: Automation Spec
status: Approved
version: 1.0.0
owner: Knowledge Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-001
  - MANIFESTO-001
related_docs:
  - KOS-AUTO-002
  - KOS-AUTO-003
  - KOS-AUTO-004
impacts_on:
  - KOS-AUTO-005
  - KOS-AUTO-006
ai_context:
  ai_summary: "Đặc tả Trình biên dịch Tri thức (Knowledge Compiler) biến Markdown Knowledge Objects thành các Artifacts như AI Context, Graph Index, API Catalog, Search Index và Documentation Site."
  key_entities: ["KnowledgeCompiler", "AstParser", "ArtifactGenerator"]
  business_terms: ["Knowledge Compiler", "Executable Knowledge", "Knowledge Artifacts"]
  breaking_changes: ["Tài liệu thiếu Metadata sẽ bị Trình biên dịch loại bỏ khỏi Build Artifacts"]
  implementation_notes: "Biên dịch qua AST parser trong < 2,000ms cho 300+ tài liệu."
  review_checklist: ["AST Parsing Verification", "Artifact Integrity Audit", "Compiler Performance Check"]
tags:
  - knowledge-compiler
  - automation
  - artifact-generation
  - executable-knowledge
---

# PTX KNOWLEDGE COMPILER SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa Kiến trúc **Knowledge Compiler (Trình biên dịch Tri thức)**. Chuyển đổi các file Markdown Knowledge Objects trong `docs/` thành các **Artifacts đầu ra** phục vụ cho AI Agents, Search Engines, Dashboard, và Static Documentation Sites.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-001` (KOS Blueprint) và `MANIFESTO-001` (Tuyên ngôn).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Các công cụ Knowledge CI/CD Scripts, Knowledge Graph Engine và AI Context Builder.

---

## 1. PHÙ NGUYÊN LÝ BIÊN DỊCH TRI THỨC (COMPILATION PIPELINE)

```
[Markdown Knowledge Objects (docs/)]
                 │
                 ▼
     [YAML AST Parser & Validator]
                 │
                 ▼
       [Knowledge Graph Engine]
                 │
                 ├──> [Artifact 1: AI Context Packages]
                 ├──> [Artifact 2: Knowledge Graph Index (JSON)]
                 ├──> [Artifact 3: API & Event Catalog Index]
                 ├──> [Artifact 4: Traceability Matrix Report]
                 ├──> [Artifact 5: Algolia/FlexSearch Index]
                 └──> [Artifact 6: Static Site (Docusaurus)]
```

---

## 2. DANH MỤC ARTIFACTS ĐẦU RA (GENERATED ARTIFACTS REGISTRY)

1. `ai_context_bundle.json`: Gói bối cảnh tối ưu phục vụ nạp thẳng cho Gemini / Claude / GPT / Cursor.
2. `knowledge_graph.json`: Tập hợp tất cả các Nodes và Edges liên kết 360°.
3. `api_catalog_generated.json`: Danh mục API Contracts được sinh tự động từ các Zod Schemas.
4. `traceability_matrix.json`: Bản đồ truy vết hai chiều `Requirement ➔ Rule ➔ Event ➔ API ➔ DB ➔ Test`.
5. `search_index.json`: Thư viện chỉ mục phục vụ tìm kiếm Full-text Search siêu tốc.
