export class AssetSecurityHarness {
  private static ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'video/mp4',
    'video/webm'
  ];

  private static MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB Max for PDFs/Videos

  static validateAssetUpload(mimeType: string, fileSizeBytes: number, orgId: string): void {
    if (!orgId || orgId.trim() === '') {
      throw new Error('ERR_SECURITY_ORG_ISOLATION: Tenant Organization ID is required for asset storage.');
    }

    if (!AssetSecurityHarness.ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`ERR_SECURITY_MIME_DISALLOWED: File type [${mimeType}] is not permitted.`);
    }

    if (fileSizeBytes > AssetSecurityHarness.MAX_FILE_SIZE_BYTES) {
      throw new Error(`ERR_SECURITY_FILE_TOO_LARGE: Size [${fileSizeBytes} bytes] exceeds 50MB limit.`);
    }
  }

  static sanitizeFilename(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.\-_]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }
}
