import React from 'react';
import { View, Text, FlatList } from 'react-native';

// Dummy data: Replace with backend/API integration
const personalReports = [
  { id: 1, title: 'August Contribution', date: '2025-08-31', amount: 5000 },
  { id: 2, title: 'September Contribution', date: '2025-09-30', amount: 6000 },
];

export default function PersonalReportScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>My Contributions</Text>
      <FlatList
        data={personalReports}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, padding: 14, marginVertical: 8, borderWidth: 1, borderColor: '#43d9ad' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1a2238' }}>{item.title}</Text>
            <Text style={{ fontSize: 15, color: '#222', marginVertical: 4 }}>₦{item.amount.toLocaleString()}</Text>
            <Text style={{ fontSize: 13, color: '#888' }}>Date: {item.date}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>No contributions found.</Text>}
      />
    </View>
  );
}
