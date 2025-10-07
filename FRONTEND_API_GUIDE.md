# UMILAX Frontend - API Integration Guide

This guide documents how the frontend integrates with the UMILAX backend API, including request/response patterns, authentication flows, and practical code examples.

## Table of Contents

- [API Configuration](#api-configuration)
- [Authentication](#authentication)
- [API Request Patterns](#api-request-patterns)
- [Endpoint Usage Examples](#endpoint-usage-examples)
- [Error Handling](#error-handling)
- [Offline Queue](#offline-queue)
- [Best Practices](#best-practices)

## API Configuration

### Base URL Setup

The API base URL is configured in `utils/api.ts`:

```typescript
// utils/api.ts
export const BASE_API_URL = 
  process.env.BASE_API_URL || 'https://umilax.onrender.com';
```

### Environment-Specific URLs

- **Production**: `https://umilax.onrender.com`
- **Development**: Set via environment variable
- **Local Backend**: `http://localhost:8000`

```bash
# Run with custom API URL
BASE_API_URL=http://localhost:8000 npm start
```

## Authentication

### Login Flow

```typescript
// Login request
async function login(username: string, password: string) {
  const response = await fetch(`${BASE_API_URL}/users/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const data = await response.json();
  // Response: { access: string, refresh: string, user: {...}, role: string }
  
  // Save tokens securely
  await saveTokens(data.access, data.refresh);
  
  return data;
}
```

### Token Management

```typescript
import { saveTokens, getAccessToken, getRefreshToken, clearTokens } from '../utils/authStorage';

// After successful login
await saveTokens(accessToken, refreshToken);

// Before API requests
const token = await getAccessToken();

// On logout
await clearTokens();
```

### Token Refresh Flow

```typescript
async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${BASE_API_URL}/auth/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    await clearTokens();
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  await saveTokens(data.access, data.refresh);
  
  return data.access;
}
```

### Automatic Token Refresh on 401

```typescript
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  let token = await getAccessToken();

  const makeRequest = async (authToken?: string) => {
    return fetch(`${BASE_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options.headers,
      },
    });
  };

  let response = await makeRequest(token);

  // If unauthorized, try refreshing token
  if (response.status === 401) {
    try {
      token = await refreshAccessToken();
      response = await makeRequest(token);
    } catch (error) {
      // Redirect to login
      throw new Error('Session expired');
    }
  }

  return response;
}
```

## API Request Patterns

### GET Request

```typescript
async function fetchTransactions() {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/transactions/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return await response.json();
}
```

### POST Request

```typescript
async function createTransaction(transactionData: TransactionPayload) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/transactions/record/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Failed to create transaction');
  }

  return await response.json();
}
```

### PATCH Request

```typescript
async function updateUser(userId: number, updates: Partial<User>) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/users/${userId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return await response.json();
}
```

### DELETE Request

```typescript
async function deleteUser(userId: number) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/users/${userId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.status === 204; // No content
}
```

### Query Parameters

```typescript
async function fetchTransactionsByShop(shopId: number, dateFrom?: string, dateTo?: string) {
  const token = await getAccessToken();
  
  const params = new URLSearchParams();
  params.append('shop_id', shopId.toString());
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  const response = await fetch(
    `${BASE_API_URL}/transactions/?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return await response.json();
}
```

## Endpoint Usage Examples

### User Management (CEO)

#### List All Users

```typescript
// GET /users/
async function fetchAllUsers() {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await response.json();
  // Response: [{ id: number, name: string, email: string, role: string, ... }]
}
```

#### Create User

```typescript
// POST /users/
async function createUser(userData: CreateUserPayload) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/users/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return await response.json();
}
```

#### Deactivate User

```typescript
// PATCH /users/{id}/
async function deactivateUser(userId: number) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/users/${userId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ is_active: false }),
  });

  return await response.json();
}
```

### Shop Management

#### List Shops

```typescript
// GET /shops/shops/
async function fetchShops() {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/shops/shops/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await response.json();
  // Response: [{ id: number, name: string, location: string, division_base: string }]
}
```

#### Create Shop

```typescript
// POST /shops/shops/
async function createShop(shopData: { name: string; location: string; division_base: string }) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/shops/shops/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shopData),
  });

  return await response.json();
}
```

### Transaction Management

#### Record Transaction

```typescript
// POST /transactions/record/
async function recordTransaction(data: {
  amount: number;
  services: string[];
  rendered_by: string;
  recorded_by: string;
  shop: string;
  type: string;
  description: string;
}) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/transactions/record/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}
```

#### Fetch Transactions with Filters

```typescript
// GET /transactions/?shop_id=...&date_from=...&date_to=...
async function fetchFilteredTransactions(filters: {
  shop_id?: number;
  employee_id?: number;
  date_from?: string;
  date_to?: string;
}) {
  const token = await getAccessToken();
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(
    `${BASE_API_URL}/transactions/?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return await response.json();
}
```

### Expense Management

#### Log Expense (Secretary)

```typescript
// POST /expenses/expenses/
async function logExpense(data: {
  description: string;
  amount: number;
  deduct_before_division?: boolean;
  service_type?: string;
}) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/expenses/expenses/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}
```

#### Approve Expense (CEO)

```typescript
// PATCH /expenses/{id}/approve
async function approveExpense(expenseId: number, approved: boolean, deductBefore?: boolean) {
  const token = await getAccessToken();
  
  const response = await fetch(
    `${BASE_API_URL}/expenses/${expenseId}/approve`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        approved,
        deduct_before_division: deductBefore,
      }),
    }
  );

  return await response.json();
}
```

### Reports

#### Fetch Reports

```typescript
// GET /reports/reports/?type=...&date_from=...&date_to=...
async function fetchReports(params: {
  shop_id?: number;
  date_from?: string;
  date_to?: string;
  type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}) {
  const token = await getAccessToken();
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });
  
  const response = await fetch(
    `${BASE_API_URL}/reports/reports/?${queryParams.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return await response.json();
  // Response: { summary: {...}, details: [...] }
}
```

#### Export Report

```typescript
// GET /reports/export?format=pdf&...
async function exportReport(params: {
  shop_id?: number;
  date_from?: string;
  date_to?: string;
  type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  format: 'pdf' | 'csv';
}) {
  const token = await getAccessToken();
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });
  
  const response = await fetch(
    `${BASE_API_URL}/reports/export?${queryParams.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error('Export failed');
  }

  const blob = await response.blob();
  return blob; // Handle download
}
```

### Complaints

#### Submit Complaint

```typescript
// POST /complaints/
async function submitComplaint(message: string) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/complaints/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  return await response.json();
  // Response: { id: number, message: string, role: string, created_at: string, ... }
}
```

#### Respond to Complaint (CEO)

```typescript
// POST /complaints/{id}/respond
async function respondToComplaint(complaintId: number, response: string) {
  const token = await getAccessToken();
  
  const res = await fetch(
    `${BASE_API_URL}/complaints/${complaintId}/respond`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response }),
    }
  );

  return await res.json();
}
```

### Dashboard Metrics (CEO)

```typescript
// GET /shops/ceo-dashboard/
async function fetchCEODashboardMetrics() {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/shops/ceo-dashboard/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await response.json();
  /* Response: {
    total_earnings: number,
    total_expenses: number,
    transaction_count: number,
    shop_count: number,
    employee_count: number,
    secretary_count: number,
    recent_transactions: [...],
    recent_expenses: [...],
    ceo_share: number,
    shop_share: number,
    employee_shares: [...]
  } */
}
```

## Error Handling

### Standard Error Response

Backend returns errors in this format:

```json
{
  "error": "Error message description"
}
```

### Error Handling Pattern

```typescript
async function apiCall() {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Try to parse error message
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof TypeError) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
}
```

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Success |
| 201 | Created | Resource created successfully |
| 204 | No Content | Success with no response body |
| 400 | Bad Request | Validation error - check request body |
| 401 | Unauthorized | Token expired/invalid - refresh or re-login |
| 403 | Forbidden | Insufficient permissions - check role |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate/conflicting data |
| 500 | Server Error | Backend error - retry or contact support |

### Component-Level Error Handling

```typescript
function MyScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorView message={error} onRetry={fetchData} />;
  
  return <DataView data={data} />;
}
```

## Offline Queue

### Adding to Queue

```typescript
import NetInfo from '@react-native-community/netinfo';
import { addToQueue, syncQueue } from '../utils/offlineQueue';
import { v4 as uuidv4 } from 'uuid';

async function recordTransactionWithOfflineSupport(transactionData: any) {
  const net = await NetInfo.fetch();
  
  if (!net.isConnected) {
    // Queue for later sync
    const localId = uuidv4();
    await addToQueue({
      id: localId,
      endpoint: '/transactions/record/',
      method: 'POST',
      body: transactionData,
    });
    
    Alert.alert('Saved Offline', 'Transaction will sync when online');
    return { id: localId, status: 'queued' };
  }
  
  // Online - post directly
  return await recordTransaction(transactionData);
}
```

### Manual Sync

```typescript
import { syncQueue, getQueue } from '../utils/offlineQueue';

async function syncPendingTransactions() {
  const token = await getAccessToken();
  const result = await syncQueue(token);
  
  console.log(`Synced: ${result.synced}, Failed: ${result.failed}`);
  
  if (result.synced > 0) {
    Alert.alert('Success', `${result.synced} transactions synced`);
  }
  
  if (result.failed > 0) {
    Alert.alert('Warning', `${result.failed} transactions failed to sync`);
  }
}
```

### Auto-Sync on Network Change

```typescript
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(async (state) => {
    if (state.isConnected) {
      const token = await getAccessToken();
      if (token) {
        await syncQueue(token);
      }
    }
  });
  
  return unsubscribe;
}, []);
```

## Best Practices

### 1. Always Use Type Safety

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function typedApiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_API_URL}${endpoint}`, options);
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
```

### 2. Centralize API Calls

Create a dedicated API service file:

```typescript
// services/api.service.ts
import { BASE_API_URL } from '../utils/api';
import { getAccessToken } from '../utils/authStorage';

class ApiService {
  private baseURL = BASE_API_URL;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await getAccessToken();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string): Promise<void> {
    await this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();
```

### 3. Use Custom Hooks for API Calls

```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';

export function useApi<T>(
  apiCall: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await apiCall();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error, refetch: () => fetchData() };
}
```

### 4. Handle Loading & Error States

```typescript
function TransactionList() {
  const { data, loading, error } = useApi(() => fetchTransactions());

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;
  if (!data) return <Text>No data</Text>;

  return <FlatList data={data} renderItem={...} />;
}
```

### 5. Log API Calls in Development

```typescript
async function apiRequest(endpoint: string, options: RequestInit) {
  if (__DEV__) {
    console.log('[API Request]', endpoint, options);
  }

  const response = await fetch(`${BASE_API_URL}${endpoint}`, options);
  
  if (__DEV__) {
    console.log('[API Response]', response.status, endpoint);
  }

  return response;
}
```

---

## Quick Reference

### Common Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/users/login/` | POST | No | User login |
| `/users/` | GET | CEO | List users |
| `/shops/shops/` | GET | Yes | List shops |
| `/transactions/record/` | POST | Secretary | Record transaction |
| `/expenses/expenses/` | POST | Secretary | Log expense |
| `/expenses/{id}/approve` | PATCH | CEO | Approve expense |
| `/reports/reports/` | GET | Yes | Get reports |
| `/reports/export` | GET | CEO | Export report |
| `/complaints/` | POST | Yes | Submit complaint |
| `/shops/ceo-dashboard/` | GET | CEO | Dashboard metrics |

### Request Headers

```typescript
{
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

### Query Parameters Format

```typescript
const params = new URLSearchParams({
  shop_id: '1',
  date_from: '2024-01-01',
  date_to: '2024-12-31',
});

const url = `${BASE_API_URL}/endpoint/?${params.toString()}`;
```

---

**For complete API documentation, see [dev_dir/api-spec.md](dev_dir/api-spec.md)**
