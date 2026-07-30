# 🏛️ KIẾN TRÚC CHÍNH THỨC – PTX SUMMER CUP 2026
## AI-Native, Free-by-Design

> **Trạng thái: ĐÃ ĐÓNG BĂNG – 31/07/2026**  
> Chủ trì Thiết kế đã ký & phê duyệt

---

## 🧠 Vision Chính thức

> **PTX Summer Cup** là nền tảng quản lý giải đấu bóng đá **AI-Native, Free-by-Design**, ưu tiên công nghệ miễn phí, AI tích hợp xuyên suốt, dữ liệu tập trung và tự động hóa quy trình, nhằm tạo ra một hệ thống dễ vận hành, dễ mở rộng và không phụ thuộc vào hạ tầng trả phí.

---

## 🗺️ Sơ đồ Kiến trúc Tổng thể

```
                    PTX AI CORE (Trung tâm)
         ─────────────────────────────────────────────────
                     AI ORCHESTRATOR
           Điều phối, quyết định Engine nào được gọi
     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
     │ Chat     │ │ Vision   │ │ Content  │ │ Search   │
     │ Engine   │ │ Engine   │ │ Engine   │ │ Engine   │
     └──────────┘ └──────────┘ └──────────┘ └──────────┘
     ┌──────────┐ ┌──────────────────────────────────────┐
     │Analytics │ │      Automation Engine               │
     │Engine    │ │      (Workflow, Notification)        │
     └──────────┘ └──────────────────────────────────────┘

         ┌──────────────────────────────────────────┐
         │   Capability Registry │ Workflow Templates│ Context Engine
         └──────────────────────────────────────────┘
         ┌──────────────────────────────────────────┐
         │   Tool Registry │ Prompt Library │ Memory │
         └──────────────────────────────────────────┘
                         Provider Layer (Gemini)
                         Governance (Evolution Backlog)
         ─────────────────────────────────────────────────
                     APPLICATION LAYER
              Website (Public) │ Admin Panel │ Media Center
         ─────────────────────────────────────────────────
                       DATA PLATFORM
              Supabase (DB) │ Storage (Images) │ Audit Trail
         ─────────────────────────────────────────────────
                      INFRASTRUCTURE
              Cloudflare (CDN) │ GitHub Actions │ Monitor
```

---

## 🧩 3 Thành phần AI Mới (Đã triển khai)

### 1. AI Orchestrator
**File:** [`ai-core/orchestrator/orchestrator.ts`](../ai-core/orchestrator/orchestrator.ts)

- Nhận mọi request AI từ Application Layer
- Phân loại → tra cứu Capability Registry → chạy Workflow hoặc gọi Engine trực tiếp
- Tổng hợp kết quả → trả về response chuẩn

### 2. AI Capability Registry
**File:** [`ai-core/capability/registry.ts`](../ai-core/capability/registry.ts)

| Capability | Engine | Cost Tier |
|---|---|---|
| `chat` | ChatEngine | low |
| `vision` | VisionEngine | medium |
| `content` | ContentEngine | low |
| `search` | SearchEngine | free |
| `analytics` | AnalyticsEngine | free |
| `automation` | AutomationEngine | free |

### 3. AI Workflow Templates
**File:** [`ai-core/workflows/templates.ts`](../ai-core/workflows/templates.ts)

| Template ID | Trigger | Steps |
|---|---|---|
| `upload-image` | image.uploaded | vision → content → automation |
| `match-result` | match.result.entered | analytics → content → automation |
| `new-player` | player.created | search → vision → content → automation |
| `news-generation` | news.generate.requested | content → automation |

---

## 📁 Cấu trúc Thư mục Chính thức

```
PTX-SUMMER-CUP-2026/
├── ai-core/                    # PTX AI CORE
│   ├── orchestrator/           ✅ Hoàn thành
│   ├── engines/                ✅ 6 engines (stub → impl)
│   ├── capability/             ✅ Hoàn thành
│   ├── workflows/              ✅ Hoàn thành
│   ├── context/                🔄 Cần implement
│   ├── tools/                  🔄 Cần implement
│   ├── prompts/                🔄 Cần implement
│   ├── memory/                 🔄 Cần implement
│   ├── providers/              🔄 Cần implement (Gemini)
│   └── governance/             📋 Evolution Backlog
├── applications/               🔄 Cần implement
│   ├── website/                (React + Vite)
│   ├── admin/                  (React Admin Panel)
│   └── media-center/
├── data-platform/              🔄 Cần implement
│   ├── supabase/
│   ├── storage/
│   ├── api/
│   └── audit/
├── infrastructure/             🔄 Cần implement
├── shared/                     📋 Evolution Backlog
└── docs/                       ✅ Đang cập nhật
```

---

## 📋 Evolution Backlog (13 Hạng mục – Sau Launch 05/08/2026)

| # | Hạng mục | Mô tả |
|---|---|---|
| 1 | AI Orchestrator | Điều phối các AI Engine *(scaffold đã tạo)* |
| 2 | AI Capability Registry | Cho AI biết năng lực *(scaffold đã tạo)* |
| 3 | AI Workflow Templates | Chuẩn hóa quy trình AI *(scaffold đã tạo)* |
| 4 | AI Governance | Prompt versioning, limits, fallback |
| 5 | Media Lifecycle | Capture → Upload → … → Delete |
| 6 | Unified Search | Tìm kiếm xuyên suốt |
| 7 | Notification Center | Thông báo cho BTC |
| 8 | Audit Trail | Lịch sử thay đổi dữ liệu |
| 9 | AI Cost Guard | Theo dõi quota Gemini |
| 10 | Feature Flags | Bật/tắt tính năng AI |
| 11 | Plugin-ready | Provider interface |
| 12 | Asset Relationship | Liên kết ảnh với dữ liệu |
| 13 | Design Tokens | Chuẩn hóa giao diện |

---

## ⚙️ 7 Nguyên tắc Chiến lược

1. **Free** — Ưu tiên công nghệ miễn phí (Supabase, Cloudflare, GitHub Actions, Gemini Free Tier)
2. **AI** — AI tích hợp xuyên suốt mọi quy trình, không phải add-on
3. **Data** — Dữ liệu tập trung, một nguồn sự thật duy nhất
4. **Media** — Quản lý media có lifecycle rõ ràng
5. **Automation** — Tự động hóa tối đa quy trình BTC
6. **Simple** — Đơn giản để vận hành, một lệnh để chạy
7. **Open** — Kiến trúc mở, dễ mở rộng, dễ tích hợp

---

> 🔒 **Kiến trúc đã đóng băng.** Mọi thay đổi lớn phải qua quy trình phê duyệt của Chủ trì Thiết kế.
