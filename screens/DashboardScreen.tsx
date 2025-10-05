import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import RoleTabs from '../navigation/RoleTabs';

/**
 * DashboardScreen
 * Determines user role from navigation params and renders the appropriate tabbed dashboard using RoleTabs.
 */
export default function DashboardScreen() {
  const params = useLocalSearchParams();
  const role = params.role ? String(params.role) : 'Employee';
  // RoleTabs imported statically above
  return (
    <View style={{ flex: 1 }}>
      <RoleTabs role={role} />
    </View>
  );
}
