const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
export const API_BASE_URL = (configuredApiUrl || 'http://localhost:5001/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

export const apiRequest = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { Accept: 'application/json', ...init.headers }
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(body?.error || 'The journey service is unavailable.', response.status);
  return body as T;
};

export const getVisitorId = () => {
  const key = 'eternal_journey_visitor_id';
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
    return visitorId;
  } catch {
    return crypto.randomUUID();
  }
};
