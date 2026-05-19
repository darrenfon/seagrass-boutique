// Square REST API client — server-only, plain fetch, no SDK.
// Mirrors src/lib/shopify/client.ts. Uses a bearer access token.
// Request patterns proven against the Square sandbox in square-spike/.

const SQUARE_ENVIRONMENT = (process.env.SQUARE_ENVIRONMENT || "sandbox").trim().toLowerCase();
const SQUARE_TOKEN = process.env.SQUARE_ACCESS_TOKEN || "";

// Square-Version pinned to the version validated by the spike (square-spike/FINDINGS.md).
export const SQUARE_VERSION = "2025-04-16";

// Base URL swaps with SQUARE_ENVIRONMENT so production needs only an env change.
export const SQUARE_BASE =
  SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

export class SquareError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "SquareError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Call the Square REST API.
 * @param path  API path, e.g. "/v2/catalog/search"
 * @param method  HTTP method
 * @param body  JSON body (objects only)
 * @param options.revalidate  Next.js ISR revalidate seconds for GET requests
 */
export async function squareFetch<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, unknown>,
  options?: { revalidate?: number }
): Promise<T> {
  if (!SQUARE_TOKEN) {
    throw new SquareError("Square credentials not configured", 500, null);
  }

  const res = await fetch(SQUARE_BASE + path, {
    method,
    headers: {
      Authorization: `Bearer ${SQUARE_TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    next:
      method === "GET" && options?.revalidate
        ? { revalidate: options.revalidate }
        : undefined,
    cache: method === "GET" && options?.revalidate ? undefined : "no-store",
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const errs = (json as { errors?: { detail?: string; code?: string }[] })?.errors;
    const detail = errs?.map((e) => e.detail || e.code).join(", ") || res.statusText;
    throw new SquareError(`Square ${method} ${path} -> ${res.status}: ${detail}`, res.status, json);
  }

  return json as T;
}

/** UUID for Square idempotency keys (no extra dependency). */
export function squareUuid(): string {
  return crypto.randomUUID();
}
