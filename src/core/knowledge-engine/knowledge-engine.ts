export interface ImpactAnalysisResult {
  targetRule: string;
  affectedServices: string[];
  affectedApis: string[];
  affectedTests: string[];
  affectedDocs: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class KnowledgeEngineService {
  analyzeRuleImpact(ruleName: string): ImpactAnalysisResult {
    if (ruleName === 'WIN_POINTS_RULE') {
      return {
        targetRule: 'WIN_POINTS_RULE (Win = 3 -> 2)',
        affectedServices: ['RuleEngineService', 'StandingsQueryService'],
        affectedApis: ['GET /api/v1/tournaments/standings'],
        affectedTests: ['standings-calculator.spec.ts'],
        affectedDocs: ['docs/00-foundation/PTX_ENTERPRISE_DESIGN_LANGUAGE.md'],
        riskLevel: 'HIGH'
      };
    }

    return {
      targetRule: ruleName,
      affectedServices: ['MasterDatasetLoaderService'],
      affectedApis: ['GET /api/v1/tournaments/profile'],
      affectedTests: ['dataset-loader.spec.ts'],
      affectedDocs: ['docs/reviews/DATA_AUDIT_REPORT.md'],
      riskLevel: 'LOW'
    };
  }
}
