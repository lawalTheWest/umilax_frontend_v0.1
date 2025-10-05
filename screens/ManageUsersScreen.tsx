import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { deactivateUser, BASE_API_URL } from '../utils/api';

type UserType = {
  id: number;
  name: string;
  role: string;
  shop: string;
  passport: string;
  is_active: boolean;
  guarantor: {
    name: string;
    relationship: string;
    address: string;
    phone: string;
  };
};

export default function ManageUsersScreen() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shopFilter, setShopFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  // filteredUsers is derived from users and shopFilter
  const filteredUsers = shopFilter
    ? users.filter(u => u.shop.toLowerCase().includes(shopFilter.toLowerCase()))
    : users;
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    fetch(`${BASE_API_URL}/users/`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const handleDeactivate = (id: number) => {
    Alert.alert('Deactivate User', 'Are you sure you want to deactivate this user?', [
      { text: 'Cancel', style: 'cancel' },
          {
            text: 'Deactivate', style: 'destructive', onPress: () => {
          fetch(`${BASE_API_URL}/users/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: false }),
          })
            .then(res => res.json())
            .then(() => setUsers(u => u.map(user => user.id === id ? { ...user, is_active: false } : user)))
            .catch(() => setError('Failed to deactivate user'));
        }
      }
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e94560" />;
  if (error) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#e94560', fontSize: 16 }}>{error}</Text></View>;

  // Removed duplicate and unreachable return block

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#e94560' }}>Manage Employees & Secretaries</Text>
      <Text style={{ fontSize: 14, color: '#888', marginBottom: 18, textAlign: 'center', maxWidth: 320 }}>
        Tap a card to view full details. Use the shop filter to quickly find users. All info is shown instantly.
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, width: 220, fontSize: 16, marginRight: 8 }}
          value={shopFilter}
          onChangeText={setShopFilter}
          placeholder="Search by shop name..."
        />
        <Text style={{ fontSize: 18, color: '#e94560' }}>🔍</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      ) : filteredUsers.length === 0 ? (
        <Text style={{ color: '#888', fontSize: 16, marginTop: 40 }}>No users found for this shop.</Text>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.name + item.role + item.shop}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedUser(item)}
              activeOpacity={0.85}
            >
              <View style={{ backgroundColor: '#f3f4f6', borderRadius: 14, padding: 16, marginVertical: 7, width: 280, alignItems: 'center', borderWidth: 1, borderColor: '#e94560', shadowColor: '#e94560', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}>
                <Image source={{ uri: item.passport }} style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 8, borderWidth: 2, borderColor: '#e94560' }} />
                <Text style={{ fontSize: 17, color: '#1a2238', fontWeight: 'bold' }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 2 }}>
                  <Text style={{ fontSize: 13, color: '#fff', backgroundColor: item.role === 'Secretary' ? '#e94560' : '#1a2238', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 }}>
                    {item.role}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#fff', backgroundColor: '#888', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                    {item.shop}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          style={{ marginBottom: 16, width: '100%' }}
        />
      )}
      {/* User Details Modal */}
      {selectedUser && (
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
            zIndex: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 32,
              width: 340,
              shadowColor: '#e94560',
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 6,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 10, color: '#e94560', textAlign: 'center' }}>User Details</Text>
            {selectedUser?.passport && (
              <Image source={{ uri: selectedUser.passport }} style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 10, borderWidth: 2, borderColor: '#e94560' }} />
            )}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>{selectedUser?.name ?? ''}</Text>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: '#fff', backgroundColor: selectedUser?.role === 'Secretary' ? '#e94560' : '#1a2238', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 }}>
                {selectedUser?.role ?? ''}
              </Text>
              <Text style={{ fontSize: 14, color: '#fff', backgroundColor: '#888', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                {selectedUser?.shop ?? ''}
              </Text>
            </View>
            <Text style={{ fontSize: 15, color: '#1a2238', marginBottom: 8 }}>Guarantor Info:</Text>
            <View style={{ marginBottom: 8, alignItems: 'flex-start', width: '100%' }}>
              <Text>Name: {selectedUser?.guarantor?.name ?? ''}</Text>
              <Text>Relationship: {selectedUser?.guarantor?.relationship ?? ''}</Text>
              <Text>Address: {selectedUser?.guarantor?.address ?? ''}</Text>
              <Text>Phone: {selectedUser?.guarantor?.phone ?? ''}</Text>
            </View>
            {/* CEO-only deactivate button */}
            {selectedUser?.is_active !== false ? (
              <TouchableOpacity
                style={{ backgroundColor: '#e94560', paddingVertical: 12, paddingHorizontal: 38, borderRadius: 12, marginTop: 14 }}
                onPress={async () => {
                  setDeactivating(true);
                  try {
                    // Replace with actual user ID and token in real integration
                    // Use deactivateUser helper which will call the API with proper URL
                    await deactivateUser(selectedUser?.id || 1, 'CEO_TOKEN');
                    setUsers(users.map(u => u.id === selectedUser?.id ? { ...u, is_active: false } : u));
                    setSelectedUser(selectedUser ? { ...selectedUser, is_active: false } : null);
                  } catch (e) {
                    alert('Failed to deactivate user');
                  }
                  setDeactivating(false);
                }}
                disabled={deactivating}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>{deactivating ? 'Deactivating...' : 'Deactivate User'}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ color: '#e94560', fontWeight: 'bold', marginTop: 14, fontSize: 17 }}>User is deactivated</Text>
            )}
            <TouchableOpacity
              style={{ backgroundColor: '#888', paddingVertical: 12, paddingHorizontal: 38, borderRadius: 12, marginTop: 14 }}
              onPress={() => setSelectedUser(null)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
