import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { BASE_API_URL } from '../utils/api';

  const filters = ['daily', 'weekly', 'monthly'];

  export default function EarningsScreen() {
    const [filter, setFilter] = useState<'daily'|'weekly'|'monthly'>('daily');
    const [earnings, setEarnings] = useState<any>({ daily: {}, weekly: {}, monthly: {}, shop_share: 0, ceo_share: 0, employee_share: 0, transactions: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      fetch(`${BASE_API_URL}/earnings/`)
        .then(res => res.json())
        .then(data => {
          setEarnings(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load earnings');
          setLoading(false);
        });
    }, []);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e94560" />;
    if (error) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#e94560', fontSize: 16 }}>{error}</Text></View>;

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Earnings</Text>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              style={{
                backgroundColor: filter === f ? '#1a2238' : '#eee',
                borderColor: '#1a2238',
                borderWidth: 2,
                borderRadius: 10,
                padding: 10,
                marginHorizontal: 6,
              }}
              onPress={() => setFilter(f as any)}
            >
              <Text style={{ color: filter === f ? '#fff' : '#1a2238', fontWeight: 'bold' }}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#1a2238', padding: 16, width: 260, alignItems: 'center', marginBottom: 16 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a2238' }}>Earnings</Text>
    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1a2238' }}>₦{earnings[filter]?.amount}</Text>
    <Text style={{ fontSize: 15, color: '#1a2238' }}>Contribution: {earnings[filter]?.percentage}%</Text>
        </View>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#1a2238', padding: 16, width: 260, alignItems: 'center', marginBottom: 16 }}>
    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1a2238' }}>Shop Share: ₦{earnings.shop_share}</Text>
    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1a2238' }}>CEO Share: ₦{earnings.ceo_share}</Text>
    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1a2238' }}>Employee Share: ₦{earnings.employee_share}</Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a2238', marginBottom: 8 }}>Recent Transactions</Text>
        <View>
          {earnings.transactions && earnings.transactions.filter((t: any) => {
            if (filter === 'daily') return t.date === earnings.daily?.date;
            if (filter === 'weekly') return t.date >= earnings.weekly?.start_date && t.date <= earnings.weekly?.end_date;
            if (filter === 'monthly') return t.date >= earnings.monthly?.start_date && t.date <= earnings.monthly?.end_date;
            return false;
          }).map((t: any) => (
            <View key={t.id} style={{ backgroundColor: '#eee', borderRadius: 8, padding: 10, marginBottom: 8, width: 240 }}>
              <Text style={{ fontSize: 15, color: '#222' }}>{t.service} - ₦{t.amount}</Text>
              <Text style={{ fontSize: 13, color: '#888' }}>{t.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
  );
}
