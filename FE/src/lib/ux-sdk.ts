type UxSdkEventProps = Record<string, unknown>;

interface UxSdkInstance {
  install: () => void;
  flush: () => void;
  track: (eventName: string, props?: UxSdkEventProps) => void;
  trackPageView: (props?: UxSdkEventProps) => void;
}

interface MiniSdkGlobal {
  create: (config?: Record<string, unknown>) => UxSdkInstance;
}

declare global {
  interface ImportMetaEnv {
    readonly VITE_UX_SDK_HOST?: string;
    readonly VITE_UX_SDK_SITE_ID?: string;
    readonly VITE_UX_SDK_CLICK_SELECTOR?: string;
  }

  interface Window {
    MiniSDK?: MiniSdkGlobal;
    __uxSdkInstance?: UxSdkInstance;
    __uxSdkLoadPromise?: Promise<UxSdkInstance | null>;
  }
}

const sdkHost = (import.meta.env.VITE_UX_SDK_HOST ?? "http://localhost:3001").replace(/\/+$/, "");
const sdkSiteId = import.meta.env.VITE_UX_SDK_SITE_ID ?? "legend-ecommerce";
const sdkClickSelector =
  import.meta.env.VITE_UX_SDK_CLICK_SELECTOR ??
  "a,button,[role='button'],input[type='submit'],input[type='button'],input[type='checkbox'],summary";
const sdkScriptId = "ux-sdk-script";

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.MiniSDK) {
      resolve();
      return;
    }

    const existing = document.getElementById(sdkScriptId) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("UX SDK script failed to load")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = sdkScriptId;
    script.async = true;
    script.src = `${sdkHost}/sdk.js`;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("UX SDK script failed to load")), {
      once: true,
    });
    document.head.appendChild(script);
  });
}

export async function ensureUxSdkInstalled(): Promise<UxSdkInstance | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.__uxSdkInstance) {
    return window.__uxSdkInstance;
  }

  if (!window.__uxSdkLoadPromise) {
    window.__uxSdkLoadPromise = (async () => {
      try {
        await loadScript();
        if (!window.MiniSDK) {
          console.warn("[UX SDK] MiniSDK global was not found after script load.");
          return null;
        }

        const instance = window.MiniSDK.create({
          endpoint: `${sdkHost}/collect`,
          configEndpoint: `${sdkHost}/api/config`,
          siteId: sdkSiteId,
          appId: "legend-ecommerce",
          clickSelector: sdkClickSelector,
          debug: import.meta.env.DEV,
        });

        instance.install();
        window.__uxSdkInstance = instance;
        return instance;
      } catch (error) {
        console.warn("[UX SDK] Failed to initialize.", error);
        return null;
      }
    })();
  }

  return window.__uxSdkLoadPromise;
}

export async function trackUxSdkPageView(props?: UxSdkEventProps): Promise<void> {
  const sdk = await ensureUxSdkInstalled();
  sdk?.trackPageView(props);
}

export async function trackUxSdkEvent(eventName: string, props?: UxSdkEventProps): Promise<void> {
  const sdk = await ensureUxSdkInstalled();
  sdk?.track(eventName, props);
  sdk?.flush();
}

export function getUxSdkHost(): string {
  return sdkHost;
}

export function getUxDashboardUrl(): string {
  return `${sdkHost}/dashboard?site_id=${encodeURIComponent(sdkSiteId)}`;
}
