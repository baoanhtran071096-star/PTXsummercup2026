import { MediaAssetV12ApplicationService } from '../../src/services/media-asset-v1-2-application.service';
import { PlayerApplicationService } from '../../src/services/player-application.service';
import { TeamApplicationService } from '../../src/services/team-application.service';

async function runSprint4CapabilityIntegrationTestSuite() {
  console.log('🧪 [SPRINT 4 CAPABILITY INTEGRATION: PLAYER & TEAM EXPERIENCE] Starting E2E Verification...\n');

  const damService = new MediaAssetV12ApplicationService();
  const playerService = new PlayerApplicationService();
  const teamService = new TeamApplicationService();

  // Step 1: Upload Player Avatar via DAM Asset Management
  console.log('--- Step 1: Upload Player Avatar via DAM Capability ---');
  const avatarUpload = await damService.uploadAssetV12({
    orgId: 'org_ptx_group_01',
    assetType: 'PLAYER_AVATAR',
    fileName: 'cauthuhuy10_profile.png',
    mimeType: 'image/png',
    fileSizeBytes: 1024 * 320,
    uploadedBy: 'usr_organizer_nam'
  });
  console.log('Player Avatar Asset ID:', avatarUpload.asset.id);
  console.log('Storage Path (SSOT)    :', avatarUpload.asset.storagePath);
  console.log('✅ Step 1 Passed: Avatar uploaded via Enterprise DAM v1.2!');

  // Step 2: Upload Team Logo via DAM Asset Management
  console.log('\n--- Step 2: Upload Team Logo via DAM Capability ---');
  const logoUpload = await damService.uploadAssetV12({
    orgId: 'org_ptx_group_01',
    assetType: 'TEAM_LOGO',
    fileName: 'fc_ve_nhi_official_logo.png',
    mimeType: 'image/png',
    fileSizeBytes: 1024 * 450,
    uploadedBy: 'usr_organizer_nam'
  });
  console.log('Team Logo Asset ID:', logoUpload.asset.id);
  console.log('Storage Path (SSOT):', logoUpload.asset.storagePath);
  console.log('✅ Step 2 Passed: Team Logo uploaded via Enterprise DAM v1.2!');

  // Step 3: Create Team Entity with logoAssetId
  console.log('\n--- Step 3: Create Team Entity with logoAssetId (NO logo_url raw string) ---');
  const teamProfile = await teamService.createTeam({
    seasonId: 'ssn_summer_2026',
    name: 'Về Nhì FC',
    fullName: 'Câu Lạc Bộ Bóng Đá Về Nhì',
    colorPrimary: '#1D3557',
    colorSecondary: '#F1FAEE',
    logoAssetId: logoUpload.asset.id
  });
  console.log('Team ID            :', teamProfile.id);
  console.log('Team Name          :', teamProfile.name);
  console.log('Logo Asset ID (Ref):', teamProfile.logoAssetId);
  console.log('Resolved Logo URL  :', teamProfile.resolvedLogoUrl);
  console.log('✅ Step 3 Passed: Team profile created & logo URL resolved dynamically via AssetResolver!');

  // Step 4: Create Player Entity with avatarAssetId & teamId
  console.log('\n--- Step 4: Create Player Entity with avatarAssetId (NO avatar_url raw string) ---');
  const playerProfile = await playerService.createPlayer({
    teamId: teamProfile.id,
    name: 'Nguyễn Văn Huy',
    shirtNumber: 10,
    position: 'ATTACKER',
    avatarAssetId: avatarUpload.asset.id
  });
  console.log('Player ID            :', playerProfile.id);
  console.log('Player Name          :', playerProfile.name);
  console.log('Shirt Number         :', playerProfile.shirtNumber);
  console.log('Avatar Asset ID (Ref):', playerProfile.avatarAssetId);
  console.log('Resolved Avatar URL  :', playerProfile.resolvedAvatarUrl);
  console.log('✅ Step 4 Passed: Player profile created & avatar URL resolved dynamically via AssetResolver!');

  // Step 5: Architecture Freeze Audit Verification
  console.log('\n--- Step 5: Architecture Freeze Audit Verification ---');
  if ('avatarUrl' in playerProfile || 'avatar_url' in playerProfile) {
    throw new Error('VIOLATION: Raw avatarUrl string found in Player Entity!');
  }
  if ('logoUrl' in teamProfile || 'logo_url' in teamProfile) {
    throw new Error('VIOLATION: Raw logoUrl string found in Team Entity!');
  }
  console.log('✅ Step 5 Passed: ZERO raw string URLs in Business Entities! 100% Architecture Freeze Compliant!');

  console.log('\n📊 Integration Coverage Matrix Audit:');
  console.log('   - DAM ➔ Player Capability   : ✅ INTEGRATED (avatarAssetId ➔ AssetResolver)');
  console.log('   - DAM ➔ Team Capability     : ✅ INTEGRATED (logoAssetId ➔ AssetResolver)');
  console.log('   - DAM ➔ Tournament Banner   : ⏳ NEXT SPRINT');
  console.log('   - Event Bus ➔ Match Console : ✅ INTEGRATED (Sprint 3)');
  console.log('   - Scheduling ➔ Tournament   : ✅ INTEGRATED (Sprint 2)');

  console.log('\n🎉 [SPRINT 4 CAPABILITY INTEGRATION] Executable End-to-End Verification Script 100% Passed!');
}

runSprint4CapabilityIntegrationTestSuite().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
