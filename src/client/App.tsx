import { lazy, Suspense, type ReactNode } from "react";
import { legalPathFromPathname } from "../shared/legal";
import { LegalPage } from "./LegalPage";

const AdminApp = lazy(() => import("./admin/AdminApp").then((module) => ({ default: module.AdminApp })));
const ContactPage = lazy(() => import("./ContactPage").then((module) => ({ default: module.ContactPage })));
const LandingPage = lazy(() => import("./LandingPage").then((module) => ({ default: module.LandingPage })));

function isArticlePath(pathname: string): boolean {
  return pathname === "/articles" || pathname === "/articles/" || pathname.startsWith("/articles/");
}

export function App() {
  const pathname = typeof window === "undefined" ? "/app/" : window.location.pathname;
  let page: ReactNode = <AdminApp />;
  if (pathname === "/") page = <LandingPage />;
  if (pathname === "/contact" || pathname === "/contact/") page = <ContactPage />;
  // Article pages are fully server-rendered static HTML; the SPA never mounts on them
  // (see main.tsx), so the heavy article bodies stay out of the client bundle.
  if (isArticlePath(pathname)) page = null;
  const legalPath = legalPathFromPathname(pathname);
  if (legalPath) page = <LegalPage path={legalPath} />;
  return <Suspense fallback={null}>{page}</Suspense>;
}
