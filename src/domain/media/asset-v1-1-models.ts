export type AssetType =
  | 'PLAYER_AVATAR'
  | 'TEAM_LOGO'
  | 'TOURNAMENT_BANNER'
  | 'SPONSOR_LOGO'
  | 'MATCH_PHOTO'
  | 'HALL_OF_FAME'
  | 'DOCUMENT_PDF'
  | 'VIDEO_CLIP';

export type AssetStatus = 'UPLOADING' | 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface AssetMetadata {
  checksum: string;
  width?: number;
  height?: number;
  orientation?: 'PORTRAIT' | 'LANDSCAPE' | 'SQUARE';
  dominantColor?: string;
  uploadedBy: string;
  createdBy: string;
  format: string;
}

export interface MediaAssetV11 {
  id: string;
  orgId: string;
  assetType: AssetType;
  status: AssetStatus;
  storageProvider: 'SUPABASE_STORAGE' | 'CLOUDFLARE_R2' | 'AWS_S3';
  bucketName: string;
  storagePath: string; // SINGLE SOURCE OF TRUTH FOR STORAGE LOCATION
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  metadata: AssetMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface UploadAssetInputV11 {
  orgId: string;
  assetType: AssetType;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedBy: string;
  metadata?: Partial<AssetMetadata>;
}
