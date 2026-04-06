type UxSdkConfig = {
  endpoint: string;
  configEndpoint: string;
  siteId: string;
  appId: string;
  schemaVersion: number;
  debug: boolean;
};

type UxSdkInstance = {
  install: () => void;
  flush?: () => void;
  track?: (eventName: string, props?: Record<string, unknown>) => void;
  trackPageView?: (extraProps?: Record<string, unknown>) => void;
};

type MiniSdkGlobal = {
  create: (config: UxSdkConfig) => UxSdkInstance;
};

declare global {
  interface Window {
    MiniSDK?: MiniSdkGlobal;
    __sdk?: UxSdkInstance;
    __uxSdkInstallState?: "idle" | "installing" | "installed";
    __uxSdkInstallPromise?: Promise<void>;
  }
}

export {};
