import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

export interface PendingLogin {
  host: string;
  email: string;
  challengeId: string;
  expiresAt: string;
}

export interface GigaCliConfig {
  host?: string;
  sessionCookie?: string;
  user?: { email?: string };
  pendingLogin?: PendingLogin;
  createdAt: string;
}

function configHome(): string {
  return process.env.GIGA_CONFIG_HOME ?? join(process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"), "giga-site");
}

export function configPath(): string {
  return join(configHome(), "config.json");
}

function isPendingLogin(value: unknown): value is PendingLogin {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.host === "string" && typeof item.email === "string" && typeof item.challengeId === "string" && typeof item.expiresAt === "string";
}

function isConfig(value: unknown): value is GigaCliConfig {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const hasSession = typeof item.host === "string" && typeof item.sessionCookie === "string";
  const hasPending = item.pendingLogin === undefined || isPendingLogin(item.pendingLogin);
  return typeof item.createdAt === "string" && hasPending && (hasSession || item.pendingLogin !== undefined);
}

export async function loadConfig(): Promise<GigaCliConfig | null> {
  try {
    const raw = await readFile(configPath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return isConfig(parsed) ? parsed : null;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: unknown }).code === "ENOENT") return null;
    throw error;
  }
}

export async function saveConfig(config: GigaCliConfig): Promise<void> {
  const file = configPath();
  await mkdir(dirname(file), { recursive: true, mode: 0o700 });
  await writeFile(file, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
  await chmod(file, 0o600);
}

export async function clearConfig(): Promise<void> {
  await rm(configPath(), { force: true });
}
