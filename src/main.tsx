import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Enregistre le service worker
const updateSW = registerSW({
    onNeedRefresh() {
        console.log("🌀 Nouvelle version disponible, actualisez pour mettre à jour !");
    },
    onOfflineReady() {
        console.log("✅ Application prête à fonctionner hors ligne !");
    }
});

createRoot(document.getElementById("root")!).render(<App />);
