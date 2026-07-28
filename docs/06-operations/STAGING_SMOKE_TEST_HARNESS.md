---
id: OP-SMOKE-001
title: PTX Platform v1.0.0 — Staging & Production Smoke Test Protocol
layer: Operations & Deployment
category: Smoke Testing
status: Approved Standard
version: 1.0.0
owner: Ren (Chief Product & Architecture Officer) & Release Manager
reviewer: Product Owner
created: 2026-07-29
updated: 2026-07-29
---

# PTX PLATFORM — STAGING & PRODUCTION SMOKE TEST PROTOCOL (v1.0.0)

---

## ⚡ SMOKE TEST VERIFICATION CHECKLIST (PRE-FLIGHT)

1. **Authentication & Authorization Verification**:
   - Verify JWT Bearer token generation & claims parsing (`ORGANIZER`, `REFEREE`, `PLAYER`).
2. **Realtime Event Bus & Supabase RPC Verification**:
   - Verify execution of `fn_record_match_event` and event broadcast latency (< 1ms).
3. **Enterprise DAM Storage Adapter Verification**:
   - Verify image upload to `avatars`, `logos`, `banners` buckets.
   - Verify dynamic `AssetResolver` URL generation (WebP variants & Signed Tokens).
4. **OpenAPI REST Endpoint Verification**:
   - Verify GET `/api/v1/tournaments/experience` and POST `/api/v1/matches/record-event`.
