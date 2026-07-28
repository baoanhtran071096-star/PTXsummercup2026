import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface FileCacheState {
  filePath: string;
  sha256: string;
  lastModified: number;
}

export interface IncrementalCacheData {
  version: string;
  lastBuildAt: string;
  files: Record<string, FileCacheState>;
}

export class IncrementalCacheManager {
  private cachePath: string;

  constructor(rootDir: string) {
    this.cachePath = path.join(rootDir, 'generated', '.compiler-cache.json');
  }

  loadCache(): IncrementalCacheData | null {
    if (!fs.existsSync(this.cachePath)) return null;
    try {
      const raw = fs.readFileSync(this.cachePath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Detect modified files by comparing SHA-256 hashes against cached build state
   */
  detectChangedFiles(currentFiles: { filePath: string; sha256: string }[]): {
    changed: string[];
    isFullBuildRequired: boolean;
  } {
    const cache = this.loadCache();
    if (!cache) {
      return { changed: currentFiles.map((f) => f.filePath), isFullBuildRequired: true };
    }

    const changed: string[] = [];
    for (const file of currentFiles) {
      const cached = cache.files[file.filePath];
      if (!cached || cached.sha256 !== file.sha256) {
        changed.push(file.filePath);
      }
    }

    return {
      changed,
      isFullBuildRequired: changed.length === 0 ? false : changed.length > currentFiles.length * 0.5
    };
  }

  saveCache(files: { filePath: string; sha256: string }[]) {
    const fileDict: Record<string, FileCacheState> = {};
    for (const file of files) {
      fileDict[file.filePath] = {
        filePath: file.filePath,
        sha256: file.sha256,
        lastModified: Date.now()
      };
    }

    const data: IncrementalCacheData = {
      version: '2.0.0',
      lastBuildAt: new Date().toISOString(),
      files: fileDict
    };

    const dir = path.dirname(this.cachePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.cachePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
