import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initUxSdk } from "./lib/uxsdk.ts";

initUxSdk();

createRoot(document.getElementById("root")!).render(<App />);
