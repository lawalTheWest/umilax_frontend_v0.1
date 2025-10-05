import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const initialComplaints = [
  { id: 1, text: 'Need more dye supplies.', date: '2025-09-26' },
];

export default function SecretariesScreen() {
  const [secretaries, setSecretaries] = useState<string[]>(['Alice', 'Bob']);
  const [newSecretary, setNewSecretary] = useState('');
  const [complaints, setComplaints] = useState(initialComplaints);
  const [complaintText, setComplaintText] = useState('');

  const addSecretary = () => {
    if (newSecretary.trim()) {
      setSecretaries([...secretaries, newSecretary.trim()]);
      setNewSecretary('');
    }
  };

  const handleAddComplaint = () => {
    if (complaintText.trim()) {
      setComplaints([
        { id: Date.now(), text: complaintText.trim(), date: new Date().toISOString().slice(0, 10) },
        ...complaints,
      ]);
      setComplaintText('');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Secretaries Management</Text>
      <FlatList
        data={secretaries}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, padding: 12, marginVertical: 6, width: 260, alignItems: 'center', borderWidth: 1, borderColor: '#e94560' }}>
            <Text style={{ fontSize: 16, color: '#1a2238' }}>{item}</Text>
          </View>
        )}
        style={{ marginBottom: 16, width: '100%' }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, width: 180, fontSize: 16, marginRight: 8 }}
          value={newSecretary}
          onChangeText={setNewSecretary}
          placeholder="New secretary name"
        />
        <TouchableOpacity onPress={addSecretary} style={{ backgroundColor: '#e94560', padding: 10, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Secretary</Text>
        </TouchableOpacity>
      </View>
      {/* Complaint logging UI */}
      <View style={{ width: '100%', marginBottom: 18 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Log a Complaint</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, flex: 1, fontSize: 16, marginRight: 8 }}
            value={complaintText}
            onChangeText={setComplaintText}
            placeholder="Describe your complaint..."
          />
          <TouchableOpacity onPress={handleAddComplaint} style={{ backgroundColor: '#e94560', padding: 10, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* List own complaints */}
      <FlatList
        data={complaints}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, padding: 12, marginVertical: 6, width: 260, alignItems: 'flex-start', borderWidth: 1, borderColor: '#e94560' }}>
            <Text style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>{item.text}</Text>
            <Text style={{ fontSize: 13, color: '#888' }}>Date: {item.date}</Text>
          </View>
        )}
        style={{ marginBottom: 16, width: '100%' }}
      />
    </View>
  );
}
