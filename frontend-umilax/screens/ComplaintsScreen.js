import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert } from 'react-native';

import { BASE_API_URL } from '../utils/api';
const BACKEND_URL = BASE_API_URL; // Uses deployed backend by default

export default function ComplaintsScreen() {
  const [complaints, setComplaints] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/complaints/`);
      const data = await res.json();
      setComplaints(data);
    } catch (_err) {
      Alert.alert('Error', 'Failed to fetch complaints');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Log a new complaint
  const logComplaint = async () => {
    if (!newMessage) return;
    setLoading(true);
    try {
      // Replace with actual shop/user IDs as needed
      const res = await fetch(`${BACKEND_URL}/complaints/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage, shop: 'your-shop-id', user: 1 }),
      });
      if (res.ok) {
        setNewMessage('');
        fetchComplaints();
      } else {
        Alert.alert('Error', 'Failed to log complaint');
      }
    } catch (_err) {
      Alert.alert('Error', 'Failed to log complaint');
    }
    setLoading(false);
  };

  // Respond to a complaint
  const respondToComplaint = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/complaints/${id}/respond/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: 'Thank you for your feedback.' }),
      });
      if (res.ok) fetchComplaints();
      else Alert.alert('Error', 'Failed to respond');
    } catch (_err) {
      Alert.alert('Error', 'Failed to respond');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Complaints</Text>
      <View style={{ flexDirection: 'row', marginVertical: 12 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 }}
          placeholder="Enter complaint message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Log" onPress={logComplaint} disabled={loading} />
      </View>
      <FlatList
        data={complaints}
        keyExtractor={item => item.id?.toString()}
        refreshing={loading}
        onRefresh={fetchComplaints}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 8, padding: 12, backgroundColor: '#eee', borderRadius: 8 }}>
            <Text>Message: {item.message}</Text>
            <Text>Response: {item.response || 'Pending'}</Text>
            <Button title="Respond" onPress={() => respondToComplaint(item.id)} disabled={loading} />
          </View>
        )}
      />
    </View>
  );
}
