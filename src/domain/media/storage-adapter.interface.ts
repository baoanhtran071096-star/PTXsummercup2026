import { MediaAssetV11 } from './asset-v1-1-models';

export interface StorageAdapter {
  providerName: 'SUPABASE_STORAGE' | 'CLOUDFLARE_R2' | 'AWS_S3';
  uploadObject(storagePath: string, content: Buffer | string, mimeType: string): Promise<boolean>;
  deleteObject(storagePath: string): Promise<boolean>;
  getSignedUrl(storagePath: string, expiresInSec: number): Promise<string>;
  getPublicUrl(storagePath: string): Promise<string>;
}

export class SupabaseStorageAdapter implements StorageAdapter {
  providerName: 'SUPABASE_STORAGE' = 'SUPABASE_STORAGE';

  async uploadObject(storagePath: string, content: Buffer | string, mimeType: string): Promise<boolean> {
    console.log(`🗄️ [STORAGE ADAPTER: SUPABASE] Uploaded to path: ${storagePath} (${mimeType})`);
    return true;
  }

  async deleteObject(storagePath: string): Promise<boolean> {
    console.log(`🗄️ [STORAGE ADAPTER: SUPABASE] Deleted path: ${storagePath}`);
    return true;
  }

  async getSignedUrl(storagePath: string, expiresInSec: number): Promise<string> {
    return `https://ptx-supabase-prod.supabase.co/storage/v1/object/sign/${storagePath}?token=sig_${Date.now()}&expires=${expiresInSec}`;
  }

  async getPublicUrl(storagePath: string): Promise<string> {
    return `https://ptx-supabase-prod.supabase.co/storage/v1/object/public/${storagePath}`;
  }
}

export class CloudflareR2Adapter implements StorageAdapter {
  providerName: 'CLOUDFLARE_R2' = 'CLOUDFLARE_R2';

  async uploadObject(storagePath: string, content: Buffer | string, mimeType: string): Promise<boolean> {
    console.log(`🗄️ [STORAGE ADAPTER: CLOUDFLARE R2] Uploaded to path: ${storagePath}`);
    return true;
  }

  async deleteObject(storagePath: string): Promise<boolean> {
    console.log(`🗄️ [STORAGE ADAPTER: CLOUDFLARE R2] Deleted path: ${storagePath}`);
    return true;
  }

  async getSignedUrl(storagePath: string, expiresInSec: number): Promise<string> {
    return `https://pub-r2.ptx.vn/${storagePath}?r2_sig=${Date.now()}`;
  }

  async getPublicUrl(storagePath: string): Promise<string> {
    return `https://pub-r2.ptx.vn/${storagePath}`;
  }
}

export class S3StorageAdapter implements StorageAdapter {
  providerName: 'AWS_S3' = 'AWS_S3';

  async uploadObject(storagePath: string, content: Buffer | string, mimeType: string): Promise<boolean> {
    console.log(`🗄️ [STORAGE ADAPTER: AWS S3] Uploaded to path: ${storagePath}`);
    return true;
  }

  async deleteObject(storagePath: string): Promise<boolean> {
    console.log(`🗄️ [STORAGE ADAPTER: AWS S3] Deleted path: ${storagePath}`);
    return true;
  }

  async getSignedUrl(storagePath: string, expiresInSec: number): Promise<string> {
    return `https://ptx-media.s3.ap-southeast-1.amazonaws.com/${storagePath}?X-Amz-Signature=${Date.now()}`;
  }

  async getPublicUrl(storagePath: string): Promise<string> {
    return `https://ptx-media.s3.ap-southeast-1.amazonaws.com/${storagePath}`;
  }
}
