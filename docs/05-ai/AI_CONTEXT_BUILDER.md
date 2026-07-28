---
id: KOS-AUTO-003
title: PTX AI Context Builder Specification (Context as a Product)
layer: AI Governance
category: Automation Spec
status: Approved
version: 1.0.0
owner: AI Governance Designer
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-AUTO-001
  - KOS-AUTO-002
  - AI-GOV-001
related_docs:
  - KOS-AUTO-004
impacts_on: []
ai_context:
  ai_summary: "Đặc tả AI Context Builder đóng gói bối cảnh tri thức 'Context as a Product' cho các Multi-AI Agents (Gemini, Claude, GPT, Cursor) theo từng nhiệm vụ cụ thể."
  key_entities: ["AiContextBuilder", "ContextBundle", "DomainContextPackage"]
  business_terms: ["Context as a Product", "AI Context Bundle", "Token Optimization", "Context Pruning"]
  breaking_changes: ["Nghiêm cấm gửi toàn bộ 300+ raw files cho AI Agent khi chỉ cần context 1 domain"]
  implementation_notes: "Cắt gọt bối cảnh thông minh theo token budget 8k/32k/128k."
  review_checklist: ["Token Budget Compliance Check", "Context Completeness Verification", "Pruning Accuracy Audit"]
tags:
  - ai-context-builder
  - context-as-a-product
  - token-optimization
  - multi-ai-agents
---

# PTX AI CONTEXT BUILDER SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa động cơ **AI Context Builder** thực thi triết lý **"Context as a Product"**. Thay vì ép AI Agents đọc hàng trăm file tài liệu rời rạc, Context Builder tự động trích xuất, hợp nhất và tối ưu hóa bối cảnh tri thức thành một gói **AI Context Bundle** gọn nhẹ theo từng nhiệm vụ.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-AUTO-001` (Compiler), `KOS-AUTO-002` (Graph Engine), và `AI-GOV-001` (AI Constitution).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Các Prompt Contracts và công cụ giao tiếp Multi-AI Agents.

---

## 1. CẤU TRÚC GÓI AI CONTEXT BUNDLE (CONTEXT PACKAGE STRUCTURE)

```json
{
  "bundle_id": "ctx_match_domain_v2",
  "target_domain": "PROD-MATCH-001",
  "generated_at": "2026-07-28T15:30:00Z",
  "token_count": 12500,
  "context": {
    "product_spec": "PROD-MATCH-001 (Full 20-section spec)",
    "business_rules": ["RULE-001", "RULE-005", "RULE-007"],
    "event_catalog": ["EVT-001", "EVT-002"],
    "api_contracts": ["AddGoalContractSchema"],
    "database_schema": ["matches", "match_events", "fn_add_goal"],
    "adr_decisions": ["ADR-001 (Atomic RPC Trade-offs)"],
    "known_risks": ["Potential DB Connection pool contention on high concurrency"]
  }
}
```
