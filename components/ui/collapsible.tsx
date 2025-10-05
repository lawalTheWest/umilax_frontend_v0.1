import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {!collapsed && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    marginTop: 4,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
});
