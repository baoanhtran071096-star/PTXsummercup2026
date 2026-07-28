---
id: KOS-AUTO-006
title: PTX Knowledge API Specification (Knowledge as a Service)
layer: Engineering
category: API Spec
status: Approved
version: 1.0.0
owner: Lead Backend Engineer
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-AUTO-001
  - KOS-AUTO-002
  - KOS-AUTO-003
related_docs:
  - API-SPEC-001
impacts_on: []
ai_context:
  ai_summary: "Đặc tả Knowledge API cung cấp tri thức dưới dạng RESTful Service (/knowledge/modules, /knowledge/events, /knowledge/graph, /knowledge/context/match)."
  key_entities: ["KnowledgeApi", "KnowledgeServiceEndpoint"]
  business_terms: ["Knowledge as a Service", "Knowledge API", "AI Context Streaming"]
  breaking_changes: ["Knowledge API bắt buộc trả về response format bọc Envelope ENG-CON-001"]
  implementation_notes: "Cung cấp caching layer Redis với TTL = 3,600s."
  review_checklist: ["Knowledge API Endpoint Check", "Response Envelope Audit", "Cache Hit Ratio Verification"]
tags:
  - knowledge-api
  - knowledge-as-a-service
  - api-endpoints
  - ai-integration
---

# PTX KNOWLEDGE API SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa toàn bộ danh mục **Knowledge API Endpoints** cung cấp tri thức dưới dạng Dịch vụ (**Knowledge as a Service - KaaS**). Cho phép AI Agents, IDE Assistants, CI/CD Linters và Dashboards truy vấn tri thức hệ thống theo thời gian thực.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-AUTO-001` (Compiler), `KOS-AUTO-002` (Graph Engine), và `KOS-AUTO-003` (Context Builder).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Các công cụ tích hợp AI Agents, IDE Pair-Programming Plugins và Dashboard Frontend.

---

## 1. DANH MỤC ENDPOINTS KNOWLEDGE SERVICE (KNOWLEDGE API REGISTRY)

* **GET `/knowledge/modules`**: Trả về danh sách tất cả các Product & Business Modules kèm metadata.
* **GET `/knowledge/events`**: Trả về danh mục toàn bộ Sự kiện thuộc Event Catalog (`BUS-EVT-001`).
* **GET `/knowledge/contracts`**: Trả về Zod Schemas và API Contract Standards (`ENG-CON-001`).
* **GET `/knowledge/business-rules`**: Trả về danh sách các Quy tắc Nghiệp vụ cốt lõi (`BUS-RULE-001`).
* **GET `/knowledge/graph`**: Trả về cấu trúc Nodes và Edges toàn bộ đồ thị tri thức hệ thống.
* **GET `/knowledge/context/{domain}`**: Trả về gói `AI Context Bundle` đã tối ưu cho 1 domain cụ thể (VD: `/knowledge/context/match`).
