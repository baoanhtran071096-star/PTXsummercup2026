/**
 * Phase 7 Complete Integration & Verification Test Suite
 * PTX Summer Cup 2026 Platform v6.5
 */

import { hrmsService } from '../../src/integration/hrms.service';
import { ssoLdapService } from '../../src/auth/sso-ldap.service';
import { emailServerService } from '../../src/integration/email-server.service';
import { cdnImageService } from '../../src/services/cdn-image.service';
import { securityMiddleware } from '../../src/middleware/security-hardening.middleware';
import { biometricAuthService } from '../../src/mobile/biometric-auth.service';
import { offlineSyncEngine } from '../../src/mobile/offline-sync.service';
import { aiPredictorV2 } from '../../src/ai/match-predictor-v2.service';
import { btcSmartDashboardService } from '../../src/services/btc-smart-dashboard.service';
import { fanClubService } from '../../src/community/fan-club.service';
import { oauth2GatewayService } from '../../src/api/oauth2-gateway.service';
import { webhookDispatcherService } from '../../src/api/webhook-dispatcher.service';

function runPhase7VerificationSuite() {
  console.log('🚀 [PHASE 7 VERIFICATION SUITE] Executing Strategic Upgrade Tests...\n');

  // Test 1: HRMS PTX Employee Sync
  console.log('--- Test 7.1.1: HRMS Integration ---');
  const syncResult = hrmsService.syncEmployeesFromHRMS([
    { employeeId: 'PTX-003', fullName: 'Nguyen Van A', email: 'nva@ptxgroup.vn', department: 'Software Engineering', role: 'STAFF', active: true }
  ]);
  if (syncResult.syncedCount !== 1 || syncResult.newAccountsCreated !== 1) {
    throw new Error('HRMS Sync Failed!');
  }
  console.log('✅ Test 7.1.1 Passed: HRMS Directory Synced & Accounts Created.');

  // Test 2: SSO LDAP Domain Authentication
  console.log('\n--- Test 7.1.2: SSO LDAP Authentication ---');
  const ssoAuth = ssoLdapService.authenticateDomainUser('baoanh', 'PTXGROUP.VN');
  if (!ssoAuth.success || !ssoAuth.token) {
    throw new Error('SSO LDAP Authentication Failed!');
  }
  console.log(`✅ Test 7.1.2 Passed: Windows Domain SSO Token Issued (${ssoAuth.user?.userPrincipalName}).`);

  // Test 3: SMTP Email Dispatch
  console.log('\n--- Test 7.1.3: SMTP Email Dispatch ---');
  const emailReceipt = emailServerService.sendEmail({
    to: 'admin@ptxsummercup.vn',
    subject: 'PTX Summer Cup Match Daily Digest',
    bodyHtml: '<p>Tournament digest report</p>'
  });
  if (emailReceipt.status !== 'DELIVERED') {
    throw new Error('SMTP Email Dispatch Failed!');
  }
  console.log(`✅ Test 7.1.3 Passed: Email Dispatched via PTX SMTP (${emailReceipt.messageId}).`);

  // Test 4: CDN & Image Optimization
  console.log('\n--- Test 7.2.1: CDN Image Optimization ---');
  const cdnResult = cdnImageService.getOptimizedImageUrl('https://ptx.vn/banner.jpg', { format: 'webp', quality: 90 });
  if (!cdnResult.cdnUrl.includes('.webp')) {
    throw new Error('CDN Image Optimization Failed!');
  }
  console.log(`✅ Test 7.2.1 Passed: Image Transformed to WebP (${cdnResult.cdnUrl}).`);

  // Test 5: Security Hardening CSP
  console.log('\n--- Test 7.2.3: Security Hardening & CSP ---');
  const headers = securityMiddleware.getSecurityHeaders();
  if (!headers['Content-Security-Policy'] || headers['X-Frame-Options'] !== 'DENY') {
    throw new Error('Security CSP Middleware Audit Failed!');
  }
  console.log('✅ Test 7.2.3 Passed: Strict CSP & OWASP Security Headers Enforced.');

  // Test 6: Mobile Biometrics & Offline Sync
  console.log('\n--- Test 7.3: Mobile Biometrics & Offline Sync ---');
  const bioAuth = biometricAuthService.verifyBiometricToken('valid_face_id_token_1234567890', 'FACE_ID');
  offlineSyncEngine.queueOfflineEvent({
    eventId: 'evt_off_001',
    action: 'VOTE_PLAYER',
    payload: { playerId: 'p1' },
    clientTimestamp: Date.now()
  });
  const offlineResult = offlineSyncEngine.syncQueuedEvents();
  if (!bioAuth.authenticated || offlineResult.syncedCount !== 1) {
    throw new Error('Mobile Auth/Sync Test Failed!');
  }
  console.log('✅ Test 7.3 Passed: Mobile Biometric Challenge & Offline Sync Verified.');

  // Test 7: AI Predictor V2
  console.log('\n--- Test 7.4.1: AI Match Predictor V2 ---');
  const prediction = aiPredictorV2.predictMatchOutcome({
    homeTeam: 'Phoenix',
    awayTeam: 'Tiger',
    recentFormHome: [3, 2, 1, 3, 2],
    recentFormAway: [1, 1, 0, 2, 1]
  });
  if (prediction.confidenceScore < 90) {
    throw new Error('AI Predictor V2 Accuracy Below Threshold!');
  }
  console.log(`✅ Test 7.4.1 Passed: AI Predictor Score (${prediction.predictedScore.home} - ${prediction.predictedScore.away}) with ${prediction.confidenceScore}% confidence.`);

  // Test 8: BTC Smart Dashboard
  console.log('\n--- Test 7.4.4: BTC Smart Dashboard ---');
  const metrics = btcSmartDashboardService.getDashboardOverview();
  if (metrics.activeUsersNow < 1000) {
    throw new Error('BTC Dashboard Metrics Incomplete!');
  }
  console.log(`✅ Test 7.4.4 Passed: Smart BTC Dashboard Loaded (${metrics.activeUsersNow} active users).`);

  // Test 9: Fan Club Service
  console.log('\n--- Test 7.5.1: Exclusive Fan Club Hub ---');
  fanClubService.joinFanClub('fan1@ptxgroup.vn', 'PHOENIX');
  const leaderboard = fanClubService.getClubLeaderboard('PHOENIX');
  if (leaderboard.length === 0) {
    throw new Error('Fan Club Leaderboard Empty!');
  }
  console.log(`✅ Test 7.5.1 Passed: Fan Club Hub Active (${leaderboard.length} Phoenix Fans registered).`);

  // Test 10: OAuth2 API Gateway & Webhook Dispatcher
  console.log('\n--- Test 7.6: OAuth2 Gateway & Webhook Engine ---');
  const oauthToken = oauth2GatewayService.issueAccessToken('partner_app_01', 'secret_xyz');
  if (!('access_token' in oauthToken)) {
    throw new Error('OAuth2 Token Generation Failed!');
  }
  webhookDispatcherService.registerWebhook({
    partnerId: 'partner_app_01',
    targetUrl: 'https://partner.com/webhook',
    secret: 'wh_sec_123',
    subscribedEvents: ['MATCH_GOAL']
  });
  const dispatchResults = webhookDispatcherService.dispatchMatchEvent('MATCH_GOAL', { matchId: 'm1', goalScorer: 'p2' });
  if (dispatchResults.length !== 1 || !dispatchResults[0].delivered) {
    throw new Error('Webhook Dispatch Failed!');
  }
  console.log('✅ Test 7.6 Passed: OAuth2 Partner Token & Realtime Webhook Dispatched Successfully.');

  console.log('\n🎉 [PHASE 7 VERIFICATION SUITE] All 10 Task Group Verification Tests Passed 100%!');
}

runPhase7VerificationSuite();
