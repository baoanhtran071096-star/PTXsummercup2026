// PTX TOOL REGISTRY – Đăng ký và lookup tools
import { scheduleTool } from './schedule.tool';
import { standingsTool } from './standings.tool';
import { playersTool } from './players.tool';
import { newsTool } from './news.tool';

export type PTXTool = {
  name: string;
  description: string;
  execute: (params: Record<string, unknown>) => Promise<unknown>;
};

const TOOLS: PTXTool[] = [
  scheduleTool as PTXTool,
  standingsTool as PTXTool,
  playersTool as PTXTool,
  newsTool as PTXTool,
];

export class ToolRegistry {
  private tools = new Map<string, PTXTool>();

  constructor() {
    for (const tool of TOOLS) {
      this.tools.set(tool.name, tool);
      console.log(`[ToolRegistry] Registered: ${tool.name}`);
    }
  }

  get(name: string): PTXTool | undefined {
    return this.tools.get(name);
  }

  getAll(): PTXTool[] {
    return Array.from(this.tools.values());
  }

  async execute(toolName: string, params: Record<string, unknown> = {}): Promise<unknown> {
    const tool = this.get(toolName);
    if (!tool) throw new Error(`[ToolRegistry] Tool not found: ${toolName}`);
    console.log(`[ToolRegistry] Executing: ${toolName}`, params);
    return tool.execute(params);
  }

  getDescriptions(): string {
    return this.getAll()
      .map(t => `- ${t.name}: ${t.description}`)
      .join('\n');
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }
}

export const toolRegistry = new ToolRegistry();
