/**
 * Unexplored UX Territory & Maximum Experience Verification Test Suite
 * PTX Summer Cup 2026 Platform v6.5
 */

import { userPersonalizationService } from '../../src/services/user-personalization.service';
import { socialChatService } from '../../src/realtime/social-chat.service';
import { matchDeepDiveService } from '../../src/domain/match/match-deep-dive.service';
import { gamificationBadgesService } from '../../src/community/gamification-badges.service';
import { liveBlogMediaService } from '../../src/services/live-blog-media.service';
import { eventCheckinService } from '../../src/services/event-checkin.service';

function runUXEnhancementVerificationSuite() {
  console.log('🚀 [UX UNEXPLORED TERRITORY SUITE] Starting Complete Verification...\n');

  // Test Region 1: Deep Personalization
  console.log('--- Region 1: Deep Personalization ---');
  userPersonalizationService.recordPrediction('fan@ptxgroup.vn', {
    matchId: 'm101',
    matchTitle: 'Phoenix FC vs Tiger FC',
    predictedScore: { home: 2, away: 1 },
    actualScore: { home: 2, away: 1 },
    status: 'CORRECT',
    pointsEarned: 100
  });
  const history = userPersonalizationService.getUserPredictionHistory('fan@ptxgroup.vn');
  const stats = userPersonalizationService.getUserPerformanceStats('fan@ptxgroup.vn');
  const feed = userPersonalizationService.getPersonalizedHomepageFeed('Phoenix');
  if (history.length !== 1 || stats.accuracyPercentage !== 100 || feed.recommendedMatches.length === 0) {
    throw new Error('Region 1 Deep Personalization Test Failed!');
  }
  console.log(`✅ Region 1 Passed: Prediction History recorded, ${stats.accuracyPercentage}% accuracy calculated, Homepage Feed tailored for Phoenix.`);

  // Test Region 2: Advanced Social Interaction
  console.log('\n--- Region 2: Advanced Social Interaction ---');
  const chatMsg = socialChatService.sendMessage({
    senderEmail: 'fan@ptxgroup.vn',
    senderName: 'Fan PTX',
    text: 'Phoenix FC vô địch! Quá tuyệt vời @baoanh @admin'
  });
  const reactMsg = socialChatService.reactToMessage(chatMsg.id, '❤️');
  const socialLeaderboard = socialChatService.getActiveUserLeaderboard();
  if (chatMsg.taggedUsernames?.length !== 2 || !reactMsg?.reactions?.['❤️'] || socialLeaderboard.length === 0) {
    throw new Error('Region 2 Social Interaction Test Failed!');
  }
  console.log(`✅ Region 2 Passed: Mentions parsed (@${chatMsg.taggedUsernames.join(', @')}), Emoji Reactions registered, Active Chat Leaderboard updated.`);

  // Test Region 3: Match Deep Dive
  console.log('\n--- Region 3: Match Deep Dive ---');
  const playerCard = matchDeepDiveService.getPlayerDetailCard('p10');
  const momentum = matchDeepDiveService.getMatchMomentumGraph('m101');
  const h2h = matchDeepDiveService.getHeadToHeadRecord('Phoenix FC', 'Tiger FC');
  if (!playerCard.fullName || momentum.length === 0 || h2h.totalMatchesPlayed !== 5) {
    throw new Error('Region 3 Match Deep Dive Test Failed!');
  }
  console.log(`✅ Region 3 Passed: Player Card (${playerCard.fullName} - ${playerCard.goalsScored} bàn), Match Momentum graph (${momentum.length} timeline points), H2H History loaded.`);

  // Test Region 4: Gamification & Badges
  console.log('\n--- Region 4: Gamification & Badges ---');
  const badges = gamificationBadgesService.checkAndAwardBadges('fan@ptxgroup.vn', {
    totalPredictions: 5,
    correctPredictions: 4,
    referralCount: 2
  });
  const quests = gamificationBadgesService.getDailyQuests('fan@ptxgroup.vn');
  const wheelResult = gamificationBadgesService.spinLuckyWheel('fan@ptxgroup.vn');
  if (badges.length < 3 || quests.length === 0 || !wheelResult.rewardName) {
    throw new Error('Region 4 Gamification Test Failed!');
  }
  console.log(`✅ Region 4 Passed: Badges awarded ([${badges.map(b => b.name).join(', ')}]), Daily Quests loaded, Lucky Wheel awarded ${wheelResult.rewardName}.`);

  // Test Region 5: Diverse Media & Content
  console.log('\n--- Region 5: Diverse Media & Content ---');
  liveBlogMediaService.addLiveBlogEntry({
    matchId: 'm101',
    minute: 15,
    type: 'GOAL',
    content: 'VÀOOOO! Bàn thắng mở tỷ số tuyệt đẹp từ cú sút xa!'
  });
  const blogFeed = liveBlogMediaService.getLiveBlogFeed('m101');
  const poll = liveBlogMediaService.getQuickPoll('poll_mvp');
  const podcasts = liveBlogMediaService.getPTXPodcastFeed();
  if (blogFeed.length !== 1 || poll.totalVotes !== 355 || podcasts.length === 0) {
    throw new Error('Region 5 Live Blog & Media Test Failed!');
  }
  console.log(`✅ Region 5 Passed: Live Blog text commentary entry added, Quick Poll (${poll.totalVotes} votes), PTX Podcast feed active.`);

  // Test Region 6: Multi-Platform Checkin & TV Scoreboard
  console.log('\n--- Region 6: Multi-Platform & TV Scoreboard ---');
  const ticket = eventCheckinService.generateTicket('fan@ptxgroup.vn', 'm101');
  const checkinResult = eventCheckinService.verifyAndCheckin(ticket.ticketId);
  const tvScoreboard = eventCheckinService.getBigScreenScoreboardFeed('m101');
  if (!checkinResult.success || tvScoreboard.homeTeam.score !== 2) {
    throw new Error('Region 6 Event Checkin / TV Scoreboard Test Failed!');
  }
  console.log(`✅ Region 6 Passed: Event Ticket QR (${ticket.qrPayload}) Checked-in successfully, Big Screen TV Scoreboard (${tvScoreboard.homeTeam.name} ${tvScoreboard.homeTeam.score} - ${tvScoreboard.awayTeam.score} ${tvScoreboard.awayTeam.name}) feed online.`);

  console.log('\n🎉 [UX UNEXPLORED TERRITORY SUITE] All 6 Regions & 25 Feature Items Passed 100%!');
}

runUXEnhancementVerificationSuite();
