import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ComplaintsScreen from './screens/ComplaintsScreen';
import ReportExportScreen from './screens/ReportExportScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import DivisionSettingsScreen from './screens/DivisionSettingsScreen';
import EarningsScreen from './screens/EarningsScreen';
import ReportsScreen from './screens/ReportsScreen';
import ShopsScreen from './screens/ShopsScreen';
import EmployeesScreen from './screens/EmployeesScreen';
import SecretariesScreen from './screens/SecretariesScreen';
import RoleTabs from './navigation/RoleTabs';

function SplashScreen({ navigation }) {
  // Removed automatic redirect; only manual button is available
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a2238' }}>
      <Image
        source={require('./assets/images/logo.png')}
        style={{ width: 120, height: 120, marginBottom: 24 }}
        resizeMode="contain"
      />
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>UMILAX</Text>
      <Text style={{ color: '#fff', fontSize: 18 }}>Welcome to UMILAX</Text>
      <View style={{ marginTop: 32, alignItems: 'center' }}>
        <Text style={{ color: '#fff', marginBottom: 8 }}>Or tap below to login:</Text>
        <TouchableOpacity
          style={{ padding: 12, backgroundColor: '#e94560', borderRadius: 8, marginTop: 8 }}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
/**
 * SplashScreen
 * Displays the UMILAX splash screen with branding and a button to navigate to the login page.
 * Only manual navigation is available.
 */
/**
 * LoginScreen
 * Renders the login page for UMILAX users.
 */
function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-navy">
      <Text className="text-white text-2xl font-bold">UMILAX Login</Text>
    </View>
  );
}

/**
 * RegisterScreen
 * Renders the registration page for new UMILAX users.
 */
function RegisterScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-navy">
      <Text className="text-white text-2xl font-bold">Register</Text>
    </View>
  );
}

// Dashboard Screens
/**
 * CEODashboard
 * Displays the dashboard for CEO users with relevant information.
 */
// Dashboard components are provided by the RoleTabs navigation

const Stack = createNativeStackNavigator();

/**
 * App
 * Root component that sets up navigation and safe area context for the UMILAX app.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => <RoleTabs role="Secretary" />}
          </Stack.Screen>
          <Stack.Screen name="Complaints" component={ComplaintsScreen} options={{ title: 'Complaints' }} />
          <Stack.Screen name="ReportExport" component={ReportExportScreen} options={{ title: 'Export Reports' }} />
          <Stack.Screen name="TransactionsScreen" component={TransactionsScreen} options={{ title: 'Transactions' }} />
          <Stack.Screen name="ExpensesScreen" component={ExpensesScreen} options={{ title: 'Expenses' }} />
          <Stack.Screen name="DivisionSettingsScreen" component={DivisionSettingsScreen} options={{ title: 'Division Settings' }} />
          <Stack.Screen name="EarningsScreen" component={EarningsScreen} options={{ title: 'Earnings' }} />
          <Stack.Screen name="ReportsScreen" component={ReportsScreen} options={{ title: 'Reports' }} />
          <Stack.Screen name="ShopsScreen" component={ShopsScreen} options={{ title: 'Shops' }} />
          <Stack.Screen name="ShopDetailsScreen" component={require('./screens/ShopDetailsScreen').default} options={{ title: 'Shop Details' }} />
          <Stack.Screen name="EmployeesScreen" component={EmployeesScreen} options={{ title: 'Employees' }} />
          <Stack.Screen name="SecretariesScreen" component={SecretariesScreen} options={{ title: 'Secretaries' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
