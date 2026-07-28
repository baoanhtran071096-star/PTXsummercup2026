---
id: KOS-AUTO-005
title: PTX Knowledge CI/CD & Automated Verification Pipeline
layer: AI Governance
category: Automation Spec
status: Approved
version: 1.0.0
owner: Lead DevOps Engineer
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-AUTO-001
  - KOS-AUTO-002
  - ENG-FIT-001
related_docs:
  - QUAL-MODEL-001
impacts_on: []
ai_context:
  ai_summary: "Đặc tả Quy trình CI/CD Tự động hóa Linter tri thức (npm run docs:verify, docs:index, docs:graph, docs:trace) chặn PR lỗi trong GitHub Actions."
  key_entities: ["KnowledgeCiCd", "DocsLinter", "TraceabilityVerifier"]
  business_terms: ["Knowledge CI/CD", "Docs Verification", "Automation Scripts", "Linter Pipeline"]
  breaking_changes: ["PR bị tự động Block nếu lệnh docs:verify phát hiện hỏng liên kết hoặc thiếu Metadata"]
  implementation_notes: "Script Node.js chạy trong GitHub Actions workflow."
  review_checklist: ["CI Script Execution Test", "Linter Error Blocking Check", "Metadata Verification Audit"]
tags:
  - knowledge-ci-cd
  - verification-pipeline
  - docs-verify
  - automation-scripts
---

# PTX KNOWLEDGE CI/CD SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu me này giải quyết vấn đề gì?**
   * Quy định toàn bộ Quy trình Tự động hóa **Knowledge CI/CD Pipeline**. Cung cấp bộ câu lệnh thực thi kiểm thử tri thức (`npm run docs:...`) chạy tự động trong CI/CD Pipeline để bảo đảm tính chính xác, không có liên kết hỏng, và 100% tài liệu có metadata chuẩn hóa.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-AUTO-001` (Compiler), `KOS-AUTO-002` (Graph Engine), và `ENG-FIT-001` (Fitness Functions).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Các tệp tệp script `package.json` và GitHub Actions Workflows (`.github/workflows/knowledge-ci.yml`).

---

## 1. DANH MỤC CÁC CÂU LỆNH KNOWLEDGE CI/CD (COMMANDS REGISTRY)

| Command Script | Mục đích & Phạm vi kiểm tra | Điều kiện Đạt (Pass Criteria) |
| :--- | :--- | :--- |
| **`npm run docs:verify`** | Kiểm tra YAML Metadata, Broken Links, Duplicate Primary Key IDs, và thiếu khối `ai_context`. | **0 Errors, 0 Warnings** |
| **`npm run docs:index`** | Tự động cập nhật lại Search Index (`search_index.json`). | Index file được ghi nhận thành công |
| **`npm run docs:graph`** | Kiểm tra vòng lặp liên kết (Circular Dependency) và build lại `knowledge_graph.json`. | Đồ thị hợp lệ, không chứa Orphan Nodes |
| **`npm run docs:trace`** | Kiểm tra bản đồ truy vết hai chiều `Requirement ➔ Rule ➔ Event ➔ API ➔ DB ➔ Test`. | Coverage = 100% |
| **`npm run docs:publish`** | Biên dịch và đóng gói `PTX Knowledge Package` phát hành lên CDN/Doc Site. | Package Checksum SHA-256 khớp 100% |
