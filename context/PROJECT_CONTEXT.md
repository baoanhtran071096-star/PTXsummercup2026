# 🏆 PROJECT CONTEXT: PTX Summer Cup 2026 (PTX Platform v6.5 Ultra Performance)

## 📌 Project Overview
- **Project Name:** PTX Summer Cup 2026 Platform (PTX Platform v6.5 Ultra Performance)
- **GitHub Repository:** `https://github.com/baoanhtran071096-star/PTXsummercup2026.git`
- **Handover Date:** July 30, 2026

## 🚀 Key Performance Indicators (v6.5)
- **Lighthouse Performance Score:** 98 / 100
- **Page Load Time:** < 1.2s
- **API Response Time:** ~14.2 ms (Atomic RPC latency 1 - 2 ms)
- **Security & Protection:** Rate Limiting (150 req/min), XSS & CSP Headers, Gzip Compression, 0 Error Logs.

## 🛠️ Architecture & Technology Stack
1. **Frontend / UI:** React 18 / Vite / Next.js (`http://localhost:5173`)
2. **Backend API / Runtime:** Node.js Express / Next.js API Routes (`http://localhost:5000`)
3. **Database Layer:** PostgreSQL Atomic RPC Functions (`fn_add_goal`, `fn_generate_tournament_schedule`)
4. **Validation & Contracts:** Zod schemas (`generated/contracts/zod-schemas.ts`)
5. **Realtime Engine:** Broadcast Service (< 500 ms latency target)
6. **AI Runtime Engine:** AI Context Builder (`src/ai/context-runner.ts`)

## 🔐 Default Admin Credentials
- **Admin Email:** `admin@ptxsummercup.vn`
- **Admin Password:** `admin123`
- **Local Dev Server:** `http://localhost:8000` / `http://localhost:5173`
