
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';

// Dummy complaints data
const initialComplaints = [
  { id: 1, user: 'John Doe', role: 'Employee', text: 'Hair dryer not working.', date: '2025-09-27', checked: false, reply: '' },
  { id: 2, user: 'Alice', role: 'Secretary', text: 'Need more dye supplies.', date: '2025-09-26', checked: true, reply: 'We will order more supplies.' },
  { id: 3, user: 'Jane Smith', role: 'Employee', text: 'Shift schedule conflict.', date: '2025-09-25', checked: false, reply: '' },
];

// Simulate role (replace with actual role from context/auth)
const userRole = globalThis.userRole || 'Employee'; // 'CEO', 'Employee', 'Secretary'

export default function ComplaintsScreen() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [replyInputs, setReplyInputs] = useState<{ [id: number]: string }>({});
  const [complaintText, setComplaintText] = useState('');
  const [filter, setFilter] = useState('All');

  // CEO: filter complaints by role
  const filteredComplaints = userRole === 'CEO'
    ? complaints.filter(c => filter === 'All' || c.role === filter)
    : complaints;

  // CEO: manage complaints
  const handleCheck = (id: number) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };
  const handleReplyInput = (id: number, text: string) => {
    setReplyInputs(prev => ({ ...prev, [id]: text }));
  };
  const handleSendReply = (id: number) => {
    const replyText = replyInputs[id]?.trim();
    if (replyText) {
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, reply: replyText } : c));
      setReplyInputs(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Employee/Secretary: log complaint only
  const handleAddComplaint = () => {
    if (complaintText.trim()) {
      setComplaints([
        { id: Date.now(), user: 'You', role: userRole, text: complaintText.trim(), date: new Date().toISOString().slice(0, 10), checked: false, reply: '' },
        ...complaints,
      ]);
      setComplaintText('');
    }
  };

  if (userRole === 'CEO') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Complaints Management (CEO)</Text>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          {['All', 'Employee', 'Secretary'].map(r => (
            <TouchableOpacity
              key={r}
              onPress={() => setFilter(r)}
              style={{ backgroundColor: filter === r ? '#e94560' : '#f3f4f6', padding: 8, borderRadius: 8, marginRight: 8 }}
            >
              <Text style={{ color: filter === r ? '#fff' : '#222', fontWeight: 'bold' }}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={filteredComplaints}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, padding: 14, marginVertical: 8, borderWidth: 1, borderColor: item.checked ? '#43d9ad' : '#e94560' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1a2238' }}>{item.user} ({item.role})</Text>
              <Text style={{ fontSize: 15, color: '#222', marginVertical: 4 }}>{item.text}</Text>
              <Text style={{ fontSize: 13, color: '#888' }}>Date: {item.date}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ color: item.checked ? '#43d9ad' : '#e94560', fontWeight: 'bold', marginRight: 12 }}>
                  {item.checked ? 'Checked (Attended)' : 'Pending'}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCheck(item.id)}
                  style={{ backgroundColor: item.checked ? '#43d9ad' : '#e94560', padding: 8, borderRadius: 8 }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.checked ? 'Mark Pending' : 'Mark Checked'}</Text>
                </TouchableOpacity>
              </View>
              {/* CEO reply section */}
              <View style={{ marginTop: 10 }}>
                {item.reply ? (
                  <View style={{ backgroundColor: '#43d9ad', borderRadius: 8, padding: 8, marginBottom: 6 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>CEO Reply:</Text>
                    <Text style={{ color: '#fff' }}>{item.reply}</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, flex: 1, fontSize: 15, marginRight: 8 }}
                      value={replyInputs[item.id] || ''}
                      onChangeText={text => handleReplyInput(item.id, text)}
                      placeholder="Type reply..."
                    />
                    <TouchableOpacity onPress={() => handleSendReply(item.id)} style={{ backgroundColor: '#e94560', padding: 8, borderRadius: 8 }}>
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send Reply</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  // Employee/Secretary: log complaint only
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 24, alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Log a Complaint</Text>
      <View style={{ width: '100%', marginBottom: 18 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Describe your complaint</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, flex: 1, fontSize: 16, marginRight: 8 }}
            value={complaintText}
            onChangeText={setComplaintText}
            placeholder="Type your complaint..."
          />
          <TouchableOpacity onPress={handleAddComplaint} style={{ backgroundColor: '#e94560', padding: 10, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* List own complaints (optional, can be removed if not needed) */}
      <FlatList
        data={complaints.filter(c => c.user === 'You')}
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
