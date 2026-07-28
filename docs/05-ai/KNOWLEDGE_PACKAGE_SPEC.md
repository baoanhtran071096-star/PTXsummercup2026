---
id: KOS-AUTO-004
title: PTX Knowledge Package Protocol Specification
layer: AI Governance
category: Protocol Spec
status: Approved
version: 1.0.0
owner: Knowledge Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-AUTO-001
  - KOS-AUTO-003
related_docs:
  - KOS-AUTO-006
impacts_on: []
ai_context:
  ai_summary: "Quy chuẩn Giao thức Đóng gói Gói Tri thức PTX Knowledge Package (.pkg.json) chứa version, SHA-256 checksum, documents index, graph, và dependencies."
  key_entities: ["KnowledgePackage", "PackageManifest", "ChecksumVerifier"]
  business_terms: ["Knowledge Package Protocol", "Package Manifest", "SHA-256 Checksum"]
  breaking_changes: ["Gói tri thức vi phạm Checksum sẽ bị từ chối nạp vào hệ thống AI"]
  implementation_notes: "Bọc mã mã hóa SHA-256 xác thực tính toàn vẹn tri thức."
  review_checklist: ["Checksum Validation Check", "Manifest Field Integrity Audit"]
tags:
  - knowledge-package
  - protocol
  - checksum-verification
  - package-spec
---

# PTX KNOWLEDGE PACKAGE SPECIFICATION

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Quy định Giao thức Chuẩn hóa Đóng gói Tri thức **PTX Knowledge Package Protocol (`ptx-knowledge.pkg.json`)**. Cho phép xuất bản, chia sẻ và đồng bộ gói tri thức phiên bản cao giữa các môi trường phát triển và nhiều hệ thống AI Agents độc lập.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-AUTO-001` (Compiler) và `KOS-AUTO-003` (Context Builder).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Trình xuất bản Knowledge Package Exporter và công cụ xác thực Checksum.

---

## 1. MẪU PROTOCOL MANIFEST (PACKAGE SPECIFICATION)

```json
{
  "package_name": "@ptx/foundation-knowledge-base",
  "version": "2.0.0",
  "checksum_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "generator_version": "ptx-kos-compiler-v1.0.0",
  "generated_at": "2026-07-28T15:30:00Z",
  "summary": {
    "total_documents": 25,
    "total_rules": 7,
    "total_events": 5,
    "total_contracts": 1
  },
  "documents_manifest": [
    {
      "id": "PROD-MATCH-001",
      "file_path": "docs/03-product/PROD-MATCH-001.md",
      "version": "2.0.0",
      "hash": "a1b2c3d4..."
    }
  ]
}
```
