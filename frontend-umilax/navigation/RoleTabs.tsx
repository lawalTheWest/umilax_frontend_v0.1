import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScrollableTabBar from './ScrollableTabBar';
import { getRoleTabs } from './roleTabConfig';

const Tab = createBottomTabNavigator();

/**
 * RoleTabs
 * Provides bottom tab navigation for different roles (CEO, Secretary, Employee) and conditionally renders tabs based on role.
 */
export default function RoleTabs({ role }: { role: string }) {
  const tabs = getRoleTabs(role);
  return (
    <>
      <Tab.Navigator
        initialRouteName={tabs[0]?.name || 'Complaints'}
        tabBar={props => <ScrollableTabBar {...props} />}
      >
        {tabs.map(tab => (
          <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
        ))}
      </Tab.Navigator>
      {/* Tabs rendered above - debug output removed for production */}
    </>
  );
}
