const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type ApiRequestOptions = RequestInit & {
  json?: unknown;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
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