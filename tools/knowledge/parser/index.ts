import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

// ============================================================================
// STRICT ZOD SCHEMA FOR KNOWLEDGE METADATA (TYPE SAFETY & VALIDATION)
// ============================================================================

export const VerificationMetadataSchema = z.object({
  automated: z.boolean().default(true),
  integration_tests: z.boolean().default(false),
  last_verified: z.string().default(() => new Date().toISOString().split('T')[0])
});

export const EvidenceMetadataSchema = z.object({
  implementation: z.array(z.string()).default([]),
  tests: z.array(z.string()).default([]),
  metrics: z.array(z.string()).default([]),
  dashboards: z.array(z.string()).default([]),
  source_files: z.array(z.string()).default([])
});

export const AiContextMetadataSchema = z.object({
  ai_summary: z.string().optional(),
  key_entities: z.array(z.string()).default([]),
  business_terms: z.array(z.string()).default([]),
  breaking_changes: z.array(z.string()).default([]),
  implementation_notes: z.string().optional(),
  review_checklist: z.array(z.string()).default([])
});

export const KnowledgeMetadataSchema = z.object({
  id: z.string().min(1, 'Metadata ID is required'),
  title: z.string().min(1, 'Title is required'),
  layer: z.string().min(1, 'Layer is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.string().default('Specified'),
  version: z.string().default('1.0.0'),
  owner: z.string().default('System Architect'),
  reviewer: z.string().default('CTO'),
  created: z.string().default('2026-07-28'),
  updated: z.string().default('2026-07-28'),
  depends_on: z.array(z.string()).default([]),
  related_docs: z.array(z.string()).default([]),
  impacts_on: z.array(z.string()).default([]),
  verification: VerificationMetadataSchema.optional(),
  evidence: EvidenceMetadataSchema.optional(),
  ai_context: AiContextMetadataSchema.optional(),
  tags: z.array(z.string()).default([])
});

export type KnowledgeMetadata = z.infer<typeof KnowledgeMetadataSchema>;

export interface KnowledgeObjectAST {
  filePath: string;
  metadata: KnowledgeMetadata;
  content: string;
}

// ============================================================================
// PARSER ARCHITECTURE: TOKENIZER ➔ LINE PARSER ➔ SECTION MAPPER
// ============================================================================

interface YamlLineToken {
  indent: number;
  key: string;
  value: string;
  isArrayItem: boolean;
  rawValue: string;
}

/**
 * Step 1: Tokenizer - Convert YAML block into structured line tokens
 */
function tokenizeYaml(yamlStr: string): YamlLineToken[] {
  const lines = yamlStr.split(/\r?\n/);
  const tokens: YamlLineToken[] = [];

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    const trimmed = line.trim();

    if (trimmed.startsWith('- ')) {
      tokens.push({
        indent,
        key: '',
        value: trimmed.slice(2).trim().replace(/^"|"$/g, ''),
        isArrayItem: true,
        rawValue: trimmed
      });
    } else {
      const match = trimmed.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (match) {
        tokens.push({
          indent,
          key: match[1],
          value: match[2].trim(),
          isArrayItem: false,
          rawValue: trimmed
        });
      }
    }
  }

  return tokens;
}

/**
 * Step 2 & 3: Section Parser & Semantic Mapper
 */
function parseYamlTokens(tokens: YamlLineToken[]): Record<string, unknown> {
  const root: Record<string, any> = {};
  let currentRootKey = '';
  let currentSubKey = '';

  for (const token of tokens) {
    if (token.indent === 0 && !token.isArrayItem) {
      currentRootKey = token.key;
      currentSubKey = '';

      if (token.value.startsWith('[') && token.value.endsWith(']')) {
        try {
          root[currentRootKey] = JSON.parse(token.value);
        } catch {
          root[currentRootKey] = [];
        }
      } else if (token.value.startsWith('"') && token.value.endsWith('"')) {
        root[currentRootKey] = token.value.slice(1, -1);
      } else if (token.value) {
        root[currentRootKey] = token.value;
      } else {
        root[currentRootKey] = {};
      }
    } else if (token.indent === 2 && !token.isArrayItem && currentRootKey) {
      currentSubKey = token.key;
      if (typeof root[currentRootKey] !== 'object') {
        root[currentRootKey] = {};
      }

      if (token.value.startsWith('[') && token.value.endsWith(']')) {
        try {
          root[currentRootKey][currentSubKey] = JSON.parse(token.value);
        } catch {
          root[currentRootKey][currentSubKey] = [];
        }
      } else if (token.value === 'true') {
        root[currentRootKey][currentSubKey] = true;
      } else if (token.value === 'false') {
        root[currentRootKey][currentSubKey] = false;
      } else if (token.value.startsWith('"') && token.value.endsWith('"')) {
        root[currentRootKey][currentSubKey] = token.value.slice(1, -1);
      } else if (token.value) {
        root[currentRootKey][currentSubKey] = token.value;
      }
    } else if (token.isArrayItem) {
      if (currentRootKey && currentSubKey) {
        if (!Array.isArray(root[currentRootKey][currentSubKey])) {
          root[currentRootKey][currentSubKey] = [];
        }
        root[currentRootKey][currentSubKey].push(token.value);
      } else if (currentRootKey) {
        if (!Array.isArray(root[currentRootKey])) {
          root[currentRootKey] = [];
        }
        root[currentRootKey].push(token.value);
      }
    }
  }

  return root;
}

/**
 * Step 4: Strict Schema Validation & Type Safety
 */
export function parseFrontmatter(rawContent: string): { metadata: KnowledgeMetadata; body: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid Knowledge Object format: Missing YAML frontmatter delimiter ---');
  }

  const yamlStr = match[1];
  const body = match[2];

  const tokens = tokenizeYaml(yamlStr);
  const rawDict = parseYamlTokens(tokens);

  // Type Safety: Validate via Zod Schema instead of casting `as KnowledgeMetadata`
  const validatedMetadata = KnowledgeMetadataSchema.parse(rawDict);

  return { metadata: validatedMetadata, body };
}

/**
 * Recursive File System Scanner
 */
export function scanAndParseKnowledgeObjects(docsRootDir: string): KnowledgeObjectAST[] {
  const astList: KnowledgeObjectAST[] = [];

  function walkDir(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const rawContent = fs.readFileSync(fullPath, 'utf-8');
        const { metadata, body } = parseFrontmatter(rawContent);
        astList.push({
          filePath: fullPath,
          metadata,
          content: body
        });
      }
    }
  }

  walkDir(docsRootDir);
  return astList;
}
