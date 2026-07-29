import { AssetType, AssetStatus, AssetMetadata } from './asset-v1-1-models';

export type { AssetType, AssetStatus, AssetMetadata };

export type ImageVariantSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original';

export interface ImageVariant {
  size: ImageVariantSize;
  width: number;
  height: number;
  storagePath: string;
}

export interface AssetAuditTrail {
  uploadedBy: string;
  createdBy: string;
  replacedBy?: string;
  deletedBy?: string;
  deletionReason?: string;
  replacementReason?: string;
}

export interface MediaAssetV12 {
  id: string;
  orgId: string;
  assetType: AssetType;
  assetVersion: number; // Asset Versioning (v1, v2, v3...)
  status: AssetStatus;
  storageProvider: 'SUPABASE_STORAGE' | 'CLOUDFLARE_R2' | 'AWS_S3';
  bucketName: string;
  storagePath: string; // SINGLE SOURCE OF TRUTH
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  isSignedOnly: boolean; // Access Policy Matrix
  variants: ImageVariant[];
  auditTrail: AssetAuditTrail;
  metadata: AssetMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface SignedUrlPolicy {
  isSignedOnly: boolean;
  defaultExpiresInSec: number;
}

export const SIGNED_URL_POLICY_MATRIX: Record<AssetType, SignedUrlPolicy> = {
  PLAYER_AVATAR: { isSignedOnly: false, defaultExpiresInSec: 86400 },
  TEAM_LOGO: { isSignedOnly: false, defaultExpiresInSec: 86400 },
  TOURNAMENT_BANNER: { isSignedOnly: false, defaultExpiresInSec: 86400 },
  SPONSOR_LOGO: { isSignedOnly: false, defaultExpiresInSec: 86400 },
  MATCH_PHOTO: { isSignedOnly: true, defaultExpiresInSec: 3600 },
  HALL_OF_FAME: { isSignedOnly: false, defaultExpiresInSec: 86400 },
  DOCUMENT_PDF: { isSignedOnly: true, defaultExpiresInSec: 3600 },
  VIDEO_CLIP: { isSignedOnly: true, defaultExpiresInSec: 7200 }
};
