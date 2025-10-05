import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { BASE_API_URL } from '../utils/api';
import { useNavigation } from '@react-navigation/native';

interface Shop {
  id: number;
  name: string;
  location: string;
  division_base: string;
}

export default function ShopDetailsScreen({ route }: any) {
  const { shopId } = route.params;
  const navigation = useNavigation();
  const [shop, setShop] = useState<Shop | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', division_base: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch shop details from backend
    fetch(`${BASE_API_URL}/shops/${shopId}/`)
      .then(res => res.json())
      .then(data => {
        setShop(data);
        setForm({ name: data.name, location: data.location, division_base: data.division_base });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load shop details');
        setLoading(false);
      });
  }, [shopId]);

  const handleSave = () => {
    setSaving(true);
    fetch(`${BASE_API_URL}/shops/${shopId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        setShop(data);
        setEditMode(false);
        setSaving(false);
      })
      .catch(() => {
        setError('Failed to save changes');
        setSaving(false);
      });
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e94560" />;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  if (!shop) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Details</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        {editMode ? (
          <TextInput style={styles.input} value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} />
        ) : (
          <Text style={styles.value}>{shop.name}</Text>
        )}
        <Text style={styles.label}>Location:</Text>
        {editMode ? (
          <TextInput style={styles.input} value={form.location} onChangeText={v => setForm(f => ({ ...f, location: v }))} />
        ) : (
          <Text style={styles.value}>{shop.location}</Text>
        )}
        <Text style={styles.label}>Division Base:</Text>
        {editMode ? (
          <TextInput style={styles.input} value={form.division_base} onChangeText={v => setForm(f => ({ ...f, division_base: v }))} />
        ) : (
          <Text style={styles.value}>{shop.division_base}</Text>
        )}
      </View>
      <View style={styles.actions}>
        {editMode ? (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1a2238' },
  card: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: '#e94560' },
  label: { fontSize: 16, color: '#1a2238', marginTop: 8 },
  value: { fontSize: 16, color: '#222', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, fontSize: 16, marginBottom: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  editBtn: { backgroundColor: '#e94560', padding: 10, borderRadius: 8, marginRight: 8 },
  editText: { color: '#fff', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#21e6c1', padding: 10, borderRadius: 8, marginRight: 8 },
  saveText: { color: '#1a2238', fontWeight: 'bold' },
  backBtn: { backgroundColor: '#1a2238', padding: 10, borderRadius: 8 },
  backText: { color: '#fff', fontWeight: 'bold' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#e94560', fontSize: 16 },
});
