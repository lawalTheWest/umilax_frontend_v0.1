# UMILAX Frontend - Developer Guide

This guide provides detailed information for developers working on the UMILAX frontend application.

## Table of Contents

- [Development Environment Setup](#development-environment-setup)
- [Project Architecture](#project-architecture)
- [Code Organization](#code-organization)
- [Component Development](#component-development)
- [API Integration Patterns](#api-integration-patterns)
- [State Management](#state-management)
- [Styling Guidelines](#styling-guidelines)
- [Testing Strategy](#testing-strategy)
- [Debugging](#debugging)
- [Performance Optimization](#performance-optimization)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Required Tools

1. **Node.js** (v16+)
   ```bash
   node --version  # Should be v16 or higher
   ```

2. **Package Manager**
   ```bash
   npm --version   # or yarn --version
   ```

3. **Mobile Development Tools**
   - **iOS**: Xcode (macOS only)
   - **Android**: Android Studio + Android SDK
   - **Physical Device**: Expo Go app

4. **IDE/Editor**
   - VS Code (recommended) with extensions:
     - ESLint
     - Prettier
     - React Native Tools
     - TypeScript and JavaScript Language Features

### First-Time Setup

```bash
# Clone repository
git clone https://github.com/lawalTheWest/umilax_frontend_v0.1.git
cd umilax_frontend_v0.1

# Install dependencies
npm install

# Start development server
npm start
```

### Development Server Options

```bash
# Standard start
npm start

# Start with cleared cache
npm start -- --clear

# Start in specific mode
npm start -- --dev-client
npm start -- --tunnel
```

## Project Architecture

### Directory Structure Explained

```
umilax_frontend_v0.1/
│
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx              # Root navigation layout
│   ├── index.tsx                # Home/landing screen
│   ├── auth.tsx                 # Login screen route
│   ├── dashboard.tsx            # Role-based dashboard router
│   ├── ceo-dashboard.tsx        # CEO-specific route
│   ├── transactions.tsx         # Transactions route
│   └── ...                      # Other route screens
│
├── screens/                      # Screen components (legacy & shared)
│   ├── CEODashboardScreen.tsx
│   ├── SecretaryDashboardScreen.tsx
│   ├── EmployeeDashboardScreen.tsx
│   └── ...                      # Other screen components
│
├── components/                   # Reusable UI components
│   ├── ui/                      # Generic UI components
│   └── ...                      # Feature-specific components
│
├── utils/                       # Utility functions & helpers
│   ├── api.ts                   # API client & base URL
│   ├── authStorage.ts           # Secure token management
│   └── offlineQueue.ts          # Offline sync functionality
│
├── constants/                   # App-wide constants
│   └── theme.ts                # Theme colors, fonts, spacing
│
├── hooks/                       # Custom React hooks
│
├── navigation/                  # Navigation utilities (if needed)
│
├── assets/                      # Static assets
│   ├── images/                 # Image files
│   └── fonts/                  # Custom fonts
│
├── __mocks__/                   # Jest mocks
│   └── fileMock.js
│
└── dev_dir/                     # Development documentation
    └── api-spec.md             # Backend API reference
```

### Navigation Architecture

We use **Expo Router** for file-based routing:

```typescript
// app/_layout.tsx - Root layout
export default function RootLayout() {
  return <Stack />;
}

// app/dashboard.tsx - Role-based routing
export default function DashboardRouter() {
  const role = getUserRole(); // from params or storage
  
  if (role === 'CEO') return <CEODashboard />;
  if (role === 'Secretary') return <SecretaryDashboard />;
  if (role === 'Employee') return <EmployeeDashboard />;
}
```

## Code Organization

### File Naming Conventions

- **Screens**: `PascalCase` with `Screen` suffix → `CEODashboardScreen.tsx`
- **Components**: `PascalCase` → `AnimatedCard.tsx`
- **Utilities**: `camelCase` → `authStorage.ts`
- **Constants**: `camelCase` or `UPPER_SNAKE_CASE` for values
- **Types/Interfaces**: `PascalCase` with `I` prefix (optional) → `ITransaction`

### TypeScript Guidelines

```typescript
// Define clear interfaces for data structures
interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  services: string[];
  renderedBy: string;
  recordedBy: string;
  shop: string;
  type: string;
  description: string;
}

// Use type for unions and simple aliases
type UserRole = 'CEO' | 'Secretary' | 'Employee';
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Export types for reuse
export type { Transaction, UserRole, RequestMethod };
```

### Import Organization

```typescript
// 1. React & React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Third-party libraries
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

// 3. Local imports - absolute paths
import { BASE_API_URL } from '../utils/api';
import { getAccessToken } from '../utils/authStorage';

// 4. Components
import CustomButton from '../components/CustomButton';

// 5. Types
import type { Transaction } from '../types';
```

## Component Development

### Functional Components Pattern

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

export default function MyComponent({ title, onPress }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### Reusable Component Best Practices

1. **Single Responsibility**: Each component should do one thing well
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Default Props**: Use default parameters or optional chaining
4. **Memoization**: Use `React.memo()` for expensive components
5. **Hooks**: Extract complex logic into custom hooks

### Custom Hooks Example

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getAccessToken, clearTokens } from '../utils/authStorage';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  async function loadToken() {
    const t = await getAccessToken();
    setToken(t);
    setLoading(false);
  }

  async function logout() {
    await clearTokens();
    setToken(null);
  }

  return { token, loading, logout };
}
```

## API Integration Patterns

### Standard API Call Pattern

```typescript
import { BASE_API_URL } from '../utils/api';
import { getAccessToken } from '../utils/authStorage';

async function fetchData() {
  const token = await getAccessToken();
  
  try {
    const response = await fetch(`${BASE_API_URL}/endpoint/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### POST Request with Body

```typescript
async function createTransaction(payload: TransactionPayload) {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_API_URL}/transactions/record/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Request failed');
  }

  return await response.json();
}
```

### Error Handling Pattern

```typescript
try {
  const data = await fetchData();
  setData(data);
  setError(null);
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error');
  setData(null);
} finally {
  setLoading(false);
}
```

## State Management

### Local State with useState

```typescript
const [data, setData] = useState<Transaction[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Derived State

```typescript
// Don't store computed values in state
const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
const filteredTransactions = transactions.filter(t => t.shop === selectedShop);
```

### State Update Patterns

```typescript
// Functional updates when new state depends on old
setCount(prev => prev + 1);

// Object state updates
setState(prev => ({ ...prev, field: newValue }));

// Array state updates
setItems(prev => [...prev, newItem]);           // Add
setItems(prev => prev.filter(i => i.id !== id)); // Remove
setItems(prev => prev.map(i => i.id === id ? updated : i)); // Update
```

## Styling Guidelines

### StyleSheet Pattern

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a2238',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
});
```

### Color Palette

```typescript
// constants/theme.ts
export const Colors = {
  primary: '#e94560',      // Pink/red accent
  secondary: '#1a2238',    // Navy blue
  background: '#f8fafc',   // Light gray background
  cardBg: '#f3f4f6',       // Card background
  success: '#10b981',      // Green
  error: '#ef4444',        // Red
  text: '#1a2238',         // Dark text
  textLight: '#6b7280',    // Light text
};
```

### Responsive Spacing

```typescript
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

### Dynamic Styles

```typescript
// Conditional styling
<View style={[
  styles.base,
  isActive && styles.active,
  { backgroundColor: customColor },
]} />
```

## Testing Strategy

### Unit Testing Components

```typescript
// __tests__/MyComponent.test.tsx
import { render, fireEvent, screen } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles button press', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MyComponent title="Test" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Mocking API Calls

```typescript
// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' }),
  })
) as jest.Mock;

// Test
it('fetches data', async () => {
  const result = await fetchData();
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('/endpoint/'),
    expect.any(Object)
  );
  expect(result).toEqual({ data: 'test' });
});
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../hooks/useAuth';

it('loads token', async () => {
  const { result } = renderHook(() => useAuth());
  
  await act(async () => {
    // Wait for effect
  });
  
  expect(result.current.token).toBeDefined();
});
```

## Debugging

### React Native Debugger

1. Install React Native Debugger app
2. Run app and open debug menu:
   - iOS: `Cmd + D`
   - Android: `Cmd + M` or shake device
3. Enable "Debug" option

### Console Logging

```typescript
// Development only
if (__DEV__) {
  console.log('Debug info:', data);
}

// Use console.table for arrays
console.table(transactions);

// Use console.time for performance
console.time('fetch');
await fetchData();
console.timeEnd('fetch');
```

### Network Debugging

Enable network inspector in Expo:
```bash
npm start
# Press 'm' in terminal to open developer menu
# Select "Toggle Performance Monitor"
```

### Common Debug Commands

```bash
# Clear Metro bundler cache
npm start -- --clear

# Reset Expo cache
expo start -c

# Check network requests
# Use React Native Debugger Network tab
```

## Performance Optimization

### Memoization

```typescript
import React, { useMemo, useCallback } from 'react';

// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks
const handlePress = useCallback(() => {
  doSomething(value);
}, [value]);

// Memoize components
const MemoizedComponent = React.memo(MyComponent);
```

### FlatList Optimization

```typescript
<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={renderItem}
  // Performance props
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Image Optimization

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

## Common Patterns

### Loading States

```typescript
if (loading) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#e94560" />
    </View>
  );
}
```

### Error States

```typescript
if (error) {
  return (
    <View style={styles.center}>
      <Text style={styles.error}>{error}</Text>
      <Button title="Retry" onPress={retry} />
    </View>
  );
}
```

### Offline Detection

```typescript
import NetInfo from '@react-native-community/netinfo';

const [isOnline, setIsOnline] = useState(true);

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    setIsOnline(state.isConnected ?? false);
  });
  return unsubscribe;
}, []);
```

### Form Handling

```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  amount: '',
});

const handleChange = (field: string) => (value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

<TextInput
  value={formData.name}
  onChangeText={handleChange('name')}
/>
```

## Troubleshooting

### Common Issues

#### 1. Module not found
```bash
# Clear watchman
watchman watch-del-all

# Clear metro cache
npm start -- --reset-cache

# Reinstall node_modules
rm -rf node_modules && npm install
```

#### 2. iOS build fails
```bash
# Clean iOS build
cd ios && pod deintegrate && pod install && cd ..

# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

#### 3. Android build fails
```bash
# Clean Android
cd android && ./gradlew clean && cd ..

# Clear gradle cache
rm -rf ~/.gradle/caches/
```

#### 4. Token/Auth issues
```typescript
// Check token in console
const token = await getAccessToken();
console.log('Token:', token);

// Clear and re-login
await clearTokens();
// Login again
```

#### 5. Offline queue not syncing
```typescript
// Check queue
const queue = await getQueue();
console.log('Pending items:', queue);

// Force sync
const result = await syncQueue(token);
console.log('Sync result:', result);
```

### Debug Checklist

- [ ] Check network connectivity
- [ ] Verify API base URL is correct
- [ ] Check authentication token is valid
- [ ] Verify backend is running and accessible
- [ ] Check request headers and body format
- [ ] Review error messages in console
- [ ] Test with mock data to isolate issue
- [ ] Check for typos in API endpoints

### Getting Help

1. **Check documentation**: README.md, api-spec.md
2. **Review error logs**: Metro bundler, device logs
3. **Search issues**: GitHub issues, Stack Overflow
4. **Ask team**: Create detailed issue with reproduction steps

---

## Quick Reference

### Useful Commands

```bash
# Development
npm start                    # Start dev server
npm run android             # Run Android
npm run ios                 # Run iOS
npm run lint               # Run linter
npm test                   # Run tests

# Debugging
npm start -- --clear       # Clear cache
expo start -c              # Clear Expo cache
watchman watch-del-all     # Clear watchman

# Building
eas build --platform android
eas build --platform ios
```

### Key Files

- `app.json` - Expo configuration
- `package.json` - Dependencies & scripts
- `tsconfig.json` - TypeScript config
- `babel.config.js` - Babel config
- `eslint.config.js` - ESLint rules
- `utils/api.ts` - API base URL and utilities

### Environment Variables

```bash
# Set custom API URL
export BASE_API_URL=https://staging.umilax.com

# Run with custom API
BASE_API_URL=http://localhost:8000 npm start
```

---

**Happy Coding! 🚀**
