import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function getTabIcon(tabName: string) {
  switch (tabName) {
    case 'Complaints': return 'alert-circle-outline';
    case 'Reports': return 'file-chart-outline';
    case 'Transactions': return 'swap-horizontal-bold';
    case 'Expenses': return 'cash-minus';
    case 'ServiceRecording': return 'clipboard-list';
    case 'ExpenseLogging': return 'file-document-edit';
    case 'DivisionSettings': return 'cog-outline';
    default: return 'circle-outline';
  }
}

export default function ScrollableTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              // testID removed for compatibility
              onPress={onPress}
              style={[styles.tab, isFocused && styles.tabFocused]}
            >
              <Text style={[styles.tabText, isFocused && styles.tabTextFocused]}>
                <MaterialCommunityIcons name={getTabIcon(route.name)} size={18} color={isFocused ? '#fff' : '#1a2238'} /> {typeof label === 'string' ? label : String(label)}
              </Text>

            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  scrollView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  tabFocused: {
    backgroundColor: '#1a2238',
  },
  tabText: {
    color: '#1a2238',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabTextFocused: {
    color: '#fff',
  },
});
