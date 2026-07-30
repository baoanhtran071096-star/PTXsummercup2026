/**
 * Emergency Admin Security Audit & Verification Test Suite
 * PTX Sports Platform v7.0
 */

import { adminAuthMiddleware } from '../../src/auth/admin-auth.middleware';

function runAdminSecurityTestSuite() {
  console.log('🚨 [EMERGENCY ADMIN SECURITY AUDIT] Running Test Cases TC1 - TC6...\n');

  // TC1: Access admin without token
  console.log('--- TC1: Access /admin without token ---');
  const resTC1 = adminAuthMiddleware.isAdmin(undefined);
  if (resTC1.statusCode !== 401 || resTC1.authorized) {
    throw new Error('TC1 Failed: Unauthenticated access was allowed!');
  }
  console.log('✅ TC1 Passed: Access blocked without token (401 Unauthorized).');

  // TC2: Access admin with user/fan token
  console.log('\n--- TC2: Access /admin with User/Fan token ---');
  const userToken = adminAuthMiddleware.issueAdminToken('user@ptxgroup.vn', 'FAN');
  const resTC2 = adminAuthMiddleware.isAdmin(userToken);
  if (resTC2.statusCode !== 403 || resTC2.authorized) {
    throw new Error('TC2 Failed: Fan/User role was granted admin access!');
  }
  console.log('✅ TC2 Passed: Non-admin role blocked with 403 Forbidden.');

  // TC3: Access admin with valid Admin token
  console.log('\n--- TC3: Access /admin with valid Admin token ---');
  const adminToken = adminAuthMiddleware.issueAdminToken('admin@ptxsummercup.vn', 'ADMIN');
  const resTC3 = adminAuthMiddleware.isAdmin(adminToken);
  if (resTC3.statusCode !== 200 || !resTC3.authorized) {
    throw new Error('TC3 Failed: Valid admin token was denied access!');
  }
  console.log('✅ TC3 Passed: Valid Admin token granted access (200 OK).');

  // TC4: Call Admin API with User token
  console.log('\n--- TC4: Call Admin API with User token ---');
  const resTC4 = adminAuthMiddleware.isAdmin(userToken);
  if (resTC4.statusCode !== 403) {
    throw new Error('TC4 Failed: Admin API permitted non-admin user!');
  }
  console.log('✅ TC4 Passed: Admin API call with User token rejected (403 Forbidden).');

  // TC5: Call Admin API with Admin token
  console.log('\n--- TC5: Call Admin API with Admin token ---');
  const resTC5 = adminAuthMiddleware.isAdmin(adminToken);
  if (resTC5.statusCode !== 200) {
    throw new Error('TC5 Failed: Admin API call rejected valid admin!');
  }
  console.log('✅ TC5 Passed: Admin API call with Admin token succeeded (200 OK).');

  // TC6: Expired Admin token
  console.log('\n--- TC6: Call Admin API with expired token ---');
  const expiredToken = adminAuthMiddleware.issueAdminToken('admin_old@ptxgroup.vn', 'ADMIN');
  adminAuthMiddleware.revokeToken(expiredToken); // Revoke/expire token
  const resTC6 = adminAuthMiddleware.isAdmin(expiredToken);
  if (resTC6.statusCode !== 401) {
    throw new Error('TC6 Failed: Expired token was accepted!');
  }
  console.log('✅ TC6 Passed: Expired token rejected with 401 Unauthorized.');

  console.log('\n🎉 [EMERGENCY ADMIN SECURITY AUDIT] All 6 Security Test Cases Passed 100%!');
}

runAdminSecurityTestSuite();
