// ================================================================
// PTX AI ORCHESTRATOR
// Điều phối các AI Engine, giảm sự phụ thuộc giữa các module.
// Architecture: AI-Native, Free-by-Design
// Frozen: 31/07/2026
// ================================================================

import { ChatEngine } from '../engines/chat.engine';
import { VisionEngine } from '../engines/vision.engine';
import { ContentEngine } from '../engines/content.engine';
import { SearchEngine } from '../engines/search.engine';
import { AnalyticsEngine } from '../engines/analytics.engine';
import { AutomationEngine } from '../engines/automation.engine';
import { CapabilityRegistry } from '../capability/registry';
import { WorkflowRunner } from '../workflows/runner';
import {
  OrchestratorRequest,
  OrchestratorResponse,
  RequestType,
} from './orchestrator.types';

export class AIOrchestrator {
  private chatEngine: ChatEngine;
  private visionEngine: VisionEngine;
  private contentEngine: ContentEngine;
  private searchEngine: SearchEngine;
  private analyticsEngine: AnalyticsEngine;
  private automationEngine: AutomationEngine;
  private capabilityRegistry: CapabilityRegistry;
  private workflowRunner: WorkflowRunner;

  constructor() {
    this.capabilityRegistry = new CapabilityRegistry();
    this.chatEngine = new ChatEngine();
    this.visionEngine = new VisionEngine();
    this.contentEngine = new ContentEngine();
    this.searchEngine = new SearchEngine();
    this.analyticsEngine = new AnalyticsEngine();
    this.automationEngine = new AutomationEngine();
    this.workflowRunner = new WorkflowRunner(this);
  }

  /**
   * Entry point: nhận request, phân loại, điều phối Engine, trả kết quả.
   * Ví dụ: BTC upload ảnh → Vision → Content → Automation (Gallery + Notify)
   */
  async process(request: OrchestratorRequest): Promise<OrchestratorResponse> {
    const startTime = Date.now();
    console.log(`[Orchestrator] Processing request type: ${request.type}`);

    try {
      // 1. Phân loại yêu cầu
      const type = this.classifyRequest(request);

      // 2. Kiểm tra workflow template tồn tại
      const workflowExists = this.workflowRunner.hasTemplate(type);

      if (workflowExists) {
        // 3a. Chạy theo Workflow Template (ưu tiên)
        const result = await this.workflowRunner.run(type, request);
        return {
          success: true,
          type,
          data: result,
          engine: 'workflow-template',
          latencyMs: Date.now() - startTime,
        };
      }

      // 3b. Fallback: Tra cứu capability và gọi Engine trực tiếp
      const capabilities = this.capabilityRegistry.getRequiredCapabilities(type);
      const results: Record<string, unknown> = {};

      for (const cap of capabilities) {
        results[cap.name] = await this.invokeEngine(cap.name, request);
      }

      return {
        success: true,
        type,
        data: this.aggregateResults(results),
        engine: 'direct-dispatch',
        latencyMs: Date.now() - startTime,
      };

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[Orchestrator] Error: ${message}`);
      return {
        success: false,
        type: request.type,
        error: message,
        engine: 'orchestrator',
        latencyMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Phân loại request thành RequestType chuẩn.
   */
  private classifyRequest(request: OrchestratorRequest): RequestType {
    return request.type as RequestType;
  }

  /**
   * Gọi đúng Engine theo tên capability.
   */
  async invokeEngine(engineName: string, request: OrchestratorRequest): Promise<unknown> {
    switch (engineName) {
      case 'chat':      return this.chatEngine.handle(request);
      case 'vision':    return this.visionEngine.handle(request);
      case 'content':   return this.contentEngine.handle(request);
      case 'search':    return this.searchEngine.handle(request);
      case 'analytics': return this.analyticsEngine.handle(request);
      case 'automation':return this.automationEngine.handle(request);
      default:
        throw new Error(`[Orchestrator] Unknown engine: ${engineName}`);
    }
  }

  /**
   * Tổng hợp kết quả từ nhiều Engine thành một response.
   */
  private aggregateResults(results: Record<string, unknown>): Record<string, unknown> {
    return {
      engines: Object.keys(results),
      outputs: results,
      aggregatedAt: new Date().toISOString(),
    };
  }
}
