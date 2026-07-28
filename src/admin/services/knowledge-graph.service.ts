import { scanAndParseKnowledgeObjects } from '../../../tools/knowledge/parser';
import { buildCanonicalIR } from '../../../tools/knowledge/cir';
import * as path from 'path';

export interface VisualGraphNode {
  id: string;
  label: string;
  category: 'CAPABILITY' | 'EVENT' | 'CONTRACT' | 'ENTITY' | 'BOUNDED_CONTEXT';
  source: string;
}

export interface VisualGraphLink {
  source: string;
  target: string;
  relation: string;
}

export interface KnowledgeGraphData {
  nodes: VisualGraphNode[];
  links: VisualGraphLink[];
}

export class KnowledgeGraphService {
  /**
   * Epic 3: Knowledge Graph Visualizer
   * Returns interactive Dependency Graph (Capability ➔ Event ➔ Contract ➔ API ➔ Database)
   */
  getInteractiveKnowledgeGraph(rootDir: string): KnowledgeGraphData {
    const docsDir = path.join(rootDir, 'docs');
    const astList = scanAndParseKnowledgeObjects(docsDir);
    const cir = buildCanonicalIR(astList);

    const nodes: VisualGraphNode[] = cir.dependencyGraphIR.nodes.map((node) => ({
      id: node.id,
      label: node.id,
      category: node.kind as any,
      source: node.sourceObject
    }));

    const links: VisualGraphLink[] = cir.dependencyGraphIR.edges.map((edge) => ({
      source: edge.sourceId,
      target: edge.targetId,
      relation: edge.relation
    }));

    console.log(`🕸️ [KNOWLEDGE GRAPH VISUALIZER] Generated Graph with ${nodes.length} Nodes & ${links.length} Edges.`);
    return { nodes, links };
  }
}
