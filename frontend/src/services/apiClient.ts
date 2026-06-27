const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type ApiRequestOptions = RequestInit & {
  json?: unknown;
};

function getCsrfTokenFromCookie() {
  if (typeof document === 'undefined') return null;

  const tokenEntry = document.cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith('solventa_csrf_token='));

  if (!tokenEntry) return null;

  const [, token] = tokenEntry.split('=');
  return token ? decodeURIComponent(token) : null;
}

function isMutatingMethod(method?: string) {
  if (!method) return false;
  const normalized = method.toUpperCase();
  return normalized === 'POST' || normalized === 'PUT' || normalized === 'PATCH' || normalized === 'DELETE';
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;
  const csrfToken = isMutatingMethod(rest.method) ? getCsrfTokenFromCookie() : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
      ...headers
    },
    body: json === undefined ? rest.body : JSON.stringify(json)
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = payload && typeof payload === 'object' && 'message' in payload
      ? String((payload as { message?: unknown }).message ?? 'Request failed')
      : 'Request failed';

    throw new Error(message);
  }

  return payload as T;
}