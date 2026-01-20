import * as SecureStore from 'expo-secure-store';

const LOGIN_EMAIL_KEY = 'login_email';

export async function saveLoginEmail(email: string) {
  await SecureStore.setItemAsync(LOGIN_EMAIL_KEY, email);
}

export async function getLoginEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(LOGIN_EMAIL_KEY);
}

export async function clearLoginEmail() {
  await SecureStore.deleteItemAsync(LOGIN_EMAIL_KEY);
}
