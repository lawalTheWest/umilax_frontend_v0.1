# UMILAX Salon Management System - Frontend Documentation

A comprehensive React Native mobile application built with Expo for managing salon operations, built to work seamlessly with the UMILAX backend API.

> 📚 **[Complete Documentation Index](DOCUMENTATION_INDEX.md)** | 🚀 **[Quick Start Guide](QUICKSTART.md)** | 📖 **[Features](FEATURES.md)** | 👨‍💻 **[Developer Guide](DEVELOPER_GUIDE.md)**

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [User Roles & Workflows](#user-roles--workflows)
- [Screens & Components](#screens--components)
- [Backend Integration](#backend-integration)
- [Offline Functionality](#offline-functionality)
- [Authentication & Security](#authentication--security)
- [Build & Deployment](#build--deployment)
- [Testing](#testing)
- [Contributing](#contributing)

## 🎯 Overview

UMILAX is a salon management system designed to streamline operations across multiple salon shops. The frontend provides role-based interfaces for CEOs, Secretaries, and Employees, enabling efficient management of services, transactions, expenses, and revenue distribution.

### Key Capabilities

- **Multi-role support**: CEO, Secretary, and Employee dashboards
- **Real-time operations**: Service recording, transaction tracking, expense logging
- **Offline-first**: Queue and sync transactions when connectivity is restored
- **Revenue management**: Automated revenue division and earnings tracking
- **Reporting**: Generate and export PDF/CSV reports
- **Complaint system**: Built-in complaint logging and resolution workflow

## ✨ Features

### For CEO
- **Dashboard with Analytics**: View comprehensive metrics, charts, and business insights
- **Multi-shop Management**: Create, update, and monitor multiple salon locations
- **User Management**: Manage employees and secretaries (hire, deactivate)
- **Financial Control**: 
  - Approve/reject expenses
  - Configure revenue division settings per shop
  - View detailed earnings breakdowns
- **Reports & Exports**: Generate PDF/CSV reports for any date range
- **Complaint Management**: Review and respond to employee/secretary complaints

### For Secretary
- **Service Recording**: Record customer services with automatic pricing
- **Transaction Management**: Track and manage daily transactions
- **Expense Logging**: Log shop expenses with receipt uploads
- **Complaint Submission**: Report issues to management
- **Shop Operations**: View assigned shop details and performance

### For Employee
- **Personal Dashboard**: View personal details, guarantor info, performance level
- **Earnings Tracking**: Monitor personal earnings and transaction history
- **Complaint System**: Submit complaints directly to CEO
- **Transaction History**: View services rendered and revenue generated

## 🛠 Technology Stack

### Core Framework
- **React Native** (0.81.4) - Cross-platform mobile development
- **Expo** (~54.0.9) - Development platform and tooling
- **Expo Router** (~6.0.7) - File-based navigation

### UI & Styling
- **NativeWind** (4.2.1) - Tailwind CSS for React Native
- **React Native SVG Charts** (5.4.0) - Data visualization
- **Victory Native** (41.20.1) - Advanced charting
- **Expo Vector Icons** - Icon library

### State & Storage
- **AsyncStorage** (2.2.0) - Local data persistence
- **Expo SecureStore** (15.0.7) - Secure token storage
- **NetInfo** (11.4.1) - Network connectivity detection

### Development Tools
- **TypeScript** (5.9.2) - Type safety
- **ESLint** - Code linting
- **Jest** (30.1.3) - Unit testing
- **React Testing Library** - Component testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Expo CLI (optional, included in project)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lawalTheWest/umilax_frontend_v0.1.git
   cd umilax_frontend_v0.1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure backend URL** (optional)
   
   The app defaults to the production backend at `https://umilax.onrender.com`. To use a different backend:
   
   - Edit `app.json` and update `expo.extra.API_URL`
   - Or set environment variable: `BASE_API_URL=https://your-api.com`

4. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

5. **Run on a device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### Development Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run lint       # Run ESLint
npm test           # Run Jest tests
npm run test:ceo   # Run CEO-specific tests
```

## 🏗 Architecture

### Project Structure

```
umilax_frontend_v0.1/
├── app/                      # Expo Router app directory
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Landing page
│   ├── auth.tsx             # Authentication screen
│   ├── dashboard.tsx        # Role-based dashboard router
│   ├── ceo-dashboard.tsx    # CEO dashboard
│   └── ...                  # Other route screens
├── screens/                  # Screen components
│   ├── CEODashboardScreen.tsx
│   ├── SecretaryDashboardScreen.tsx
│   ├── EmployeeDashboardScreen.tsx
│   ├── TransactionsScreen.tsx
│   ├── ExpensesScreen.tsx
│   └── ...
├── components/              # Reusable components
├── utils/                   # Utility functions
│   ├── api.ts              # API client functions
│   ├── authStorage.ts      # Secure token management
│   └── offlineQueue.ts     # Offline sync logic
├── constants/              # App constants
├── assets/                 # Images, fonts, etc.
└── dev_dir/               # Development documentation
    └── api-spec.md        # Backend API specification
```

### Navigation Flow

```
Splash Screen → Auth Screen → Dashboard (role-based)
                                   ├── CEO Dashboard
                                   ├── Secretary Dashboard
                                   └── Employee Dashboard
```

### Data Flow

1. **User Authentication**: JWT tokens stored securely via Expo SecureStore
2. **API Requests**: All requests include `Authorization: Bearer <token>` header
3. **Offline Queue**: Failed requests queued and auto-synced when online
4. **State Management**: React hooks (useState, useEffect) for local state

## 👥 User Roles & Workflows

### CEO Workflow

1. **Login** → CEO Dashboard with comprehensive metrics
2. **Manage Shops** → Create/edit salon locations
3. **Manage Users** → Hire/deactivate employees and secretaries
4. **Review Expenses** → Approve/reject with deduction timing control
5. **Configure Division** → Set revenue split percentages per shop
6. **View Reports** → Generate and export financial reports
7. **Handle Complaints** → Review and respond to staff complaints

### Secretary Workflow

1. **Login** → Secretary Dashboard with personal info
2. **Record Services** → Select services, employee, payment type
3. **Log Expenses** → Enter description, amount, upload receipt
4. **View Transactions** → Monitor daily/weekly transactions
5. **Submit Complaints** → Report issues to management

### Employee Workflow

1. **Login** → Employee Dashboard with performance metrics
2. **View Earnings** → Check personal revenue and breakdown
3. **View Transactions** → See services rendered
4. **Submit Complaints** → Report workplace issues

## 📱 Screens & Components

### Core Screens

#### Authentication
- `AuthScreen.tsx` - Login interface
- `CEOLoginScreen.tsx` - CEO-specific login

#### Dashboards
- `CEODashboardScreen.tsx` - Charts, metrics, navigation menu
- `SecretaryDashboardScreen.tsx` - Personal details, shop info
- `EmployeeDashboardScreen.tsx` - Personal details, performance, guarantor info

#### Management Screens (CEO)
- `ShopsScreen.tsx` - Shop CRUD operations
- `EmployeesScreen.tsx` - Employee management
- `SecretariesScreen.tsx` - Secretary management
- `ManageUsersScreen.tsx` - User administration
- `DivisionSettingsScreen.tsx` - Revenue division configuration

#### Operations Screens
- `TransactionsScreen.tsx` - Transaction list and search
- `ExpensesScreen.tsx` - Expense approval/rejection
- `SecretaryServiceRecordingScreen.tsx` - Service recording UI
- `SecretaryExpenseLoggingScreen.tsx` - Expense logging UI

#### Reporting
- `ReportsScreen.tsx` - Report generation
- `ReportExportScreen.js` - PDF/CSV export
- `EarningsScreen.tsx` - Earnings breakdown
- `PersonalReportScreen.tsx` - Individual reports

#### Communication
- `ComplaintsScreen.tsx` - Complaint submission
- `ManageComplaintsScreen.tsx` - CEO complaint management

## 🔌 Backend Integration

### API Configuration

The app connects to the UMILAX backend API hosted at `https://umilax.onrender.com`. The base URL is configured in:

```typescript
// utils/api.ts
export const BASE_API_URL = 
  process.env.BASE_API_URL || 'https://umilax.onrender.com';
```

### Key API Endpoints Used

Refer to `dev_dir/api-spec.md` for complete API documentation. Main endpoints:

**Authentication**
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /users/google/` - Google SSO

**Transactions**
- `POST /transactions/record/` - Record new transaction
- `GET /transactions/` - List transactions

**Expenses**
- `POST /expenses/expenses/` - Create expense
- `PATCH /expenses/{id}/approve` - Approve/reject (CEO)

**Users**
- `GET /users/` - List users (CEO)
- `PATCH /users/{id}` - Update user (CEO)

**Reports**
- `GET /reports/reports/` - Get reports
- `GET /reports/export` - Export PDF/CSV (CEO)

**Shops**
- `GET /shops/shops/` - List shops
- `POST /shops/shops/` - Create shop (CEO)

### API Utility Functions

```typescript
// Example: Fetching CEO metrics
import { BASE_API_URL } from '../utils/api';

export async function fetchCEODashboardMetrics(token: string) {
  const res = await fetch(`${BASE_API_URL}/ceo-dashboard/metrics/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return await res.json();
}
```

## 📴 Offline Functionality

### Offline Queue System

The app implements a robust offline-first architecture for critical operations:

**Features:**
- Automatic queuing of failed requests
- Background sync when connectivity restored
- Token refresh during sync
- Retry logic with error tracking

**How It Works:**

```typescript
// utils/offlineQueue.ts

// 1. Add to queue when offline
const localId = uuidv4();
await addToQueue({
  id: localId,
  endpoint: '/transactions/record/',
  method: 'POST',
  body: transactionData,
});

// 2. Sync queue when online
const { synced, failed } = await syncQueue(token);
console.log(`Synced: ${synced}, Failed: ${failed}`);
```

**Usage in Transactions:**

```typescript
// Check network status
const net = await NetInfo.fetch();
if (!net.isConnected) {
  // Queue locally
  await addToQueue({ id, endpoint, method: 'POST', body });
  Alert.alert('Saved offline', 'Will sync when online');
} else {
  // Post directly
  await fetch(url, { method: 'POST', body });
}
```

**Queue Management:**
- Items stored in AsyncStorage
- Each item has: `id`, `endpoint`, `method`, `body`, `status`, `retries`
- Status: `pending` → `syncing` → `synced` or `failed`

## 🔐 Authentication & Security

### Token Management

Secure token storage using Expo SecureStore:

```typescript
// utils/authStorage.ts

// Save tokens after login
await saveTokens(accessToken, refreshToken);

// Retrieve for API calls
const token = await getAccessToken();

// Clear on logout
await clearTokens();
```

### JWT Flow

1. **Login**: User submits credentials → receives JWT access + refresh tokens
2. **API Requests**: Include `Authorization: Bearer <access_token>` header
3. **Token Refresh**: On 401 response, use refresh token to get new access token
4. **Logout**: Clear tokens from secure storage

### Role-Based Access

- Each token contains user role information
- Frontend routes check role before rendering screens
- API enforces role permissions server-side

### Security Best Practices

- ✅ Tokens stored in Expo SecureStore (encrypted)
- ✅ HTTPS communication with backend
- ✅ Automatic token refresh on expiry
- ✅ No sensitive data in AsyncStorage
- ✅ Secure password input with `secureTextEntry`

## 📦 Build & Deployment

### Development Build

```bash
# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

### Production Build

See `EAS_BUILD_INSTRUCTIONS.md` for detailed build instructions.

#### Option 1: EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS (first time)
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

#### Option 2: Local Build

```bash
# Prebuild native projects
expo prebuild

# Android
cd android && ./gradlew assembleRelease

# iOS
cd ios && xcodebuild -workspace ... -scheme ...
```

### Environment Configuration

Update `app.json` before building:

```json
{
  "expo": {
    "extra": {
      "API_URL": "https://umilax.onrender.com"
    }
  }
}
```

### Build Profiles

Configured in `eas.json`:
- **development**: Debug builds with dev client
- **preview**: Internal testing builds
- **production**: Release builds for app stores

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:ceo

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Structure

```
screens/__tests__/
├── CEODashboardScreen.test.tsx
├── SecretaryDashboardScreen.test.tsx
└── ...
```

### Testing Libraries

- **Jest**: Test runner
- **React Testing Library**: Component testing
- **jest-native**: Custom matchers for React Native

### Example Test

```typescript
import { render, screen } from '@testing-library/react-native';
import CEODashboardScreen from '../CEODashboardScreen';

test('renders CEO dashboard', () => {
  render(<CEODashboardScreen />);
  expect(screen.getByText(/CEO Dashboard/i)).toBeTruthy();
});
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Make changes** and commit: `git commit -m "Add my feature"`
4. **Run linter**: `npm run lint`
5. **Run tests**: `npm test`
6. **Push branch**: `git push origin feature/my-feature`
7. **Create Pull Request**

### Code Style

- Follow ESLint configuration
- Use TypeScript for type safety
- Use functional components with hooks
- Keep components small and focused
- Add comments for complex logic

### Commit Messages

Follow conventional commits:
- `feat: Add new feature`
- `fix: Fix bug in X`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor component X`
- `test: Add tests for Y`

## 📚 Additional Resources

- [Backend API Documentation](dev_dir/api-spec.md)
- [EAS Build Instructions](EAS_BUILD_INSTRUCTIONS.md)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📄 License

This project is part of the UMILAX Salon Management System.

## 👨‍💻 Authors

UMILAX Development Team

---

**Backend API**: https://umilax.onrender.com  
**Package**: com.anonymous.frontendumilax  
**Version**: 1.0.0
