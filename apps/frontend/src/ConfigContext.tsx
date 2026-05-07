import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AppConfig {
  metaWabaId: string;
  metaPhoneNumberId: string;
  metaAppId: string;
  metaGraphVersion: string;
  appName: string;
  pollChatMs: number;
  pollInboxMs: number;
  pollNotificationsMs: number;
  useMocks: boolean;
}

interface ConfigContextType {
  config: AppConfig | null;
  loading: boolean;
  error: Error | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${apiBase}/api/config/public`);

        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.statusText}`);
        }

        const data = await response.json();

        // Convertir strings a números
        setConfig({
          metaWabaId: data.metaWabaId,
          metaPhoneNumberId: data.metaPhoneNumberId,
          metaAppId: data.metaAppId,
          metaGraphVersion: data.metaGraphVersion,
          appName: data.appName,
          pollChatMs: parseInt(data.pollChatMs, 10),
          pollInboxMs: parseInt(data.pollInboxMs, 10),
          pollNotificationsMs: parseInt(data.pollNotificationsMs, 10),
          useMocks: data.useMocks,
        });

        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('Failed to load config:', error);
        // Fallback a valores default
        setConfig({
          metaWabaId: '1894314254553697',
          metaPhoneNumberId: '1127647270424016',
          metaAppId: '2232236523979539',
          metaGraphVersion: 'v25.0',
          appName: 'CRM La Internacional',
          pollChatMs: 5000,
          pollInboxMs: 15000,
          pollNotificationsMs: 30000,
          useMocks: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): AppConfig {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig debe usarse dentro de ConfigProvider');
  }
  if (!context.config) {
    throw new Error('Config aún no está cargada');
  }
  return context.config;
}

export function useConfigLoading(): boolean {
  const context = useContext(ConfigContext);
  return context?.loading ?? true;
}
