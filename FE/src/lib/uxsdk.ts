const SDK_SCRIPT_ID = "uxsdk-browser-sdk";
const SDK_SCRIPT_SRC = "/uxsdk/sdk.js";

const ensureSdkScript = async () => {
  if (window.MiniSDK?.create) {
    return;
  }

  const existingScript = document.getElementById(SDK_SCRIPT_ID) as HTMLScriptElement | null;

  if (!existingScript) {
    const script = document.createElement("script");
    script.id = SDK_SCRIPT_ID;
    script.src = SDK_SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Timed out while loading UX SDK script"));
    }, 5000);

    const poll = () => {
      if (window.MiniSDK?.create) {
        window.clearTimeout(timeout);
        resolve();
        return;
      }

      window.requestAnimationFrame(poll);
    };

    poll();
  });
};

const installUxSdkOnce = async () => {
  if (window.__uxSdkInstallState === "installed") {
    return;
  }

  if (window.__uxSdkInstallState === "installing" && window.__uxSdkInstallPromise) {
    await window.__uxSdkInstallPromise;
    return;
  }

  window.__uxSdkInstallState = "installing";
  window.__uxSdkInstallPromise = (async () => {
    await ensureSdkScript();

    if (!window.__sdk) {
      window.__sdk = window.MiniSDK?.create({
        endpoint: "/uxsdk/collect",
        configEndpoint: "/uxsdk/api/config",
        siteId: "legend-ecommerce",
        appId: "legend-ecommerce",
        schemaVersion: 1,
        debug: true,
      });
    }

    window.__sdk?.install();
    window.__uxSdkInstallState = "installed";
  })();

  try {
    await window.__uxSdkInstallPromise;
  } catch (error) {
    window.__uxSdkInstallState = "idle";
    window.__uxSdkInstallPromise = undefined;
    console.error("UX SDK initialization failed", error);
  }
};

export const initUxSdk = () => {
  if (typeof window === "undefined") {
    return;
  }

  void installUxSdkOnce();
};
