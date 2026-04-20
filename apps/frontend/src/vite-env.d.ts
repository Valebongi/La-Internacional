/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_POLL_INBOX_MS: string;
  readonly VITE_POLL_NOTIFICATIONS_MS: string;
  readonly VITE_POLL_CHAT_MS: string;
  readonly VITE_USE_MOCKS: string;
  readonly VITE_META_WABA_ID: string;
  readonly VITE_META_PHONE_NUMBER_ID: string;
  readonly VITE_META_TEST_PHONE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
