import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

function isArticlePath(pathname: string): boolean {
  return pathname === "/articles" || pathname === "/articles/" || pathname.startsWith("/articles/");
}

// Article pages are fully server-rendered static HTML (no interactivity beyond native
// <details> and links). Skip mounting the SPA on them so the article dataset never ships
// in the client bundle and there is no hydration flash over the server-rendered content.
if (!isArticlePath(window.location.pathname)) {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Root element #root was not found");
  }

  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
