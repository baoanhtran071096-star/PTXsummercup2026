export interface MediaAsset {
  id: string;
  orgId: string;
  storageProvider: 'SUPABASE_STORAGE' | 'CLOUDFLARE_R2' | 'AWS_S3';
  bucketName: 'avatars' | 'logos' | 'banners' | 'sponsors' | 'gallery' | 'templates';
  storagePath: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  widthPx?: number;
  heightPx?: number;
  sha256Hash: string;
  publicUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadAssetInput {
  orgId: string;
  bucketName: 'avatars' | 'logos' | 'banners' | 'sponsors' | 'gallery' | 'templates';
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  base64Content?: string;
}
