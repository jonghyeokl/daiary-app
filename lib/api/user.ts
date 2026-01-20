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

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${text}`);
  }

  // FastAPI returns string as JSON (with quotes), so we parse it
  const token = JSON.parse(text);
  await saveTokens({ accessToken: token });
  await saveLoginEmail(input.email);

  return token;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

/**
 * 회원가입
 * POST /api/user/v1/
 */
export async function signup(input: SignupInput): Promise<void> {
  const res = await apiFetch('/api/user/v1/', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Signup failed: ${res.status} ${text}`);
  }

  await login({ email: input.email, password: input.password });
}
