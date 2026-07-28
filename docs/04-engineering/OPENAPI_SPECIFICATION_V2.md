---
id: OPENAPI-SPEC-002
title: PTX Platform v2.0 — OpenAPI v3.0 REST API Contract Specification
layer: API Specification
category: Frontend Contracts
status: Approved Standard
version: 2.0.0
owner: Ren (Chief Product & Architecture Officer) & Claude (Lead Engineer)
reviewer: Product Owner
created: 2026-07-29
updated: 2026-07-29
---

# PTX PLATFORM — OPENAPI v3.0 SPECIFICATION

```yaml
openapi: 3.0.3
info:
  title: PTX Platform Enterprise REST API
  description: Official OpenAPI Contract Specification for Frontend & Mobile App Integration
  version: 2.0.0
paths:
  /api/v1/tournaments/experience:
    get:
      summary: Retrieve complete integrated Tournament Profile Experience
      responses:
        '200':
          description: Successful response returning dynamic DAM URLs
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      id: { type: string }
                      name: { type: string }
                      bannerAssetId: { type: string }
                      resolvedBannerUrl: { type: string }
                      sponsors: { type: array }
                      galleryPhotos: { type: array }
                      hallOfFame: { type: array }
  /api/v1/matches/record-event:
    post:
      summary: Record Live Match Console Event (Event-Driven)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [matchId, eventType]
              properties:
                matchId: { type: string }
                eventType: { type: string, enum: [MATCH_STARTED, GOAL_SCORED, YELLOW_CARD_ISSUED, RED_CARD_ISSUED, PLAYER_SUBSTITUTED, MATCH_ENDED] }
                minute: { type: integer }
                details: { type: object }
      responses:
        '200':
          description: Event processed & published to Event Bus
```
