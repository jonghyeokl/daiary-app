import { saveLoginEmail } from '../storage/auth';
import { saveTokens } from '../storage/token';
import { apiFetch } from './client';

/**
 * 로그인
 * POST /api/user/v1/login
 * response: string (access token)
 */
export async function login(input: {
  email: string;
  password: string;
}): Promise<string> {
  const res = await apiFetch('/api/user/v1/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  const token = (await res.text()).trim();

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${token}`);
  }

  await saveTokens({ accessToken: token });
  await saveLoginEmail(input.email);

  return token;
}
