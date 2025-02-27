import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import "@/media.css"
import { App } from "@/App.tsx";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
