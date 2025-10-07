# UMILAX Frontend - Features Documentation

Complete guide to all features and functionality in the UMILAX Salon Management System frontend.

## Table of Contents

- [Overview](#overview)
- [User Roles](#user-roles)
- [CEO Features](#ceo-features)
- [Secretary Features](#secretary-features)
- [Employee Features](#employee-features)
- [Common Features](#common-features)
- [Feature Details](#feature-details)

## Overview

UMILAX provides a comprehensive suite of features tailored to three distinct user roles:

- **CEO**: Complete system oversight and management
- **Secretary**: Daily operations and service recording
- **Employee**: Personal dashboard and earnings tracking

## User Roles

### CEO (Chief Executive Officer)
- Full administrative access
- Multi-shop management
- Financial oversight and approval
- User management (hire/deactivate)
- Advanced reporting and analytics

### Secretary
- Service recording and transaction management
- Expense logging with receipts
- Shop-level operations
- Complaint submission

### Employee
- Personal performance tracking
- Earnings visibility
- Transaction history
- Complaint submission

## CEO Features

### 1. Dashboard & Analytics

**Description**: Comprehensive overview of business performance with real-time metrics and visualizations.

**Capabilities**:
- Total earnings and expenses display
- Transaction count tracking
- Shop, employee, and secretary counts
- Revenue distribution (CEO share vs Shop share)
- Interactive bar charts for financial data
- Recent transactions and expenses lists

**Screen**: `CEODashboardScreen.tsx`

**API Endpoint**: `GET /shops/ceo-dashboard/`

**Data Displayed**:
```typescript
{
  total_earnings: number,
  total_expenses: number,
  transaction_count: number,
  shop_count: number,
  employee_count: number,
  secretary_count: number,
  recent_transactions: Transaction[],
  recent_expenses: Expense[],
  ceo_share: number,
  shop_share: number,
  employee_shares: EmployeeShare[]
}
```

### 2. Shop Management

**Description**: Create, view, and manage multiple salon locations.

**Capabilities**:
- View all shops with details
- Create new shop locations
- Set division base per shop
- Navigate to individual shop details
- Monitor shop performance

**Screen**: `ShopsScreen.tsx`

**API Endpoints**:
- `GET /shops/shops/` - List all shops
- `POST /shops/shops/` - Create new shop
- `GET /shops/shops/{id}` - Shop details

**Shop Data Structure**:
```typescript
interface Shop {
  id: number;
  name: string;
  location: string;
  division_base: string;
}
```

### 3. User Management

**Description**: Manage employees and secretaries across all shops.

**Capabilities**:
- View all employees and secretaries
- Add new users with role assignment
- Deactivate users
- View user details (personal info, guarantor, performance)
- Filter by shop or role

**Screen**: `ManageUsersScreen.tsx`, `EmployeesScreen.tsx`, `SecretariesScreen.tsx`

**API Endpoints**:
- `GET /users/` - List all users
- `POST /users/` - Create new user
- `PATCH /users/{id}/` - Update user (deactivate: `is_active: false`)
- `DELETE /users/{id}/` - Delete user

**User Data Fields**:
- Full name, email, phone
- Role (CEO, Secretary, Employee)
- Shop assignment
- Years of experience
- Specialty
- Residential address
- Guarantor details
- Performance level
- Active status

### 4. Expense Approval

**Description**: Review and approve/reject expenses submitted by secretaries.

**Capabilities**:
- View all pending expenses
- Approve or reject expenses
- Set deduction timing (before or after division)
- View expense receipts
- Track expense status

**Screen**: `ExpensesScreen.tsx`

**API Endpoints**:
- `GET /expenses/expenses/` - List expenses
- `PATCH /expenses/{id}/approve` - Approve/reject

**Approval Workflow**:
```typescript
// Approve with deduction before division
{
  approved: true,
  deduct_before_division: true
}

// Approve with deduction after division
{
  approved: true,
  deduct_before_division: false
}

// Reject
{
  approved: false
}
```

### 5. Division Settings

**Description**: Configure revenue distribution settings per shop.

**Capabilities**:
- View current division base
- Update division percentages
- Apply to specific shops
- Preview impact on earnings

**Screen**: `DivisionSettingsScreen.tsx`

**API Endpoints**:
- `GET /shops/division-settings/?shop_id={id}` - Get settings
- `PATCH /shops/division-settings/` - Update settings

**Settings Structure**:
```typescript
{
  shop_id: number,
  division_base: number // Percentage
}
```

### 6. Reports & Export

**Description**: Generate comprehensive reports and export in multiple formats.

**Capabilities**:
- Generate reports by date range
- Filter by shop, employee, or service type
- Report types: Daily, Weekly, Monthly, Yearly
- Export as PDF or CSV
- View detailed breakdowns

**Screen**: `ReportsScreen.tsx`, `ReportExportScreen.js`

**API Endpoints**:
- `GET /reports/reports/?type={type}&date_from={date}&date_to={date}` - Get reports
- `GET /reports/export?format={pdf|csv}&...` - Export report

**Report Types**:
- **Daily**: Day-by-day transaction summary
- **Weekly**: Weekly aggregated data
- **Monthly**: Monthly financial overview
- **Yearly**: Annual performance report

### 7. Complaint Management

**Description**: Review and respond to employee/secretary complaints.

**Capabilities**:
- View all complaints
- Filter by status (open/responded)
- Respond to complaints
- Track complaint history
- Mark as resolved

**Screen**: `ManageComplaintsScreen.tsx`

**API Endpoints**:
- `GET /complaints/` - List all complaints
- `POST /complaints/{id}/respond` - Respond to complaint

**Complaint Flow**:
1. Employee/Secretary submits complaint
2. CEO receives notification
3. CEO reviews complaint details
4. CEO provides response
5. Complaint marked as responded

### 8. Earnings Overview

**Description**: View detailed earnings breakdown across shops and employees.

**Capabilities**:
- View total earnings
- Employee earnings breakdown
- Shop-wise revenue distribution
- CEO share calculation
- Filter by date range

**Screen**: `EarningsScreen.tsx`

**API Endpoint**: `GET /shops/earnings/?date_from={date}&date_to={date}`

## Secretary Features

### 1. Service Recording

**Description**: Record customer services with automatic pricing calculation.

**Capabilities**:
- Select multiple services
- Choose employee who rendered service
- Select payment type (Cash, Card, Transfer, POS, Wallet)
- Manual price override option
- Automatic total calculation with priority pricing
- Real-time price display

**Screen**: `SecretaryServiceRecordingScreen.tsx`

**API Endpoint**: `POST /transactions/record/`

**Service Recording Flow**:
```typescript
// 1. Select services
selectedServices = [1, 2, 3] // Service IDs

// 2. Calculate total (with priority logic)
totalPrice = calculateTotal(selectedServices, allServices)

// 3. Optional manual override
displayPrice = manualPrice || totalPrice

// 4. Select employee and payment type
transaction = {
  amount: displayPrice,
  services: selectedServiceNames,
  rendered_by: employeeId,
  recorded_by: secretaryId,
  shop: shopId,
  type: 'service',
  description: 'Customer service',
  payment_type: selectedPaymentType
}

// 5. Submit
POST /transactions/record/
```

**Service Data**:
```typescript
interface Service {
  id: number;
  name: string;
  base_price: number;
  priority: number; // 1, 2, 3 (higher = more expensive)
}
```

**Priority Pricing Logic**:
- Multiple services: Use highest priority price
- Single service: Use base price
- Manual override: Secretary can set custom price

### 2. Expense Logging

**Description**: Log shop expenses with receipt upload capability.

**Capabilities**:
- Enter expense description
- Input amount
- Upload receipt photo
- Submit for CEO approval
- Track expense status (pending/approved/rejected)

**Screen**: `SecretaryExpenseLoggingScreen.tsx`

**API Endpoint**: `POST /expenses/expenses/`

**Expense Submission**:
```typescript
{
  description: string,
  amount: number,
  deduct_before_division: boolean, // Optional
  service_type: string, // Optional
  receipt: string | null // Base64 or URL
}
```

### 3. Transaction Management

**Description**: View and manage recorded transactions.

**Capabilities**:
- View transaction history
- Search by service, employee, or shop
- Filter by date range
- View transaction details
- Edit pending transactions
- Offline transaction queue

**Screen**: `TransactionsScreen.tsx`

**API Endpoint**: `GET /transactions/?shop_id={id}&date_from={date}&date_to={date}`

**Transaction Details**:
```typescript
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
  payment_type: string;
}
```

### 4. Personal Dashboard

**Description**: Secretary's personal information and shop assignment.

**Capabilities**:
- View personal details
- See passport photo
- View guarantor information
- Check performance level
- View assigned shop

**Screen**: `SecretaryDashboardScreen.tsx`

**Personal Data Displayed**:
- Full name
- Years of experience
- Specialty
- Residential address
- Phone number
- Passport photo
- Guarantor details (name, relationship, contact, occupation)
- Performance level (Poor, Worse, Average, Good, Excellent)

### 5. Complaint Submission

**Description**: Report issues or concerns to management.

**Capabilities**:
- Submit new complaints
- View own complaint history
- Track response status
- Edit complaint before response

**Screen**: `ComplaintsScreen.tsx`

**API Endpoints**:
- `POST /complaints/` - Submit complaint
- `GET /complaints/` - View own complaints
- `PATCH /complaints/{id}` - Edit complaint (before response)

## Employee Features

### 1. Personal Dashboard

**Description**: Employee profile and performance overview.

**Capabilities**:
- View personal information
- See passport photo
- Check guarantor details
- View performance rating
- Account status (active/deactivated)

**Screen**: `EmployeeDashboardScreen.tsx`

**Data Displayed**:
- Full name
- Years of experience
- Specialty
- Residential address
- Phone number
- Passport photo
- Guarantor information
- Performance level
- Active/Deactivated status

**Deactivation Handling**:
```typescript
if (employee.is_active === false) {
  // Show deactivation message
  return <DeactivatedAccountView />;
}
```

### 2. Earnings Tracking

**Description**: View personal earnings and breakdown.

**Capabilities**:
- Total earnings display
- Earnings by date range
- Service-wise breakdown
- Shop-wise earnings
- Commission calculation

**Screen**: `EarningsScreen.tsx`, `PersonalReportScreen.tsx`

**API Endpoint**: `GET /shops/earnings/{employee_id}?date_from={date}&date_to={date}`

**Earnings Structure**:
```typescript
{
  total: number,
  breakdown: [
    {
      service: string,
      amount: number,
      shop: string,
      date: string,
      commission: number
    }
  ]
}
```

### 3. Transaction History

**Description**: View services rendered and revenue generated.

**Capabilities**:
- List of services performed
- Customer transaction details
- Revenue contribution
- Filter by date
- Search transactions

**Screen**: `TransactionsScreen.tsx`

### 4. Complaint Submission

**Description**: Report workplace issues or concerns.

**Capabilities**:
- Submit complaints to CEO
- View complaint history
- Track response status
- Edit before response received

**Screen**: `ComplaintsScreen.tsx`

## Common Features

### 1. Authentication

**Description**: Secure login system with role-based access.

**Capabilities**:
- Username/password login
- Google SSO (OAuth)
- JWT token management
- Automatic token refresh
- Secure token storage
- Role-based dashboard routing

**Screens**: `AuthScreen.tsx`, `CEOLoginScreen.tsx`

**API Endpoints**:
- `POST /users/login/` - Standard login
- `POST /users/google/` - Google SSO
- `POST /auth/refresh/` - Token refresh

**Login Flow**:
1. User enters credentials
2. Frontend sends to `/users/login/`
3. Backend validates and returns JWT + role
4. Frontend stores tokens securely
5. Route to appropriate dashboard based on role

### 2. Offline Functionality

**Description**: Queue operations when offline and sync when connection restored.

**Implementation**: `utils/offlineQueue.ts`

**Capabilities**:
- Automatic offline detection
- Queue failed requests
- Background sync when online
- Token refresh during sync
- Retry logic with error tracking
- Status indicators (pending/syncing/synced/failed)

**Supported Operations**:
- Transaction recording
- Expense logging
- Complaint submission

**Usage Pattern**:
```typescript
// 1. Check connectivity
const netInfo = await NetInfo.fetch();

// 2. If offline, queue
if (!netInfo.isConnected) {
  await addToQueue({
    id: uuidv4(),
    endpoint: '/transactions/record/',
    method: 'POST',
    body: transactionData
  });
  Alert.alert('Saved offline');
}

// 3. Auto-sync on reconnect
NetInfo.addEventListener(async (state) => {
  if (state.isConnected) {
    await syncQueue(token);
  }
});
```

### 3. Search & Filter

**Description**: Search and filter across transactions, expenses, and reports.

**Capabilities**:
- Text search (fuzzy matching)
- Date range filtering
- Shop filtering
- Employee filtering
- Service type filtering
- Status filtering

**Implementation**: Local state filtering or API query parameters

**Search Pattern**:
```typescript
// Local search
const filtered = items.filter(item =>
  item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.shop.toLowerCase().includes(searchTerm.toLowerCase())
);

// API search with query params
const params = new URLSearchParams({
  search: searchTerm,
  date_from: startDate,
  date_to: endDate,
  shop_id: shopId.toString()
});
```

### 4. Notifications & Alerts

**Description**: User feedback through alerts and notifications.

**Types**:
- Success alerts (green)
- Error alerts (red)
- Warning alerts (yellow)
- Info alerts (blue)
- Confirmation dialogs

**Implementation**:
```typescript
import { Alert } from 'react-native';

// Success
Alert.alert('Success', 'Transaction recorded successfully');

// Error
Alert.alert('Error', 'Failed to submit expense');

// Confirmation
Alert.alert(
  'Confirm Action',
  'Are you sure?',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', onPress: () => performAction() }
  ]
);
```

## Feature Details

### Revenue Division Logic

**How It Works**:

1. **Total Revenue Calculation**:
   ```
   Total Revenue = Sum of all transactions
   ```

2. **Expense Deduction**:
   ```
   // Expenses marked "deduct_before_division"
   Net Revenue = Total Revenue - Before Division Expenses
   ```

3. **CEO & Shop Division**:
   ```
   Division Base = 40% (configurable per shop)
   CEO Share = Net Revenue × (Division Base / 100)
   Shop Share = Net Revenue - CEO Share
   ```

4. **After Division Expenses**:
   ```
   Shop Final = Shop Share - After Division Expenses
   ```

5. **Employee Share**:
   ```
   // Distributed based on services rendered
   Employee Share = (Services Revenue / Total Revenue) × Shop Final
   ```

### Service Priority Pricing

**Priority Levels**:
- **Level 1**: Basic services (lowest price)
- **Level 2**: Standard services (medium price)
- **Level 3**: Premium services (highest price)

**Calculation**:
```typescript
function calculateTotal(selectedServiceIds: number[], allServices: Service[]): number {
  const selected = allServices.filter(s => selectedServiceIds.includes(s.id));
  
  if (selected.length === 0) return 0;
  if (selected.length === 1) return selected[0].base_price;
  
  // Multiple services: use highest priority service price
  const highestPriority = Math.max(...selected.map(s => s.priority));
  const highestPriorityService = selected.find(s => s.priority === highestPriority);
  
  return highestPriorityService?.base_price || 0;
}
```

### Performance Levels

**Ratings**:
1. **Poor**: Consistently below expectations
2. **Worse**: Significantly underperforming
3. **Average**: Meeting basic expectations
4. **Good**: Above average performance
5. **Excellent**: Outstanding performance

**Factors**:
- Revenue generated
- Customer satisfaction
- Service quality
- Punctuality
- Complaints received

### Guarantor Requirements

**Required Information**:
- Full name
- Relationship to employee/secretary
- Residential address
- Occupation
- Employer name
- Phone number
- Email address
- Identity number (National ID, etc.)

**Purpose**:
- Employment verification
- Emergency contact
- Security/accountability

### Data Sync Strategy

**Real-time Sync**:
- Dashboard metrics (periodic refresh)
- Transaction updates
- Expense status changes

**Offline Queue**:
- Transaction recording
- Expense logging
- Complaint submission

**Background Sync**:
- Automatic on network reconnection
- Manual sync trigger available
- Retry failed items

---

## Feature Roadmap (Future Enhancements)

### Planned Features
- [ ] Push notifications for complaint responses
- [ ] Real-time chat between CEO and staff
- [ ] Inventory management integration
- [ ] Customer database and CRM
- [ ] Appointment scheduling
- [ ] Mobile payment integration
- [ ] Biometric authentication
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced analytics dashboard

### Under Consideration
- Voice-activated service recording
- AI-powered revenue predictions
- Automated backup and restore
- Integration with accounting software
- Employee performance AI analysis
- Customer loyalty program

---

## Usage Statistics

**Key Metrics Tracked**:
- Transaction count per day/week/month
- Revenue trends
- Expense patterns
- Employee performance metrics
- Shop performance comparison
- Service popularity
- Payment method distribution

**Accessible By**:
- CEO: All metrics across all shops
- Secretary: Shop-specific metrics
- Employee: Personal metrics only

---

## Support & Documentation

For technical implementation details, see:
- [README.md](README.md) - Main documentation
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Developer guide
- [FRONTEND_API_GUIDE.md](FRONTEND_API_GUIDE.md) - API integration
- [dev_dir/api-spec.md](dev_dir/api-spec.md) - Backend API spec
- [EAS_BUILD_INSTRUCTIONS.md](EAS_BUILD_INSTRUCTIONS.md) - Build guide
