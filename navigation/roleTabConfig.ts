import PersonalReportScreen from '../screens/PersonalReportScreen';
import CEODashboardScreen from '../screens/CEODashboardScreen';
// Centralized tab configuration for RoleTabs and DashboardScreen
import ComplaintsScreen from '../screens/ComplaintsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import DivisionSettingsScreen from '../screens/DivisionSettingsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import SecretaryExpenseLoggingScreen from '../screens/SecretaryExpenseLoggingScreen';
import EarningsScreen from '../screens/EarningsScreen';
import EmployeeDashboardScreen from '../screens/EmployeeDashboardScreen';
import SecretaryDashboardScreen from '../screens/SecretaryDashboardScreen';
import SecretaryServiceRecordingScreen from '../screens/SecretaryServiceRecordingScreen';
import ManageUsersScreen from '../screens/ManageUsersScreen';
import CEOServiceRecordingScreen from '../screens/CEOServiceRecordingScreen';
import ManageComplaintsScreen from '../screens/ManageComplaintsScreen';
// ExpenseLogging import removed

export function getRoleTabs(role: string) {
  if (role === 'CEO') {
    return [
      { name: 'Dashboard', component: CEODashboardScreen },
      { name: 'Transactions', component: TransactionsScreen },
      { name: 'CEO Service Recording', component: CEOServiceRecordingScreen },
      { name: 'Manage Expenses', component: ExpensesScreen },
      { name: 'DivisionSettings', component: DivisionSettingsScreen },
      { name: 'Shops', component: require('../screens/ShopsScreen').default },
      { name: 'Manage Employees & Secretaries', component: ManageUsersScreen },
      { name: 'Manage Complaints', component: ManageComplaintsScreen },
      { name: 'Earnings', component: EarningsScreen },
      { name: 'Reports', component: ReportsScreen },
    ];
  }
  if (role === 'Secretary') {
    return [
      { name: 'Dashboard', component: SecretaryDashboardScreen },
      { name: 'Transactions', component: TransactionsScreen },
      { name: 'ServiceRecording', component: SecretaryServiceRecordingScreen },
      { name: 'Log Expenses', component: SecretaryExpenseLoggingScreen },
      { name: 'Reports', component: ReportsScreen },
      // Complaints tab removed for Secretary
    ];
  }
  if (role === 'Employee') {
    return [
      { name: 'Dashboard', component: EmployeeDashboardScreen },
      { name: 'Transactions', component: TransactionsScreen },
      { name: 'Earnings', component: EarningsScreen },
      { name: 'Personal Report', component: PersonalReportScreen },
      // Complaints tab removed for Employee
    ];
  }
  // Default fallback
  return [
    { name: 'Dashboard', component: CEODashboardScreen },
    { name: 'Transactions', component: TransactionsScreen },
    { name: 'Expenses', component: ExpensesScreen },
    { name: 'Reports', component: ReportsScreen },
  ];
}
