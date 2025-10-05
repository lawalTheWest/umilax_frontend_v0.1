import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { v4 as uuidv4 } from 'uuid';
import { addToQueue, getQueue, syncQueue } from '../utils/offlineQueue';
import { getAccessToken } from '../utils/authStorage';
import { BASE_API_URL } from '../utils/api';
import { MaterialIcons } from '@expo/vector-icons';


// Dummy transaction data
type Transaction = {
  id: string;
  timestamp: string;
  amount: number;
  services: string[];
  renderedBy: string;
  recordedBy: string;
  shop: string;
  type: string;
  description: string;
  notes?: string;
  [key: string]: any;
};



// Use centralized API base URL from utils/api
const BASE_URL = BASE_API_URL;

export default function TransactionsScreen() {
  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
  fetch(`${BASE_URL}/transactions/`)
      .then(res => res.json())
      .then(data => {
        setTransactionsList(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load transactions');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // subscribe to network state and attempt auto-sync when regaining connectivity
    const unsubscribe = NetInfo.addEventListener(async (state: NetInfoState) => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        const token = await getAccessToken();
        const result = await syncQueue(token || undefined);
        // refresh pending count after sync
        const q = await getQueue();
        setPendingCount(q.length);
        if (result.synced > 0) {
          Alert.alert('Sync complete', `${result.synced} items synced, ${result.failed} failed.`);
          // optional: refresh transactions list from server
        }
      }
    });

    // initial load of pending queue
    (async () => {
      const q = await getQueue();
      setPendingCount(q.length);
    })();

    return () => unsubscribe();
  }, []);

  // Filter transactions by search query
  const filteredTransactions = transactionsList.filter(
    t =>
      t.renderedBy?.toLowerCase().includes(search.toLowerCase()) ||
      t.recordedBy?.toLowerCase().includes(search.toLowerCase()) ||
      t.shop?.toLowerCase().includes(search.toLowerCase()) ||
      t.type?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      (t.services?.join(',').toLowerCase().includes(search.toLowerCase()))
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setSelected(item)}
      style={{
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.type}</Text>
        <Text style={{ color: '#4b5563', fontSize: 14 }}>{item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}</Text>
      </View>
      <Text style={{ marginTop: 4, color: '#374151', fontSize: 15 }}>{item.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ color: '#6b7280', fontSize: 14 }}>Service(s): {item.services?.join(', ')}</Text>
        <Text style={{ color: '#6b7280', fontSize: 14 }}>Shop: {item.shop}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={{ color: '#6b7280', fontSize: 14 }}>Rendered by: {item.renderedBy}</Text>
        <Text style={{ color: '#6b7280', fontSize: 14 }}>Recorded by: {item.recordedBy}</Text>
      </View>
      <Text style={{ marginTop: 8, fontWeight: 'bold', color: '#10b981', fontSize: 16 }}>
        ₦{item.amount?.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  // Minimal record transaction flow for demo purposes
  async function recordTransactionDemo() {
    const payload = {
      amount: 1000,
      services: ['Service A'],
      rendered_by: 'employee-uuid',
      recorded_by: 'employee-uuid',
      shop: 'shop-uuid',
      type: 'service',
      description: 'Demo transaction recorded from device',
    };

    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      // queue locally
      const localId = uuidv4();
      await addToQueue({
        id: localId,
    endpoint: '/transactions/record/',
        method: 'POST',
        body: payload,
      });
      const q = await getQueue();
      setPendingCount(q.length);
      Alert.alert('Saved offline', 'Transaction saved locally and will be synced when online.');
      return;
    }

    // online: try posting directly
  const token = await getAccessToken();
    try {
  const res = await fetch(`${BASE_URL}/transactions/record/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to record transaction');
      }
      Alert.alert('Success', 'Transaction recorded to server');
      // refresh list
  const refreshed = await fetch(`${BASE_URL}/transactions/`);
      const data = await refreshed.json();
      setTransactionsList(data);
    } catch (e) {
      // on error, queue locally
      const localId = uuidv4();
      await addToQueue({
        id: localId,
  endpoint: '/transactions/record/',
        method: 'POST',
        body: payload,
        error: String(e),
      });
      const q = await getQueue();
      setPendingCount(q.length);
      Alert.alert('Saved offline', 'Could not post to server; saved locally to retry later.');
    }
  }

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>Loading transactions...</Text></View>;
  if (error) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#e94560', fontSize: 18 }}>{error}</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16, backgroundColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons name="search" size={22} color="#6b7280" style={{ marginRight: 8 }} />
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 15,
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}
          placeholder="Search transactions..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Text style={{ color: '#6b7280', fontSize: 16 }}>No transactions found.</Text>
          </View>
        }
      />
      <View style={{ padding: 16 }}>
        <Text style={{ marginBottom: 8 }}>Network: {isConnected ? 'Online' : isConnected === false ? 'Offline' : 'Unknown'}</Text>
        <Text style={{ marginBottom: 8 }}>Pending queue: {pendingCount}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="Record Demo Transaction" onPress={recordTransactionDemo} />
          <Button
            title="Sync Now"
            onPress={async () => {
              const token = await getAccessToken();
              const result = await syncQueue(token || undefined);
              const q = await getQueue();
              setPendingCount(q.length);
              Alert.alert('Sync result', `${result.synced} synced, ${result.failed} failed`);
            }}
          />
        </View>
      </View>
      {/* Details Modal */}
      {selected && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.25)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              width: '85%',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Transaction Details</Text>
            <Text style={{ color: '#374151', fontSize: 15 }}>Type: {selected.type}</Text>
            <Text style={{ color: '#374151', fontSize: 15 }}>Time: {selected.timestamp ? new Date(selected.timestamp).toLocaleString() : ''}</Text>
            <Text style={{ color: '#374151', fontSize: 15 }}>Service(s): {selected.services?.join(', ')}</Text>
            <Text style={{ color: '#374151', fontSize: 15 }}>Rendered by: {selected.renderedBy}</Text>
            <Text style={{ color: '#374151', fontSize: 15 }}>Recorded by: {selected.recordedBy}</Text>
            <Text style={{ color: '#374151', fontSize: 15 }}>Shop: {selected.shop}</Text>
            <Text style={{ color: '#374151', fontSize: 15 }}>Description: {selected.description}</Text>
            {selected.notes && <Text style={{ color: '#374151', fontSize: 15 }}>Notes: {selected.notes}</Text>}
            <Text style={{ marginTop: 8, fontWeight: 'bold', color: '#10b981', fontSize: 16 }}>
              ₦{selected.amount?.toLocaleString()}
            </Text>
            <Text
              style={{
                marginTop: 16,
                color: '#ef4444',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 15,
              }}
              onPress={() => setSelected(null)}
            >
              Close
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
