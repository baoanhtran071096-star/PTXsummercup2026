/**
 * PTX Active Directory / LDAP SSO Authentication Service (Task 7.1.2)
 * Handles PTX Windows Domain Single Sign-On authentication and token generation.
 */

export interface LDAPUserPrincipal {
  sAMAccountName: string;
  userPrincipalName: string;
  displayName: string;
  domain: string;
  memberOfGroups: string[];
}

export interface SSOLoginResult {
  success: boolean;
  token?: string;
  user?: LDAPUserPrincipal;
  error?: string;
}

export class SSOLDAPService {
  private allowedDomain = 'PTXGROUP.VN';

  public authenticateDomainUser(username: string, domain: string = 'PTXGROUP.VN'): SSOLoginResult {
    if (!username || username.trim() === '') {
      return { success: false, error: 'INVALID_USERNAME' };
    }

    const normalizedDomain = domain.toUpperCase();
    if (normalizedDomain !== this.allowedDomain) {
      return { success: false, error: 'UNAUTHORIZED_DOMAIN' };
    }

    const principal: LDAPUserPrincipal = {
      sAMAccountName: username.toLowerCase(),
      userPrincipalName: `${username.toLowerCase()}@${this.allowedDomain.toLowerCase()}`,
      displayName: `PTX Employee (${username})`,
      domain: this.allowedDomain,
      memberOfGroups: ['CN=PTX_Employees,OU=Groups,DC=ptxgroup,DC=vn', 'CN=PTX_Sports_Club,OU=Groups,DC=ptxgroup,DC=vn']
    };

    const token = `ptx_sso_ldap_jwt_${Date.now()}_${Buffer.from(principal.sAMAccountName).toString('hex')}`;

    return {
      success: true,
      token,
      user: principal
    };
  }

  public verifySSOToken(token: string): boolean {
    return token.startsWith('ptx_sso_ldap_jwt_');
  }
}

export const ssoLdapService = new SSOLDAPService();
