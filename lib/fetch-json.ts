/**
 * Typed JSON fetch for client components — avoids silent failures on !ok or bad JSON.
 */
export type FetchJsonResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function fetchJson<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<FetchJsonResult<T>> {
  try {
    const res = await fetch(input, init);
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const err =
        data !== null &&
        typeof data === "object" &&
        "error" in data &&
        typeof (data as { error: unknown }).error === "string"
          ? (data as { error: string }).error
          : `Error ${res.status}`;
      return { ok: false, error: err };
    }
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "Network error" };
  }
}
