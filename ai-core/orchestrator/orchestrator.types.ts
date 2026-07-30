// ================================================================
// PTX AI ORCHESTRATOR – TYPE DEFINITIONS
// ================================================================

export type RequestType =
  | 'upload-image'
  | 'match-result'
  | 'new-player'
  | 'chat'
  | 'search'
  | 'analytics'
  | 'news-generation'
  | 'seo-generation'
  | 'notification';

export interface OrchestratorRequest {
  type: RequestType;
  payload: Record<string, unknown>;
  userId?: string;
  context?: Record<string, unknown>;
}

export interface OrchestratorResponse {
  success: boolean;
  type: RequestType;
  data?: Record<string, unknown>;
  error?: string;
  engine: string;
  latencyMs: number;
}
