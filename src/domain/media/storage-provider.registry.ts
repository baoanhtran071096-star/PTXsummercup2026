import { StorageAdapter, SupabaseStorageAdapter, CloudflareR2Adapter, S3StorageAdapter } from './storage-adapter.interface';

export class StorageProviderRegistry {
  private static instance: StorageProviderRegistry;
  private registry: Map<string, StorageAdapter> = new Map();

  constructor() {
    this.registerProvider(new SupabaseStorageAdapter());
    this.registerProvider(new CloudflareR2Adapter());
    this.registerProvider(new S3StorageAdapter());
  }

  public static getInstance(): StorageProviderRegistry {
    if (!StorageProviderRegistry.instance) {
      StorageProviderRegistry.instance = new StorageProviderRegistry();
    }
    return StorageProviderRegistry.instance;
  }

  registerProvider(adapter: StorageAdapter): void {
    this.registry.set(adapter.providerName, adapter);
    console.log(`🔌 [STORAGE PROVIDER REGISTRY] Registered Provider: [${adapter.providerName}]`);
  }

  getProvider(providerName: string): StorageAdapter {
    const adapter = this.registry.get(providerName);
    if (!adapter) {
      throw new Error(`ERR_STORAGE_PROVIDER_NOT_FOUND: Provider ${providerName} is not registered.`);
    }
    return adapter;
  }
}
