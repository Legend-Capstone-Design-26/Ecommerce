import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ensureUxSdkInstalled, trackUxSdkPageView } from "@/lib/ux-sdk";

const UxSdkTracker = () => {
  const location = useLocation();
  const hasSeenInitialRoute = useRef(false);

  useEffect(() => {
    void ensureUxSdkInstalled();
  }, []);

  useEffect(() => {
    if (!hasSeenInitialRoute.current) {
      hasSeenInitialRoute.current = true;
      return;
    }

    void trackUxSdkPageView({
      reason: "spa_navigation",
      pathname: `${location.pathname}${location.search}${location.hash}`,
    });
  }, [location.hash, location.pathname, location.search]);

  return null;
};

export default UxSdkTracker;
