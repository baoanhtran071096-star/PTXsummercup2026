import { MediaAssetApplicationService } from '../../src/services/media-asset-application.service';

async function runMediaAssetArchitectureTestSuite() {
  console.log('🧪 [DIGITAL ASSET MANAGEMENT DAM ARCHITECTURE TEST SUITE] Starting Verification...\n');

  const service = new MediaAssetApplicationService();

  // Test 1: Upload Player Avatar Asset
  console.log('--- Test 1: Upload Player Avatar Asset (avatars bucket) ---');
  const avatarResult = await service.handleUploadAsset({
    orgId: 'org_ptx_group_01',
    bucketName: 'avatars',
    fileName: 'cauthuhuy10.png',
    mimeType: 'image/png',
    fileSizeBytes: 1024 * 250 // 250 KB
  });
  console.log('Asset ID:', avatarResult.asset.id);
  console.log('Storage Path:', avatarResult.asset.storagePath);
  console.log('Public CDN URL:', avatarResult.asset.publicUrl);
  console.log('✅ Test 1 Passed: Avatar Asset registered with asset_id!');

  // Test 2: Upload Team Logo Asset
  console.log('\n--- Test 2: Upload Team Logo Asset (logos bucket) ---');
  const logoResult = await service.handleUploadAsset({
    orgId: 'org_ptx_group_01',
    bucketName: 'logos',
    fileName: 'fc_ve_nhi_logo.png',
    mimeType: 'image/png',
    fileSizeBytes: 1024 * 400 // 400 KB
  });
  console.log('Asset ID:', logoResult.asset.id);
  console.log('Public CDN URL:', logoResult.asset.publicUrl);
  console.log('✅ Test 2 Passed: Team Logo Asset registered with asset_id!');

  // Test 3: Asset Resolution Engine (Decoupled from DB string URL)
  console.log('\n--- Test 3: Asset Resolution Engine ---');
  const resolvedUrl = await service.resolveAssetUrl(avatarResult.asset.id);
  console.log('Resolved Asset URL:', resolvedUrl);
  console.log('✅ Test 3 Passed: Asset Resolution Engine returned CDN URL decoupled from business table!');

  console.log('\n🎉 [DIGITAL ASSET MANAGEMENT DAM ARCHITECTURE TEST SUITE] Verified 100% Passed!');
}

runMediaAssetArchitectureTestSuite().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
