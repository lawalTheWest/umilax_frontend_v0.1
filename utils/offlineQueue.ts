import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from './api';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './authStorage';

type PendingItem = {
  id: string; // local uuid
  endpoint: string; // relative endpoint, e.g. '/transactions/record/'
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body: any;
  retries?: number;
  status?: 'pending' | 'syncing' | 'failed' | 'synced';
  error?: string | null;
};

const STORAGE_KEY = '@umilax_offline_queue_v1';

async function readQueue(): Promise<PendingItem[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PendingItem[];
  } catch {
    return [];
  }
}

async function writeQueue(items: PendingItem[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function addToQueue(item: PendingItem) {
  const q = await readQueue();
  q.push({ ...item, status: item.status || 'pending', retries: item.retries || 0, error: null });
  await writeQueue(q);
  return item.id;
}

export async function getQueue() {
  return await readQueue();
}

export async function clearItem(localId: string) {
  const q = await readQueue();
  const next = q.filter(i => i.id !== localId);
  await writeQueue(next);
}

export async function markItem(localId: string, patch: Partial<PendingItem>) {
  const q = await readQueue();
  const next = q.map(i => (i.id === localId ? { ...i, ...patch } : i));
  await writeQueue(next);
}

// Attempt to sync the queue. caller should handle auth header injection by passing token
export async function syncQueue(token?: string) {
  const q = await readQueue();
  if (!q.length) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;

  // prefer explicit token param, otherwise use stored access token
  let currentToken: string | undefined = token || (await getAccessToken()) || undefined;

  for (const item of q) {
    try {
      await markItem(item.id, { status: 'syncing', error: null });

      const doRequest = async (authToken?: string | undefined) => {
        return fetch(`${BASE_API_URL}${item.endpoint}`, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify(item.body),
        });
      };

      let res = await doRequest(currentToken);

      if (res.ok) {
        await clearItem(item.id);
        synced++;
        continue;
      }

      // If unauthorized, attempt refresh once and retry
      if (res.status === 401) {
        const refresh = await getRefreshToken();
        if (refresh) {
          try {
            const rres = await fetch(`${BASE_API_URL}/auth/refresh/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh }),
            });
            if (rres.ok) {
              const d = await rres.json();
              currentToken = d.access || currentToken;
              // d.refresh may be undefined; pass undefined explicitly when missing
              await saveTokens(currentToken as string, (d.refresh as string | undefined) || refresh || undefined);
              // retry original request with new token
              const retryRes = await doRequest(currentToken);
              if (retryRes.ok) {
                await clearItem(item.id);
                synced++;
                continue;
              }
              const retryText = await retryRes.text().catch(() => 'retry failed');
              await markItem(item.id, { status: 'failed', retries: (item.retries || 0) + 1, error: retryText });
              failed++;
              continue;
            }
            // refresh failed: clear tokens and mark failed
            const txt = await rres.text().catch(() => 'refresh failed');
            await clearTokens();
            await markItem(item.id, { status: 'failed', retries: (item.retries || 0) + 1, error: txt });
            failed++;
            continue;
          } catch (refreshErr) {
            await clearTokens();
            await markItem(item.id, { status: 'failed', retries: (item.retries || 0) + 1, error: String(refreshErr) });
            failed++;
            continue;
          }
        } else {
          // no refresh token available
          await markItem(item.id, { status: 'failed', retries: (item.retries || 0) + 1, error: 'no refresh token available' });
          failed++;
          continue;
        }
      }

      // other non-ok responses
      const text = await res.text().catch(() => 'error');
      await markItem(item.id, { status: 'failed', retries: (item.retries || 0) + 1, error: text });
      failed++;

    } catch (err) {
      // network error, leave as pending and bump retries
      await markItem(item.id, { status: 'failed', retries: (item.retries || 0) + 1, error: String(err) });
      failed++;
    }
  }

  return { synced, failed };
}

export default {
  addToQueue,
  getQueue,
  clearItem,
  markItem,
  syncQueue,
};
