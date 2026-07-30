// ================================================================
// PTX AI WORKFLOW RUNNER
// Thực thi Workflow Templates tuần tự, có dependency resolution.
// ================================================================

import { WorkflowTemplates, WorkflowStep } from './templates';
import { OrchestratorRequest } from '../orchestrator/orchestrator.types';

export class WorkflowRunner {
  // Lazy reference để tránh circular import
  private orchestrator: { invokeEngine: (name: string, req: OrchestratorRequest) => Promise<unknown> };

  constructor(orchestrator: { invokeEngine: (name: string, req: OrchestratorRequest) => Promise<unknown> }) {
    this.orchestrator = orchestrator;
  }

  hasTemplate(type: string): boolean {
    return type in WorkflowTemplates;
  }

  async run(type: string, request: OrchestratorRequest): Promise<Record<string, unknown>> {
    const template = WorkflowTemplates[type];
    if (!template) throw new Error(`[WorkflowRunner] No template for: ${type}`);

    console.log(`[WorkflowRunner] Running workflow: "${template.name}" (${template.steps.length} steps)`);
    const results: Record<string, unknown> = {};

    for (const step of template.steps) {
      // Kiểm tra dependency
      if (step.dependsOn) {
        for (const dep of step.dependsOn) {
          if (!(dep in results)) {
            if (!step.optional) {
              throw new Error(`[WorkflowRunner] Dependency "${dep}" not completed before "${step.action}"`);
            }
            console.warn(`[WorkflowRunner] Optional step "${step.action}" skipped (missing dep: ${dep})`);
            continue;
          }
        }
      }

      try {
        console.log(`[WorkflowRunner]  → [${step.engine}] ${step.action}`);
        results[step.action] = await this.orchestrator.invokeEngine(step.engine, {
          ...request,
          payload: { ...request.payload, previousResults: results },
        });
      } catch (err) {
        if (step.optional) {
          console.warn(`[WorkflowRunner] Optional step "${step.action}" failed, continuing.`);
          results[step.action] = null;
        } else {
          throw err;
        }
      }
    }

    console.log(`[WorkflowRunner] ✅ Workflow "${template.name}" completed.`);
    return results;
  }
}
