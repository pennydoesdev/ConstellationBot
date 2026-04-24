import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Copy .env.example to .env and fill in the value, or set it in DO App Platform secrets.`
    );
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export const config = {
  discord: {
    token: required('DISCORD_TOKEN'),
    appId: required('DISCORD_APP_ID'),
    publicKey: optional('DISCORD_PUBLIC_KEY'),
    guildId: optional('DISCORD_GUILD_ID'),
  },
  database: {
    url: optional('DATABASE_URL'),
    directUrl: optional('DATABASE_URL_DIRECT'),
  },
  supabase: {
    url: optional('SUPABASE_URL'),
    anonKey: optional('SUPABASE_ANON_KEY'),
    serviceRoleKey: optional('SUPABASE_SERVICE_ROLE_KEY'),
  },
  r2: {
    accountId: optional('R2_ACCOUNT_ID'),
    accessKeyId: optional('R2_ACCESS_KEY_ID'),
    secretAccessKey: optional('R2_SECRET_ACCESS_KEY'),
    bucket: optional('R2_BUCKET') ?? 'constellation-discord-archive',
    endpoint: optional('R2_ENDPOINT'),
  },
  featherless: {
    apiKey: optional('FEATHERLESS_API_KEY'),
  },
  huggingface: {
    token: optional('HF_TOKEN_BOT'),
  },
  env: process.env.NODE_ENV ?? 'development',
  logLevel: process.env.LOG_LEVEL ?? 'info',
} as const;

export type Config = typeof config;
