import { CanonicalIntermediateRepresentation } from '../cir';
import { KnowledgeGeneratorPlugin, GeneratorOutputArtifact } from './plugin.interface';

export const openapiGeneratorPlugin: KnowledgeGeneratorPlugin = {
  id: 'gen-openapi-spec',
  name: 'OpenAPI v3.0 Specification Generator',
  language: 'JSON / OpenAPI 3.0',
  version: '1.0.0',
  supportsCirVersion: '1.2.0',

  generate(cir: CanonicalIntermediateRepresentation): GeneratorOutputArtifact {
    const openApiPaths: any = {};

    for (const contract of cir.contracts) {
      const pathItem: any = {};
      const method = contract.method.toLowerCase();

      pathItem[method] = {
        summary: contract.summary,
        operationId: contract.id,
        tags: ['Generated API Contracts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${contract.requestSchemaName}`
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseEnvelope'
                }
              }
            }
          },
          '422': {
            description: 'Lỗi Validation Input (Zod Contract Failure)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponseEnvelope'
                }
              }
            }
          }
        }
      };

      openApiPaths[contract.path] = pathItem;
    }

    const specObj = {
      openapi: '3.0.3',
      info: {
        title: 'PTX Platform Master API Specification',
        version: cir.version,
        description: 'OpenAPI Specification auto-generated from PTX Foundation Knowledge Objects.'
      },
      paths: openApiPaths,
      components: {
        schemas: {
          ApiResponseEnvelope: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
              meta: { type: 'object' },
              timestamp: { type: 'string', format: 'date-time' }
            }
          },
          ErrorResponseEnvelope: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string', example: 'ERR_VALIDATION_FAILED' },
                  message: { type: 'string' }
                }
              },
              timestamp: { type: 'string', format: 'date-time' }
            }
          },
          AddGoalContractSchema: {
            type: 'object',
            required: ['match_id', 'team_id', 'player_id', 'minute', 'goal_type'],
            properties: {
              match_id: { type: 'string', format: 'uuid' },
              team_id: { type: 'string', format: 'uuid' },
              player_id: { type: 'string', format: 'uuid' },
              minute: { type: 'integer', minimum: 1, maximum: 120 },
              goal_type: { type: 'string', enum: ['NORMAL', 'PENALTY', 'FREE_KICK', 'OWN_GOAL'] }
            }
          }
        }
      }
    };

    return {
      name: 'OpenAPI Specification',
      targetSubDir: 'api',
      filename: 'openapi.json',
      content: JSON.stringify(specObj, null, 2),
      generatorId: 'gen-openapi-spec',
      generatorVersion: '1.0.0',
      cirVersion: cir.cirSchemaVersion
    };
  }
};
