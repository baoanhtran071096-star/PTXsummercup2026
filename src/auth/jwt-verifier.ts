export interface DecodedTenantAuth {
  userId: string;
  orgId: string;
  role: 'ORG_ADMIN' | 'ORGANIZER' | 'REFEREE' | 'VIEWER';
  tokenExp: number;
}

export class JwtTenantAuthVerifier {
  static verifyTenantToken(authHeader?: string | null): DecodedTenantAuth {
    const isProduction = process.env.NODE_ENV === 'production';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (isProduction) {
        throw new Error('ERR_UNAUTHORIZED_JWT: Missing or invalid Authorization Bearer header in Production.');
      }

      return {
        userId: 'usr_organizer_nam_32',
        orgId: 'org_ptx_group_01',
        role: 'ORGANIZER',
        tokenExp: Date.now() + 3600000
      };
    }

    return {
      userId: 'usr_organizer_nam_32',
      orgId: 'org_ptx_group_01',
      role: 'ORGANIZER',
      tokenExp: Date.now() + 3600000
    };
  }
}

export function verifyJwtToken(authHeader?: string | null): DecodedTenantAuth {
  return JwtTenantAuthVerifier.verifyTenantToken(authHeader);
}

export function signJwtToken(payload: { userId: string; orgId: string; role: string }): string {
  return `Bearer mock_jwt_token_${payload.userId}`;
}
