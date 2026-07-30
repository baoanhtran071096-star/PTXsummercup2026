// @ptx/sdk – Config
export const PTX_CONFIG = {
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
  geminiApiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? '',
  appName: 'PTX Summer Cup 2026',
  version: '1.0.0',
  environment: process.env.NODE_ENV ?? 'development',
  features: {
    aiChat: true,
    aiNews: true,
    aiVision: false,
    realtime: false,
  },
} as const;

export type PTXFeatureFlags = typeof PTX_CONFIG.features;
