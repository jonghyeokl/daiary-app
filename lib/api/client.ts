import { API_BASE_URL } from '../env';
import { clearTokens, getAccessToken } from '../storage/token';

type ApiError = {
  status: number;
  body: string;
};

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }

  const token = await getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 인증 만료 / 실패
  if (res.status === 401) {
    await clearTokens();
    // 나중에 여기서 logout 처리 or auth store 리셋
  }

  return res;
}

/**
 * JSON 응답을 바로 쓰고 싶을 때
 */
export async function apiFetchJson<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await apiFetch(path, options);
  const text = await res.text();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      body: text,
    };
    throw error;
  }

  return text ? JSON.parse(text) : (null as T);
}
