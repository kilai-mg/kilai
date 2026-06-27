import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Configure all API calls to include cookies for session auth
const originalFetch = window.fetch;
window.fetch = (input, init) =>
  originalFetch(input, { credentials: "include", ...init });

createRoot(document.getElementById("root")!).render(<App />);
