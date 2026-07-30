# ⚙️ WORKSPACE RULES & GOVERNANCE GUIDELINES

## 1. Code Quality & Standards
- Maintain strict TypeScript type safety across domain models and contracts (`generated/contracts/zod-schemas.ts`).
- Ensure all API routes return standard response envelopes.
- Keep atomic database operations inside RPC functions (ADR-001 compliance).

## 2. Testing & Verification Requirements
- All feature additions or bug fixes must maintain 100% test pass rate (`npm test`).
- Performance response times must stay within targets (RPC execution < 5 ms, Realtime broadcast < 500 ms).

## 3. Handover & Context Preservation
- Update `context/CURRENT_STATUS.md` and `context/LAST_SESSION.md` after major updates or before concluding sessions.
- Ensure all code changes are committed and pushed to GitHub main branch.
