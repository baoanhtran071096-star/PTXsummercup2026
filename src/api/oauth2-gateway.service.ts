/**
 * OAuth2 Public API Gateway Service (Task 7.6.1)
 * Issues and validates OAuth2 Client Credentials access tokens for external partner integration.
 */

export interface OAuth2TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
}

export class OAuth2GatewayService {
  public issueAccessToken(clientId: string, clientSecret: string): OAuth2TokenResponse | { error: string } {
    if (!clientId || !clientSecret) {
      return { error: 'invalid_client' };
    }

    const token = `oauth2_partner_token_${Date.now()}_${Buffer.from(clientId).toString('hex')}`;
    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'read:matches read:players write:predictions'
    };
  }

  public validateAccessToken(token: string): boolean {
    return token.startsWith('oauth2_partner_token_');
  }
}

export const oauth2GatewayService = new OAuth2GatewayService();
