---
id: OP-PLAYBOOK-001
title: PTX Platform v1.0.0 — Production Operational Playbook & Rollback Guide
layer: Operations & Maintenance
category: Operational Playbook
status: Approved Standard
version: 1.0.0
owner: Ren (Chief Product & Architecture Officer) & Release Manager
reviewer: Product Owner
created: 2026-07-29
updated: 2026-07-29
---

# PTX PLATFORM — PRODUCTION OPERATIONAL PLAYBOOK v1.0.0

---

## 🔄 1. CẨM NANG KHÔI PHỤC KHI CÓ SỰ CỐ (ROLLBACK GUIDE)

```text
[SỰ CỐ NGHIÊM TRỌNG] ➔ DỪNG TRAFFIC API ➔ ROLLBACK GIT COMMIT ➔ POINT-IN-TIME DB RESTORE
```

1. **Bước 1**: Đổi hướng CDN Traffic về trang bảo trì tạm thời.
2. **Bước 2**: Rollback Git Release Tag về v0.5.1 qua Git CLI:
   ```bash
   git checkout tags/v0.5.1
   ```
3. **Bước 3**: Khôi phục trạng thái PostgreSQL Database tại thời điểm backup gần nhất (Supabase Point-In-Time Recovery - PITR).

---

## 📋 2. DANH SÁCH GIỚI HẠN ĐÃ BIẾT (KNOWN ISSUES & LIMITATIONS)

* **Giới hạn File Size Media**: Tối đa 50MB per PDF/Video file.
* **Giới hạn Realtime Event Bus**: 10,000 Concurrent WebSocket Connections per node.
* **Mạng xã hội**: Chưa hỗ trợ OIDC Social Login (Facebook/Google) ở v1.0.0 (Dự kiến ở v1.1.0).

---

## 🛠️ 3. KẾ HOẠCH HỖ TRỢ BẢO TRÌ VÀ SLA (POST-RELEASE SUPPORT SLA)

| Mức độ Sự cố (Severity) | Thời gian Phản hồi (Response SLA) | Thời gian Xử lý (Resolution SLA) |
| :--- | :--- | :--- |
| **P1 - System Down** | < 15 Phút | < 2 Giờ |
| **P2 - Major Feature Impact** | < 1 Giờ | < 8 Giờ |
| **P3 - Minor Bug** | < 24 Giờ | < 48 Giờ |
