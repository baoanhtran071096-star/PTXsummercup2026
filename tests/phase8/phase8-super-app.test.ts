/**
 * Phase 8 Sports Super App Complete Verification Suite
 * PTX Sports Platform v6.5 Ultra Performance
 */

import { stadiumView3DService } from '../../src/services/stadium-view-3d.service';
import { multiChannelPushService } from '../../src/services/multichannel-push.service';
import { privateFanGroupService } from '../../src/community/private-fan-group.service';
import { aiMatchStoryService } from '../../src/ai/ai-match-story.service';
import { excelIOService } from '../../src/services/excel-io.service';
import { paymentService } from '../../src/services/payment-momo-vnpay.service';

function runPhase8SuperAppVerificationSuite() {
  console.log('🚀 [PHASE 8 SPORTS SUPER APP SUITE] Starting Complete Verification...\n');

  // Test 1: Group A - 3D Stadium View & Push Notifications
  console.log('--- Test 8.A: 3D Stadium View & Multi-channel Push ---');
  const stadiumState = stadiumView3DService.getStadium3DState('m101');
  const pushReceipt = multiChannelPushService.dispatchNotification({
    userEmail: 'admin@ptxsummercup.vn',
    title: 'GOAL ALERT!',
    message: 'Phoenix FC 2 - 1 Tiger FC',
    channels: ['WEB_PUSH', 'EMAIL', 'SMS']
  });
  if (stadiumState.players.length === 0 || pushReceipt.channelsDelivered.length !== 3) {
    throw new Error('Group A Test Failed!');
  }
  console.log(`✅ Group A Passed: 3D Stadium View loaded (${stadiumState.players.length} players tracked), Multi-channel Push sent across ${pushReceipt.channelsDelivered.join(', ')}.`);

  // Test 2: Group B - Private Fan Group Chat
  console.log('\n--- Test 8.B: Private Fan Group Chat ---');
  const fanGroup = privateFanGroupService.createFanGroup('Hội CĐV Phoenix Hà Nội', 'fan1@ptxgroup.vn');
  const joined = privateFanGroupService.joinFanGroup(fanGroup.groupId, 'fan2@ptxgroup.vn');
  if (!joined || fanGroup.memberEmails.length !== 2) {
    throw new Error('Group B Test Failed!');
  }
  console.log(`✅ Group B Passed: Private Fan Group Created (${fanGroup.groupName}), ${fanGroup.memberEmails.length} members joined via invite ${fanGroup.inviteCode}.`);

  // Test 3: Group C - AI Automatic Match Summary
  console.log('\n--- Test 8.C: AI Match Summary Generator ---');
  const aiStory = aiMatchStoryService.generateMatchSummaryStory({
    matchId: 'm101',
    homeTeam: 'Phoenix FC',
    awayTeam: 'Tiger FC',
    homeScore: 2,
    awayScore: 1,
    keyEvents: ['Siêu phẩm sút xa phút 15', 'Bàn gỡ hòa phút 40']
  });
  if (!aiStory.articleTitle.includes('Phoenix FC') || !aiStory.articleBody.includes('2 - 1')) {
    throw new Error('Group C Test Failed!');
  }
  console.log(`✅ Group C Passed: AI Story Generated (${aiStory.articleTitle}).`);

  // Test 4: Group D - Excel Import/Export
  console.log('\n--- Test 8.D: Excel Import & Export Engine ---');
  const excelResult = excelIOService.exportToExcelBuffer({
    sheetName: 'Teams_List',
    columns: ['ID', 'TeamName'],
    rows: [{ ID: 1, TeamName: 'Phoenix FC' }, { ID: 2, TeamName: 'Tiger FC' }]
  });
  if (!excelResult.filename.includes('.xlsx')) {
    throw new Error('Group D Test Failed!');
  }
  console.log(`✅ Group D Passed: Excel Export File Generated (${excelResult.filename}).`);

  // Test 5: Group F - MoMo & VNPay Payment Engine
  console.log('\n--- Test 8.F: Payment Gateway Checkout ---');
  const payment = paymentService.createCheckoutTransaction({
    orderId: 'ord_998',
    amount: 150000,
    provider: 'MOMO',
    orderInfo: 'Áo đấu Phoenix FC 2026'
  });
  if (!payment.paymentUrl.includes('momo') || !payment.qrCodeData) {
    throw new Error('Group F Test Failed!');
  }
  console.log(`✅ Group F Passed: Payment Checkout URL Generated (${payment.paymentUrl}).`);

  // Test 6: Database Backup Scheduler (2:00 AM Task)
  console.log('\n--- Test 8.Ops: Database Backup Scheduler (2:00 AM) ---');
  const { databaseBackupSchedulerService } = require('../../src/governance/database-backup-scheduler.service');
  const backupReceipt = databaseBackupSchedulerService.triggerDailyBackup();
  if (backupReceipt.status !== 'SUCCESS') {
    throw new Error('Backup Scheduler Test Failed!');
  }
  console.log(`✅ Ops Passed: Automated Backup Executed (${backupReceipt.backupFileName}).`);

  console.log('\n🎉 [PHASE 8 SPORTS SUPER APP SUITE] All Workstreams Passed 100%!');
}

runPhase8SuperAppVerificationSuite();
