
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BASE_API_URL } from '../utils/api';

interface Shop {
  id: number;
  name: string;
  location: string;
  division_base: string;
}
const BASE_URL = BASE_API_URL.replace(/\/$/, '');

export default function ShopsScreen() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [newShop, setNewShop] = useState({ name: '', location: '', division_base: '' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
  fetch(`${BASE_URL}/shops/`)
      .then(res => res.json())
      .then(data => {
        setShops(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load shops');
        setLoading(false);
      });
  }, []);

  const handleAddShop = () => {
    if (!newShop.name.trim() || !newShop.location.trim() || !newShop.division_base.trim()) {
      Alert.alert('All fields are required');
      return;
    }
    setAdding(true);
  fetch(`${BASE_URL}/shops/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newShop),
    })
      .then(res => res.json())
      .then(data => {
        setShops(s => [...s, data]);
        setNewShop({ name: '', location: '', division_base: '' });
        setAdding(false);
      })
      .catch(() => {
        setError('Failed to add shop');
        setAdding(false);
      });
  };

  const handleDeleteShop = (id: number) => {
    Alert.alert('Delete Shop', 'Are you sure you want to delete this shop?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          fetch(`${BASE_URL}/shops/${id}/`, { method: 'DELETE' })
            .then(() => setShops(s => s.filter(shop => shop.id !== id)))
            .catch(() => setError('Failed to delete shop'));
        }
      }
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e94560" />;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shops Management</Text>
      <FlatList
        data={shops}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => (navigation as any).navigate('ShopDetailsScreen', { shopId: item.id })}
          >
            <Text style={styles.shopName}>{item.name}</Text>
            <Text style={styles.shopInfo}>Location: {item.location}</Text>
            <Text style={styles.shopInfo}>Division Base: {item.division_base}</Text>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteShop(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        style={{ marginBottom: 16, width: '100%' }}
      />
      <View style={styles.addForm}>
        <TextInput
          style={styles.input}
          value={newShop.name}
          onChangeText={v => setNewShop(f => ({ ...f, name: v }))}
          placeholder="Shop name"
        />
        <TextInput
          style={styles.input}
          value={newShop.location}
          onChangeText={v => setNewShop(f => ({ ...f, location: v }))}
          placeholder="Location"
        />
        <TextInput
          style={styles.input}
          value={newShop.division_base}
          onChangeText={v => setNewShop(f => ({ ...f, division_base: v }))}
          placeholder="Division base"
        />
        <TouchableOpacity onPress={handleAddShop} style={styles.addBtn} disabled={adding}>
          <Text style={styles.addText}>{adding ? 'Adding...' : 'Add Shop'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1a2238' },
  card: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 16, marginVertical: 6, width: 280, alignItems: 'flex-start', borderWidth: 1, borderColor: '#e94560' },
  shopName: { fontSize: 18, fontWeight: 'bold', color: '#1a2238' },
  shopInfo: { fontSize: 15, color: '#222', marginTop: 2 },
  deleteBtn: { backgroundColor: '#e94560', padding: 6, borderRadius: 8, marginTop: 8, alignSelf: 'flex-end' },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  addForm: { width: 280, marginTop: 18 },
  input: { borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, fontSize: 16, marginBottom: 8 },
  addBtn: { backgroundColor: '#21e6c1', padding: 10, borderRadius: 8, alignItems: 'center' },
  addText: { color: '#1a2238', fontWeight: 'bold' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#e94560', fontSize: 16 },
});
