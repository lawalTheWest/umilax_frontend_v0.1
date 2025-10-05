import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { BASE_API_URL } from '../utils/api';
const BASE_URL = BASE_API_URL.replace(/\/$/, '');

export default function ReportsScreen() {
  const [reports, setReports] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  fetch(`${BASE_URL}/reports/`)
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load reports');
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e94560" />;
  if (error) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#e94560', fontSize: 16 }}>{error}</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Reports</Text>
  {/* Render reports data here as needed */}
  <Text style={{ fontSize: 16, color: '#1a2238' }}>Reports loaded from backend at {BASE_URL}/reports/.</Text>
    </ScrollView>
  );
}