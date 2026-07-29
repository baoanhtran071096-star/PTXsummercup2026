import { RuleEngineService } from './rule-engine/rule-engine';
import { WorkflowEngineService } from './workflow-engine/workflow-engine';
import { PolicyEngineService } from './policy-engine/policy-engine';
import { AuditEngineService } from './audit-engine/audit-engine';
import { KnowledgeEngineService } from './knowledge-engine/knowledge-engine';
import { AiRuntimePlatformService } from './ai-engine/ai-runtime-platform';

export class PtxCoreEngine {
  public readonly ruleEngine: RuleEngineService;
  public readonly workflowEngine: WorkflowEngineService;
  public readonly policyEngine: PolicyEngineService;
  public readonly auditEngine: AuditEngineService;
  public readonly knowledgeEngine: KnowledgeEngineService;
  public readonly aiRuntime: AiRuntimePlatformService;

  constructor() {
    this.ruleEngine = new RuleEngineService();
    this.workflowEngine = new WorkflowEngineService();
    this.policyEngine = new PolicyEngineService();
    this.auditEngine = new AuditEngineService();
    this.knowledgeEngine = new KnowledgeEngineService();
    this.aiRuntime = new AiRuntimePlatformService();
  }

  getSystemStatus() {
    return {
      operatingSystem: 'PTX Operating System (PTX OS v3.0)',
      coreEngineStatus: 'ONLINE_ACTIVE',
      currentPhase: this.workflowEngine.getCurrentPhase(),
      pointsConfig: this.ruleEngine.getPointsRule(),
      auditSummary: this.auditEngine.evaluatePackageAudit(process.cwd()),
      aiAgentsActiveCount: 6
    };
  }
}
