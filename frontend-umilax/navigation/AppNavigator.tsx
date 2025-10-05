import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import DashboardScreen from '../screens/DashboardScreen';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import DivisionSettingsScreen from '../screens/DivisionSettingsScreen';
import AuthScreen from '../screens/AuthScreen';
import SplashScreen from '../screens/SplashScreen';
import CEOLoginScreen from '../screens/CEOLoginScreen';
import CEODashboardScreen from '../screens/CEODashboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator
 * Sets up the main stack navigation for the UMILAX app, including splash, auth, dashboard, and other screens.
 */
export default function AppNavigator() {
  return (
  <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CEOLogin" component={CEOLoginScreen} />
        <Stack.Screen name="CEODashboard" component={CEODashboardScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Complaints" component={ComplaintsScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="DivisionSettings" component={DivisionSettingsScreen} />
      </Stack.Navigator>
  );
}
