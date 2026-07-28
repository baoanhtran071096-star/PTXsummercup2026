---
id: DESIGN-LANG-001
title: PTX Platform Design Language & Research Framework
layer: Design System & UX Policy
category: Enterprise Sports Platform Design
status: Approved
version: 1.0.0
owner: Ren (Chief Product & Architecture Officer) & Product Owner
reviewer: Claude (Lead Engineer)
created: 2026-07-29
updated: 2026-07-29
---

# PTX PLATFORM DESIGN LANGUAGE & REFERENCE RESEARCH FRAMEWORK
## Định Hướng Thiết Kế "Enterprise Sports Platform" & Khung Tham Chiếu Trải Nghiệm v1.0.0

---

## 1. NGUYÊN TẮC BẢO TỒN DI SẢN (LEGACY PRESERVATION PRINCIPLE)

> [!IMPORTANT]
> **"Preserve User Value, Replace Technical Debt."**  
> — *Chief Product & Architecture Officer (Ren)*

* **GIỮ VỮNG**: Trải nghiệm người dùng (UX), Cảm xúc thể thao, Nhận diện thương hiệu (Navy `#1D3557` & Orange `#F15A24`), và DNA giải đấu di sản.
* **THAY THẾ**: Thay đổi hoàn toàn đơn khối HTML, Hardcoded JS, LocalStorage và Client-side Admin bằng Kiến trúc Next.js 14 App Router, Supabase PostgreSQL, JWT Auth & Stored Procedures.

---

## 2. TRIẾT LÝ THIẾT KẾ: ENTERPRISE SPORTS PLATFORM

PTX Platform không clone nguyên bản bất kỳ ứng dụng nào, mà hòa trộn độc đáo giữa 5 trường phái:

```text
┌────────────────────────────────────────────────────────────────────────┐
│               PTX ENTERPRISE SPORTS PLATFORM DESIGN DNA                │
├───────────────────┬────────────────────────────────────────────────────┤
│ FIFA & UEFA       │ Đẳng cấp Thể thao, Storytelling & Match Center IA  │
│ Flashscore & Sofa │ Live Score Timeline, Match Events & Visual Stats   │
│ Linear & Notion   │ Admin Console UX, Clean Data Views & Keyboard Speed│
│ Stripe & shadcn/ui│ Tiêu chuẩn Component Enterprise & Accessibility    │
│ PTX Summer Cup    │ Thương hiệu Navy `#1D3557` & Orange `#F15A24`      │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 3. KHUNG PHÂN TẦNG NGUỒN THAM CHUYỂN (4 TIERS REFERENCE MATRIX)

### 🥇 Tier S: Sports Experience & Storytelling (Bắt buộc tham khảo)
1. **FIFA & UEFA Champions League**: Tham khảo Match Center, Team Profile, Player Profile & Matchday Storytelling.
2. **Flashscore & Sofascore**: Tham khảo Live Score Timeline, Match Event Icons & Visual Performance Cards.

### 🥈 Tier A: UX Platform & Admin Systems
1. **Linear & Notion**: Tham khảo Admin Portal Sidebar, Database Grid Views, Filter Bar & Command Palette.
2. **Vercel & Stripe**: Tham khảo Audit Log, Settings, Activity Streams & Authentication Forms.

### 🥉 Tier A: Component Infrastructure
1. **shadcn/ui & Radix UI**: Foundation cho UI Components (Dialog, Popover, Command, Dropdown).
2. **Magic UI / Tailwind**: Hiệu ứng motion nhẹ nhàng (Tối đa 20%, không lạm dụng Glassmorphism).

---

## 4. QUY TẮC KHÔNG ĐƯỢC PHÉP (WHAT NOT TO DO)

* ❌ **Không Clone UI**: Không sao chép nguyên bản giao diện của FIFA, UEFA hay Flashscore.
* ❌ **Không Lạm Dụng Animation**: Không sử dụng quá 20% hiệu ứng chuyển động gây rối mắt.
* ❌ **Không Glassmorphism Tràn Lan**: Tránh lạm dụng mờ đục ảnh hưởng tới khả năng đọc chữ trên di động.
* ❌ **Không Landing Page "Vô Dụng"**: Mọi khối thông tin trên Landing Page phải phục vụ hành trình người dùng thực tế.

---

## 5. THỜI LƯỢNG THỰC THI VERTICAL SLICE SPRINT 1 KICKOFF

### 🎯 Objective: Tournament Creation + Team Registration
* **Luồng 1 (Organizer Flow)**: Log in ➔ Create Tournament ➔ Configure Rules ➔ Generate Invite Link.
* **Luồng 2 (Captain Flow)**: Click Invite Link ➔ Enter Team Name & Shirt Color ➔ Upload Roster ➔ Submit.
* **Luồng 3 (Approval Flow)**: Organizer Reviews & Approves ➔ Persisted to Supabase PostgreSQL DB via RPC.

### 📊 Metric Báo Cáo Product Validation Sprint 1:
1. **Người dùng nhận giá trị**: Ban tổ chức & Đội trưởng.
2. **Thời gian tiết kiệm**: Tạo giải < 10 phút, Đăng ký đội < 2 phút.
3. **Bằng chứng kiểm thử**: Pass 100% Contract Test Suite (`npm run test`).
