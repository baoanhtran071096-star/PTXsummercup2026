// ================================================================
// PTX SUPABASE CLIENT
// Kết nối PostgreSQL qua Supabase REST API (Free Tier).
// Dùng native fetch để đảm bảo 0 dependency.
// ================================================================

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export interface QueryOptions {
  select?: string;
  eq?: Record<string, unknown>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
  count?: number;
}

export class SupabaseClient {
  private configUrl?: string;
  private configKey?: string;

  constructor(config?: SupabaseConfig) {
    if (config) {
      this.configUrl = config.url;
      this.configKey = config.serviceRoleKey ?? config.anonKey;
    }
  }

  private get url(): string {
    return this.configUrl ?? process.env.SUPABASE_URL ?? '';
  }

  private get key(): string {
    return this.configKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';
  }

  private get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Prefer': 'return=representation',
    };
  }

  get isConfigured(): boolean {
    return !!this.url && !!this.key;
  }

  /**
   * SELECT từ bảng với điều kiện tùy chọn.
   */
  async select<T>(table: string, options: QueryOptions = {}): Promise<SupabaseResponse<T[]>> {
    if (!this.isConfigured) return this.mockResponse<T[]>([]);

    let endpoint = `${this.url}/rest/v1/${table}?`;
    const params: string[] = [];

    params.push(`select=${options.select ?? '*'}`);

    if (options.eq) {
      for (const [col, val] of Object.entries(options.eq)) {
        params.push(`${col}=eq.${val}`);
      }
    }

    if (options.order) {
      params.push(`order=${options.order.column}.${options.order.ascending !== false ? 'asc' : 'desc'}`);
    }

    if (options.limit) params.push(`limit=${options.limit}`);
    if (options.offset) params.push(`offset=${options.offset}`);

    endpoint += params.join('&');

    return this.request<T[]>('GET', endpoint);
  }

  /**
   * INSERT một hoặc nhiều records.
   */
  async insert<T>(table: string, data: Record<string, unknown> | Record<string, unknown>[]): Promise<SupabaseResponse<T>> {
    if (!this.isConfigured) return this.mockResponse<T>({ id: `mock_${Date.now()}`, ...Array.isArray(data) ? data[0] : data } as T);
    return this.request<T>('POST', `${this.url}/rest/v1/${table}`, data);
  }

  /**
   * UPDATE records theo điều kiện.
   */
  async update<T>(table: string, data: Record<string, unknown>, eq: Record<string, unknown>): Promise<SupabaseResponse<T>> {
    if (!this.isConfigured) return this.mockResponse<T>(data as T);

    let endpoint = `${this.url}/rest/v1/${table}?`;
    endpoint += Object.entries(eq).map(([col, val]) => `${col}=eq.${val}`).join('&');

    return this.request<T>('PATCH', endpoint, data);
  }

  /**
   * DELETE records theo điều kiện.
   */
  async delete<T>(table: string, eq: Record<string, unknown>): Promise<SupabaseResponse<T>> {
    if (!this.isConfigured) return this.mockResponse<T>(null as unknown as T);

    let endpoint = `${this.url}/rest/v1/${table}?`;
    endpoint += Object.entries(eq).map(([col, val]) => `${col}=eq.${val}`).join('&');

    return this.request<T>('DELETE', endpoint);
  }

  /**
   * UPSERT (INSERT or UPDATE).
   */
  async upsert<T>(table: string, data: Record<string, unknown>, onConflict = 'id'): Promise<SupabaseResponse<T>> {
    if (!this.isConfigured) return this.mockResponse<T>(data as T);

    const headers = { ...this.headers, 'Prefer': `resolution=merge-duplicates,return=representation`, 'on_conflict': onConflict };
    return this.request<T>('POST', `${this.url}/rest/v1/${table}`, data, headers);
  }

  /**
   * RPC — gọi PostgreSQL function.
   */
  async rpc<T>(functionName: string, params: Record<string, unknown> = {}): Promise<SupabaseResponse<T>> {
    if (!this.isConfigured) return this.mockResponse<T>(null as unknown as T);
    return this.request<T>('POST', `${this.url}/rest/v1/rpc/${functionName}`, params);
  }

  private async request<T>(method: string, url: string, body?: unknown, customHeaders?: Record<string, string>): Promise<SupabaseResponse<T>> {
    try {
      const res = await fetch(url, {
        method,
        headers: customHeaders ?? this.headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        return { data: null, error: { message: err.message ?? res.statusText, code: String(res.status) } };
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      return { data, error: null };

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { data: null, error: { message } };
    }
  }

  private mockResponse<T>(data: T): SupabaseResponse<T> {
    return { data, error: null };
  }
}

// Singleton
export const db = new SupabaseClient();
