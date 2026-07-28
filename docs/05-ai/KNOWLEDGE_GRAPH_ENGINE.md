---
id: KOS-AUTO-002
title: PTX Knowledge Graph Engine Architecture Specification
layer: AI Governance
category: Automation Spec
status: Approved
version: 1.0.0
owner: Knowledge Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-AUTO-001
  - KOS-001
related_docs:
  - KOS-AUTO-003
  - KOS-AUTO-006
impacts_on: []
ai_context:
  ai_summary: "Đặc tả Động cơ Tự động sinh Đồ thị Tri thức (Knowledge Graph Engine) quét các liên kết depends_on, related_docs, và impacts_on để tạo Nodes, Edges và Path Analysis."
  key_entities: ["KnowledgeGraphEngine", "GraphNode", "GraphEdge", "GraphPath"]
  business_terms: ["Knowledge Graph", "Graph Nodes", "Graph Edges", "Dependency Graph"]
  breaking_changes: ["Node bị mồ côi (Orphan Node) không có liên kết sẽ bị cảnh báo Linter"]
  implementation_notes: "Xuất file output graph.json trong < 500ms."
  review_checklist: ["Graph Node Coverage Check", "Circular Dependency Audit", "Graph JSON Schema Check"]
tags:
  - knowledge-graph
  - graph-engine
  - nodes-edges
  - dependency-analysis
---

# PTX KNOWLEDGE GRAPH ENGINE SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa Động cơ Tự động quét và xây dựng **Knowledge Graph Index (Đồ thị Tri thức)** từ các liên kết `depends_on`, `related_docs`, `impacts_on`, `related_api`, `related_db` giữa tất cả các Knowledge Objects.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-AUTO-001` (Knowledge Compiler) và `KOS-001` (KOS Blueprint).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Knowledge API `/knowledge/graph`, Search Indexer và AI Context Builder.

---

## 1. CẤU TRÚC GRAPH NODE VÀ EDGE (GRAPH DATA MODEL)

```json
{
  "nodes": [
    {
      "id": "PROD-MATCH-001",
      "type": "ProductModule",
      "label": "Match Operations Domain",
      "layer": "Product"
    },
    {
      "id": "ADR-001",
      "type": "ADR",
      "label": "PostgreSQL RPC Atomic Operations",
      "layer": "Governance"
    }
  ],
  "edges": [
    {
      "source": "PROD-MATCH-001",
      "target": "ADR-001",
      "relation": "DEPENDS_ON"
    }
  ]
}
```

---

## 2. KHẢ NĂNG PHÂN TÍCH TÁC ĐỘNG (IMPACT ANALYSIS ENGINE)

Khi một Knowledge Object thay đổi (Ví dụ `BUS-RULE-001`), Graph Engine tự động duyệt toàn bộ cây đồ thị để tìm các Node bị ảnh hưởng gián tiếp:
`BUS-RULE-001 ➔ ADR-001 ➔ PROD-MATCH-001 ➔ DB-SCHEMA-001 ➔ API-SPEC-001` và thông báo cho Kỹ sư/AI Reviewer.
