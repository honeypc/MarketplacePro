import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize theme and i18n stores
import { useThemeStore } from "@/lib/theme";
import { useTranslationStore } from "@/lib/i18n";

// Initialize the stores on app start
const initializeStores = () => {
  // This will trigger the onRehydrateStorage callbacks
  useThemeStore.getState();
  useTranslationStore.getState();
};

initializeStores();

createRoot(document.getElementById("root")!).render(<App />);
