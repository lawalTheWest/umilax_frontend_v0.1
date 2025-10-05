import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { BASE_API_URL } from '../utils/api';

export default function ManageComplaintsScreen() {
  // Add setStatus function to update complaint status
  const setStatus = (id: number, status: string) => {
    setComplaints(list => list.map(c => c.id === id ? { ...c, status } : c));
  };
  const [complaints, setComplaints] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${BASE_API_URL}/complaints/`)
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load complaints');
        setLoading(false);
      });
  }, []);

  const handleReply = (id: number) => {
    fetch(`${BASE_API_URL}/complaints/${id}/respond/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: reply }),
    })
      .then(res => res.json())
      .then(() => {
        setComplaints(list => list.map(c => c.id === id ? { ...c, response: reply, status: 'resolved' } : c));
        setReply('');
        setSelectedId(null);
      })
      .catch(() => Alert.alert('Error', 'Failed to send reply'));
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e94560" />;
  if (error) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#e94560', fontSize: 16 }}>{error}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Manage Complaints</Text>
      <FlatList
        data={complaints}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, padding: 12, marginVertical: 6, width: 300, borderWidth: 1, borderColor: '#e94560' }}>
            <Text style={{ fontSize: 16, color: '#1a2238' }}>{item.user} ({item.role})</Text>
            <Text style={{ fontSize: 15, color: '#222', marginTop: 4 }}>Complaint: {item.message}</Text>
            <Text style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Status: {item.status}</Text>
            {item.response ? (
              <Text style={{ fontSize: 14, color: '#43d9ad', marginTop: 4 }}>Response: {item.response}</Text>
            ) : (
              selectedId === item.id ? (
                <View style={{ marginTop: 8 }}>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, width: 220, fontSize: 15, marginBottom: 8 }}
                    value={reply}
                    onChangeText={setReply}
                    placeholder="Type your reply"
                  />
                  <TouchableOpacity onPress={() => handleReply(item.id)} style={{ backgroundColor: '#43d9ad', padding: 10, borderRadius: 8, marginBottom: 6 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send Reply & Mark Resolved</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelectedId(null)} style={{ backgroundColor: '#e94560', padding: 8, borderRadius: 8 }}>
                    <Text style={{ color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setSelectedId(item.id)} style={{ backgroundColor: '#e94560', padding: 8, borderRadius: 8, marginTop: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reply</Text>
                </TouchableOpacity>
              )
            )}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity onPress={() => setStatus(item.id, 'pending')} style={{ backgroundColor: item.status === 'pending' ? '#e94560' : '#f3f4f6', padding: 8, borderRadius: 8 }}>
                <Text style={{ color: item.status === 'pending' ? '#fff' : '#1a2238' }}>Set Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStatus(item.id, 'resolved')} style={{ backgroundColor: item.status === 'resolved' ? '#43d9ad' : '#f3f4f6', padding: 8, borderRadius: 8 }}>
                <Text style={{ color: item.status === 'resolved' ? '#fff' : '#1a2238' }}>Set Resolved</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={{ marginBottom: 16 }}
      />
    </View>
  );
}
