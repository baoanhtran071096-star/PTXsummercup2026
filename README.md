# PTX Summer Cup 2026 — AI-Native, Free-by-Design

> 🏆 Nền tảng quản lý giải đấu bóng đá nội bộ của PTX Group  
> 📅 Launch: 05/08/2026 | 🏛️ Architecture Frozen: 31/07/2026

---

## 🚀 Quick Start (One Command Setup)

```bash
# 1. Clone repo
git clone https://github.com/baoanhtran071096-star/PTXsummercup2026.git
cd PTXsummercup2026

# 2. Cài dependencies
npm install

# 3. Copy biến môi trường
cp .env.example .env
# → Điền GEMINI_API_KEY và SUPABASE keys vào .env

# 4. Chạy local
npm run dev
# → http://localhost:8000
```

---

## 🏛️ Kiến trúc

Xem chi tiết tại [`docs/architecture.md`](docs/architecture.md)

**Mô hình:** AI-Native, Free-by-Design  
**AI Core:** Gemini (Google) — Free Tier  
**Database:** Supabase (PostgreSQL) — Free Tier  
**CDN:** Cloudflare — Free Tier  
**CI/CD:** GitHub Actions — Free Tier  

---

## 📁 Cấu trúc chính

| Thư mục | Mô tả |
|---|---|
| `ai-core/` | PTX AI Core — Orchestrator, Engines, Workflows |
| `applications/` | Website, Admin Panel, Media Center |
| `data-platform/` | Supabase DB, Storage, API, Audit |
| `infrastructure/` | Cloudflare, GitHub Actions, Monitoring |
| `docs/` | Tài liệu kỹ thuật & người dùng |
| `context/` | AI Memory Context (session state) |
| `tests/` | Unit, Security, Phase tests |

---

## 🔐 Admin Access

- **URL:** Mở trang web → Click `🔐 Quản trị` (góc dưới trái)
- **Username:** `admin`
- **Password:** `admin123`
- **Session:** 30 phút inactivity timeout

---

## 📋 Docs

- [📐 Architecture](docs/architecture.md)
- [📖 User Guide](docs/user-guide.md) *(nếu có)*
- [🗺️ Roadmap](docs/roadmap.md) *(nếu có)*

---

## 👥 Team

| Vai trò | Người phụ trách |
|---|---|
| Chủ trì Thiết kế | PTX Group |
| Architecture | AI-Assisted |
| Development | PTX Dev Team |

---

*PTX Sports Platform v7.0 · AI-Native, Free-by-Design · 2026*