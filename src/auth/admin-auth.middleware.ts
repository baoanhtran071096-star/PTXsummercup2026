/**
 * Emergency Admin Security & Authorization Middleware
 * Protects Admin Panel routes and Admin APIs against unauthorized access.
 */

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: 'ADMIN' | 'ORGANIZER' | 'STAFF' | 'FAN';
  otpVerified?: boolean;
}

export interface AdminAuthResult {
  authorized: boolean;
  statusCode: number;
  message: string;
  user?: AuthenticatedUser;
}

export class AdminAuthMiddleware {
  private validAdminTokens: Map<string, { user: AuthenticatedUser; expiresAt: number }> = new Map();

  constructor() {
    // Seed default admin token
    this.issueAdminToken('admin@ptxsummercup.vn', 'ADMIN');
  }

  public issueAdminToken(email: string, role: 'ADMIN' | 'ORGANIZER' | 'STAFF' | 'FAN'): string {
    const token = `admin_jwt_${Date.now()}_${Buffer.from(email).toString('hex')}`;
    const expiresAt = Date.now() + 3600 * 1000; // 1 hour validity

    this.validAdminTokens.set(token, {
      user: {
        userId: 'usr_admin_01',
        email,
        role,
        otpVerified: false
      },
      expiresAt
    });

    return token;
  }

  public verifyAdminOTP(token: string, otpCode: string): boolean {
    const session = this.validAdminTokens.get(token);
    if (!session) return false;

    // Simulation: OTP 123456 or 654321 is valid
    if (otpCode === '123456' || otpCode === '654321') {
      session.user.otpVerified = true;
      return true;
    }
    return false;
  }

  public isAdmin(token?: string): AdminAuthResult {
    if (!token || token.trim() === '') {
      return {
        authorized: false,
        statusCode: 401,
        message: 'Unauthorized: No admin token provided'
      };
    }

    const session = this.validAdminTokens.get(token);
    if (!session) {
      return {
        authorized: false,
        statusCode: 401,
        message: 'Unauthorized: Invalid token'
      };
    }

    if (Date.now() > session.expiresAt) {
      this.validAdminTokens.delete(token);
      return {
        authorized: false,
        statusCode: 401,
        message: 'Unauthorized: Token has expired'
      };
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER') {
      return {
        authorized: false,
        statusCode: 403,
        message: 'Forbidden: Admin access required'
      };
    }

    return {
      authorized: true,
      statusCode: 200,
      message: 'Access granted to Admin Panel',
      user: session.user
    };
  }

  public revokeToken(token: string): void {
    this.validAdminTokens.delete(token);
  }
}

export const adminAuthMiddleware = new AdminAuthMiddleware();
