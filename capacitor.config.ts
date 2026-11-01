import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'biz.trickster.hana.iitokodori.app',
  appName: 'いいとこどり',
  webDir: 'public',
  // Next.jsのAPI Routes・Supabase認証をそのまま使うため、静的バンドルではなく
  // 本番URLをそのままネイティブWebViewで開くリモート方式を採用（Android TWA方式と同じ発想）
  server: {
    url: 'https://iitokodori.hana.trickster.biz',
    cleartext: false,
  },
};

export default config;
