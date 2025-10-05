import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'umilax_access_token_v1';
const REFRESH_KEY = 'umilax_refresh_token_v1';

export async function saveTokens(accessToken: string, refreshToken?: string) {
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
  if (refreshToken) await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
}

export async function getAccessToken() {
  return await SecureStore.getItemAsync(ACCESS_KEY);
}

export async function getRefreshToken() {
  return await SecureStore.getItemAsync(REFRESH_KEY);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

export default {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
};
