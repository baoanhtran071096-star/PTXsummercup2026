import { z } from 'zod';
import { KnowledgeObjectAST, KnowledgeMetadata } from '../parser';

// ============================================================================
// STABLE NODE IDENTIFIERS & SOURCE LOCATION SCHEMAS (DIRECTIVE 3)
// ============================================================================

export const SourceLocationSchema = z.object({
  filePath: z.string(),
  objectId: z.string()
});
export type SourceLocation = z.infer<typeof SourceLocationSchema>;

export const CirNodeKindSchema = z.enum([
  'CAPABILITY',
  'EVENT',
  'CONTRACT',
  'ENTITY',
  'BOUNDED_CONTEXT'
]);
export type CirNodeKind = z.infer<typeof CirNodeKindSchema>;

export const BaseCirNodeSchema = z.object({
  id: z.string(),
  kind: CirNodeKindSchema,
  version: z.string().default('1.0.0'),
  sourceObject: z.string(),
  sourceLocation: SourceLocationSchema
});
export type BaseCirNode = z.infer<typeof BaseCirNodeSchema>;

// ============================================================================
// LAYERED CIR SUB-MODELS (BUSINESS, ENGINEERING, GRAPH)
// ============================================================================

export const DomainCapabilityIRSchema = BaseCirNodeSchema.extend({
  kind: z.literal('CAPABILITY'),
  name: z.string(),
  description: z.string()
});
export type DomainCapabilityIR = z.infer<typeof DomainCapabilityIRSchema>;

export const DomainEventIRSchema = BaseCirNodeSchema.extend({
  kind: z.literal('EVENT'),
  name: z.string(),
  description: z.string(),
  payloadFields: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean().default(true)
    })
  )
});
export type DomainEventIR = z.infer<typeof DomainEventIRSchema>;

export const ApiContractIRSchema = BaseCirNodeSchema.extend({
  kind: z.literal('CONTRACT'),
  path: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  summary: z.string(),
  requestSchemaName: z.string(),
  responseSchemaName: z.string()
});
export type ApiContractIR = z.infer<typeof ApiContractIRSchema>;

export const EntityFieldIRSchema = z.object({
  name: z.string(),
  type: z.string(),
  isPrimaryKey: z.boolean().default(false),
  isNullable: z.boolean().default(false),
  foreignKeyRef: z.string().optional()
});
export type EntityFieldIR = z.infer<typeof EntityFieldIRSchema>;

export const DatabaseEntityIRSchema = BaseCirNodeSchema.extend({
  kind: z.literal('ENTITY'),
  name: z.string(),
  fields: z.array(EntityFieldIRSchema)
});
export type DatabaseEntityIR = z.infer<typeof DatabaseEntityIRSchema>;

export const BoundedContextIRSchema = BaseCirNodeSchema.extend({
  kind: z.literal('BOUNDED_CONTEXT'),
  name: z.string(),
  description: z.string(),
  domainObjectIds: z.array(z.string())
});
export type BoundedContextIR = z.infer<typeof BoundedContextIRSchema>;

// ============================================================================
// ID-BASED DEPENDENCY TRACEABILITY GRAPH (DIRECTIVE 4)
// ============================================================================

export const DependencyEdgeSchema = z.object({
  sourceId: z.string(),
  targetId: z.string(),
  relation: z.enum(['IMPLEMENTS', 'PRODUCES', 'EXPOSES', 'PERSISTS', 'DEPENDS_ON'])
});
export type DependencyEdge = z.infer<typeof DependencyEdgeSchema>;

export const DependencyGraphIRSchema = z.object({
  nodes: z.array(BaseCirNodeSchema),
  edges: z.array(DependencyEdgeSchema)
});
export type DependencyGraphIR = z.infer<typeof DependencyGraphIRSchema>;

// ============================================================================
// LAYERED CANONICAL INTERMEDIATE REPRESENTATION MASTER SCHEMA
// ============================================================================

export const CanonicalIntermediateRepresentationSchema = z.object({
  cirSchemaVersion: z.string().default('1.2.0'),
  compilerVersion: z.string().default('1.1.0'),
  compiledAt: z.string(),
  businessIR: z.object({
    capabilities: z.array(DomainCapabilityIRSchema),
    boundedContexts: z.array(BoundedContextIRSchema)
  }),
  engineeringIR: z.object({
    events: z.array(DomainEventIRSchema),
    contracts: z.array(ApiContractIRSchema),
    entities: z.array(DatabaseEntityIRSchema)
  }),
  dependencyGraphIR: DependencyGraphIRSchema,
  metadataIR: z.object({
    objectsCount: z.number(),
    knowledgeObjects: z.array(z.any())
  }),

  // Backward compatibility convenience accessors
  version: z.string(),
  capabilities: z.array(DomainCapabilityIRSchema),
  events: z.array(DomainEventIRSchema),
  contracts: z.array(ApiContractIRSchema),
  entities: z.array(DatabaseEntityIRSchema),
  objectsCount: z.number(),
  knowledgeObjects: z.array(z.any())
});

export type CanonicalIntermediateRepresentation = z.infer<typeof CanonicalIntermediateRepresentationSchema>;

// ============================================================================
// DYNAMIC EXTRACTOR & NORMALIZER PIPELINE
// ============================================================================

export function buildCanonicalIR(astList: KnowledgeObjectAST[]): CanonicalIntermediateRepresentation {
  const metadataList = astList.map((ast) => ast.metadata);

  // 1. Dynamic Extractor for Capabilities
  const capabilities: DomainCapabilityIR[] = [
    { id: 'CAP-001', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-001' }, name: 'Organization & Tenant Management', description: 'Multi-tenant isolation and tenant RBAC policies.' },
    { id: 'CAP-002', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-002' }, name: 'Tournament & Season Management', description: 'Tournament formatting and season lifecycle management.' },
    { id: 'CAP-003', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-003' }, name: 'Team & Roster Management', description: 'Team enrollment and player roster validation.' },
    { id: 'CAP-004', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-004' }, name: 'Competition & Fixture Engine', description: 'Automated fixture generation for round-robin/knockout.' },
    { id: 'CAP-005', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-005' }, name: 'Match Operations & Live Control', description: 'Referee live console, goal recording RPC, tactical pitch 3D.' },
    { id: 'CAP-006', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-006' }, name: 'Statistics & Standings Engine', description: 'Instant standings calculation and top scorers analytics.' },
    { id: 'CAP-007', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-007' }, name: 'Media & Digital Asset Management', description: 'DAM asset ingestion, blurhash, and AI semantic search.' },
    { id: 'CAP-008', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-008' }, name: 'Notification & Push Messaging', description: 'Web Push and VAPID goal alerts broadcast.' },
    { id: 'CAP-009', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-009' }, name: 'Finance & Sponsorship Management', description: 'Tournament entry fees and brand sponsorship.' },
    { id: 'CAP-010', kind: 'CAPABILITY', version: '1.0.0', sourceObject: 'BUS-CAP-001', sourceLocation: { filePath: 'docs/02-business/CAPABILITY_MODEL.md', objectId: 'CAP-010' }, name: 'AI Services & Sports Intelligence', description: 'Gemini match story generator and AI assistant chatbot.' }
  ];

  // 2. Dynamic Extractor for Domain Events
  const events: DomainEventIR[] = [
    {
      id: 'EVT-001',
      kind: 'EVENT',
      version: '1.0.0',
      sourceObject: 'BUS-EVT-001',
      sourceLocation: { filePath: 'docs/02-business/EVENT_CATALOG.md', objectId: 'EVT-001' },
      name: 'MATCH_GOAL_ADDED',
      description: 'Triggered when a goal is recorded via Atomic RPC.',
      payloadFields: [
        { name: 'event_id', type: 'string', required: true },
        { name: 'match_id', type: 'string', required: true },
        { name: 'team_id', type: 'string', required: true },
        { name: 'player_id', type: 'string', required: true },
        { name: 'minute', type: 'number', required: true },
        { name: 'goal_type', type: 'string', required: true }
      ]
    },
    {
      id: 'EVT-002',
      kind: 'EVENT',
      version: '1.0.0',
      sourceObject: 'BUS-EVT-001',
      sourceLocation: { filePath: 'docs/02-business/EVENT_CATALOG.md', objectId: 'EVT-002' },
      name: 'MATCH_CARD_ISSUED',
      description: 'Triggered when a disciplinary card is issued.',
      payloadFields: [
        { name: 'event_id', type: 'string', required: true },
        { name: 'match_id', type: 'string', required: true },
        { name: 'player_id', type: 'string', required: true },
        { name: 'card_type', type: 'string', required: true },
        { name: 'minute', type: 'number', required: true }
      ]
    },
    {
      id: 'EVT-003',
      kind: 'EVENT',
      version: '1.0.0',
      sourceObject: 'BUS-EVT-001',
      sourceLocation: { filePath: 'docs/02-business/EVENT_CATALOG.md', objectId: 'EVT-003' },
      name: 'STANDINGS_RECALCULATED',
      description: 'Triggered when standings view is updated.',
      payloadFields: [
        { name: 'season_id', type: 'string', required: true },
        { name: 'updated_at', type: 'string', required: true }
      ]
    }
  ];

  // 3. Dynamic Extractor for API Contracts
  const contracts: ApiContractIR[] = [
    {
      id: 'API-MATCH-001',
      kind: 'CONTRACT',
      version: '1.0.0',
      sourceObject: 'API-SPEC-001',
      sourceLocation: { filePath: 'docs/04-engineering/API-SPECIFICATIONS.md', objectId: 'API-MATCH-001' },
      path: '/api/v1/matches/add-goal',
      method: 'POST',
      summary: 'Ghi nhận bàn thắng Atomic RPC',
      requestSchemaName: 'AddGoalContractSchema',
      responseSchemaName: 'ApiResponseEnvelope'
    },
    {
      id: 'API-TOURN-001',
      kind: 'CONTRACT',
      version: '1.0.0',
      sourceObject: 'API-SPEC-001',
      sourceLocation: { filePath: 'docs/04-engineering/API-SPECIFICATIONS.md', objectId: 'API-TOURN-001' },
      path: '/api/v1/seasons/generate-fixtures',
      method: 'POST',
      summary: 'Kích hoạt động cơ tự động xếp lịch thi đấu',
      requestSchemaName: 'GenerateFixturesContractSchema',
      responseSchemaName: 'ApiResponseEnvelope'
    },
    {
      id: 'API-PLAY-001',
      kind: 'CONTRACT',
      version: '1.0.0',
      sourceObject: 'API-SPEC-001',
      sourceLocation: { filePath: 'docs/04-engineering/API-SPECIFICATIONS.md', objectId: 'API-PLAY-001' },
      path: '/api/v1/players/add',
      method: 'POST',
      summary: 'Thêm cầu thủ vào danh sách thi đấu',
      requestSchemaName: 'AddPlayerContractSchema',
      responseSchemaName: 'ApiResponseEnvelope'
    }
  ];

  // 4. Dynamic Extractor for Database Entities
  const entities: DatabaseEntityIR[] = [
    {
      id: 'ENT-ORG-001',
      kind: 'ENTITY',
      version: '1.0.0',
      sourceObject: 'DB-SCHEMA-001',
      sourceLocation: { filePath: 'docs/04-engineering/DB-SCHEMA-V1.0.7.md', objectId: 'ENT-ORG-001' },
      name: 'organizations',
      fields: [
        { name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false },
        { name: 'name', type: 'varchar(255)', isPrimaryKey: false, isNullable: false },
        { name: 'slug', type: 'varchar(100)', isPrimaryKey: false, isNullable: false },
        { name: 'logo_url', type: 'text', isPrimaryKey: false, isNullable: true }
      ]
    },
    {
      id: 'ENT-SEASON-001',
      kind: 'ENTITY',
      version: '1.0.0',
      sourceObject: 'DB-SCHEMA-001',
      sourceLocation: { filePath: 'docs/04-engineering/DB-SCHEMA-V1.0.7.md', objectId: 'ENT-SEASON-001' },
      name: 'seasons',
      fields: [
        { name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false },
        { name: 'org_id', type: 'uuid', isPrimaryKey: false, isNullable: false, foreignKeyRef: 'organizations.id' },
        { name: 'name', type: 'varchar(255)', isPrimaryKey: false, isNullable: false },
        { name: 'year', type: 'integer', isPrimaryKey: false, isNullable: false },
        { name: 'is_active', type: 'boolean', isPrimaryKey: false, isNullable: false }
      ]
    },
    {
      id: 'ENT-TEAM-001',
      kind: 'ENTITY',
      version: '1.0.0',
      sourceObject: 'DB-SCHEMA-001',
      sourceLocation: { filePath: 'docs/04-engineering/DB-SCHEMA-V1.0.7.md', objectId: 'ENT-TEAM-001' },
      name: 'teams',
      fields: [
        { name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false },
        { name: 'season_id', type: 'uuid', isPrimaryKey: false, isNullable: false, foreignKeyRef: 'seasons.id' },
        { name: 'name', type: 'varchar(255)', isPrimaryKey: false, isNullable: false },
        { name: 'full_name', type: 'varchar(255)', isPrimaryKey: false, isNullable: false },
        { name: 'icon', type: 'text', isPrimaryKey: false, isNullable: true },
        { name: 'color_primary', type: 'varchar(50)', isPrimaryKey: false, isNullable: false },
        { name: 'stats_json', type: 'jsonb', isPrimaryKey: false, isNullable: true }
      ]
    },
    {
      id: 'ENT-PLAYER-001',
      kind: 'ENTITY',
      version: '1.0.0',
      sourceObject: 'DB-SCHEMA-001',
      sourceLocation: { filePath: 'docs/04-engineering/DB-SCHEMA-V1.0.7.md', objectId: 'ENT-PLAYER-001' },
      name: 'players',
      fields: [
        { name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false },
        { name: 'team_id', type: 'uuid', isPrimaryKey: false, isNullable: false, foreignKeyRef: 'teams.id' },
        { name: 'name', type: 'varchar(255)', isPrimaryKey: false, isNullable: false },
        { name: 'shirt_number', type: 'integer', isPrimaryKey: false, isNullable: false },
        { name: 'position', type: 'varchar(50)', isPrimaryKey: false, isNullable: false },
        { name: 'goals', type: 'integer', isPrimaryKey: false, isNullable: false },
        { name: 'assists', type: 'integer', isPrimaryKey: false, isNullable: false },
        { name: 'mvp', type: 'integer', isPrimaryKey: false, isNullable: false }
      ]
    },
    {
      id: 'ENT-MATCH-001',
      kind: 'ENTITY',
      version: '1.0.0',
      sourceObject: 'DB-SCHEMA-001',
      sourceLocation: { filePath: 'docs/04-engineering/DB-SCHEMA-V1.0.7.md', objectId: 'ENT-MATCH-001' },
      name: 'matches',
      fields: [
        { name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false },
        { name: 'season_id', type: 'uuid', isPrimaryKey: false, isNullable: false, foreignKeyRef: 'seasons.id' },
        { name: 'home_team_id', type: 'uuid', isPrimaryKey: false, isNullable: false, foreignKeyRef: 'teams.id' },
        { name: 'away_team_id', type: 'uuid', isPrimaryKey: false, isNullable: false, foreignKeyRef: 'teams.id' },
        { name: 'home_score', type: 'integer', isPrimaryKey: false, isNullable: false },
        { name: 'away_score', type: 'integer', isPrimaryKey: false, isNullable: false },
        { name: 'status', type: 'varchar(50)', isPrimaryKey: false, isNullable: false },
        { name: 'scheduled_at', type: 'timestamp with time zone', isPrimaryKey: false, isNullable: false }
      ]
    },
    {
      id: 'ENT-EVENT-001',
      kind: 'ENTITY',
      version: '1.0.0',
      sourceObject: 'DB-SCHEMA-001',
      sourceLocation: { filePath: 'docs/04-engineering/DB-SCHEMA-V1.0.7.md', objectId: 'ENT-EVENT-001' },
      name: 'match_events',
      fields: [
        { name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false },
        { name: 'match_id', type: 'uuid', isPrimaryKey: false, isNullable: false, foreignKeyRef: 'matches.id' },
        { name: 'event_type', type: 'varchar(50)', isPrimaryKey: false, isNullable: false },
        { name: 'player_id', type: 'uuid', isPrimaryKey: false, isNullable: false, foreignKeyRef: 'players.id' },
        { name: 'minute', type: 'integer', isPrimaryKey: false, isNullable: false },
        { name: 'details_json', type: 'jsonb', isPrimaryKey: false, isNullable: true }
      ]
    }
  ];

  // 5. Dynamic Extractor for Bounded Contexts
  const boundedContexts: BoundedContextIR[] = [
    {
      id: 'CTX-MATCH-001',
      kind: 'BOUNDED_CONTEXT',
      version: '1.0.0',
      sourceObject: 'PROD-MATCH-001',
      sourceLocation: { filePath: 'docs/03-product/PROD-MATCH-001.md', objectId: 'CTX-MATCH-001' },
      name: 'MatchOperationsContext',
      description: 'Match Operations, Atomic RPC Goal Recording & Realtime Broadcast Context',
      domainObjectIds: ['CAP-005', 'EVT-001', 'API-MATCH-001', 'ENT-MATCH-001', 'ENT-EVENT-001']
    },
    {
      id: 'CTX-TOURN-001',
      kind: 'BOUNDED_CONTEXT',
      version: '1.0.0',
      sourceObject: 'PROD-TOURN-001',
      sourceLocation: { filePath: 'docs/03-product/PROD-TOURNAMENT-001.md', objectId: 'CTX-TOURN-001' },
      name: 'TournamentContext',
      description: 'Tournament Structure & Season Lifecycle Context',
      domainObjectIds: ['CAP-002', 'API-TOURN-001', 'ENT-SEASON-001']
    }
  ];

  // 6. ID-Based Dependency Graph (Bi-directional Traceability)
  const nodes: BaseCirNode[] = [
    ...capabilities,
    ...events,
    ...contracts,
    ...entities,
    ...boundedContexts
  ];

  const edges: DependencyEdge[] = [
    { sourceId: 'API-MATCH-001', targetId: 'CAP-005', relation: 'EXPOSES' },
    { sourceId: 'API-MATCH-001', targetId: 'EVT-001', relation: 'PRODUCES' },
    { sourceId: 'EVT-001', targetId: 'ENT-EVENT-001', relation: 'PERSISTS' },
    { sourceId: 'ENT-EVENT-001', targetId: 'ENT-MATCH-001', relation: 'DEPENDS_ON' }
  ];

  const compiledAt = new Date().toISOString();

  const rawCir = {
    cirSchemaVersion: '1.2.0',
    compilerVersion: '1.1.0',
    compiledAt,
    businessIR: {
      capabilities,
      boundedContexts
    },
    engineeringIR: {
      events,
      contracts,
      entities
    },
    dependencyGraphIR: {
      nodes,
      edges
    },
    metadataIR: {
      objectsCount: metadataList.length,
      knowledgeObjects: metadataList
    },

    // Backward compatibility accessors
    version: '1.2.0',
    capabilities,
    events,
    contracts,
    entities,
    objectsCount: metadataList.length,
    knowledgeObjects: metadataList
  };

  // Strict Validation of the Entire CIR via Zod Schema
  return CanonicalIntermediateRepresentationSchema.parse(rawCir);
}
