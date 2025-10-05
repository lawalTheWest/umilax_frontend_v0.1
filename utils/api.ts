/**
 * fetchCEODashboardMetrics
 * Fetches CEO dashboard metrics from the backend API using the provided JWT token.
 * Throws an error if the request fails.
 */
// Base API URL - prefer runtime config or environment. Default to deployed backend on Render.
export const BASE_API_URL =
  // Allow overriding with an environment variable (Metro/Expo) if provided
  (typeof process !== 'undefined' && process.env && process.env.BASE_API_URL) ||
  'https://umilax.onrender.com';

export async function fetchCEODashboardMetrics(token: string) {
  const res = await fetch(`${BASE_API_URL}/ceo-dashboard/metrics/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch CEO dashboard metrics');
  return await res.json();
}
/**
 * deactivateUser
 * CEO-only: Deactivates a user by PATCHing is_active=false to the backend.
 */
export async function deactivateUser(userId: number, token: string) {
  const res = await fetch(`${BASE_API_URL}/users/${userId}/`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ is_active: false }),
  });
  if (!res.ok) throw new Error('Failed to deactivate user');
  return await res.json();
}
