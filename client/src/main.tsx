import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { register as registerServiceWorker } from "./registerServiceWorker";

createRoot(document.getElementById("root")!).render(<App />);

// Register the service worker for PWA functionality
registerServiceWorker();
