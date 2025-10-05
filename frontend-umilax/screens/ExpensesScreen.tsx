
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BASE_API_URL } from '../utils/api';

// Dummy shop data (can be replaced with backend fetch if needed)
const shops = [
  { id: 'shop1', name: 'Umilax Salon 1' },
  { id: 'shop2', name: 'Umilax Salon 2' },
];



const BASE_URL = BASE_API_URL.replace(/\/$/, '');
export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<any[]>([]);
  useEffect(() => {
  fetch(`${BASE_URL}/expenses/`)
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(() => {});
  }, []);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedShop, setSelectedShop] = useState('all');

  // Dummy role (replace with context/auth)
  // Set userRole as a string for role-based logic
  const userRole: string = 'CEO'; // 'CEO', 'Secretary', 'Employee'

  // Secretary notification state (always defined, only used for secretary)
  const [notification, setNotification] = useState<string | null>(null);
  React.useEffect(() => {
    if (userRole === 'Secretary') {
      // Check for any expense status change (simulate CEO response)
      const responded = expenses.find(e => e.enteredBy === 'Secretary' && e.status !== 'Pending');
      if (responded) {
        setNotification(`Your expense "${responded.description}" was ${responded.status.toLowerCase()} by CEO.`);
      } else {
        setNotification(null);
      }
    }
  }, [expenses, userRole]);

  // Secretary can add expenses
  const handleAddExpense = () => {
    if (desc.trim() && amount.trim() && !isNaN(Number(amount))) {
      setExpenses([
        { id: Date.now(), description: desc.trim(), amount: Number(amount), date: new Date().toISOString().slice(0, 10), status: 'Pending', enteredBy: userRole, shop: selectedShop },
        ...expenses,
      ]);
      setDesc('');
      setAmount('');
    }
  };

  // CEO can approve/reject expenses
  // Only available for CEO, not secretary
  const handleApprove = userRole === 'CEO' ? (id: number) => {
    Alert.alert(
      'Approve Expense',
      'Are you sure you want to approve this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Approve', style: 'default', onPress: () => {
            fetch(`${BASE_URL}/expenses/${id}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Approved' }),
            })
              .then(res => res.json())
              .then(() => setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'Approved' } : e)))
              .catch(() => Alert.alert('Error', 'Failed to approve expense'));
          } },
      ]
    );
  } : undefined;
  const handleReject = userRole === 'CEO' ? (id: number) => {
    Alert.alert(
      'Reject Expense',
      'Are you sure you want to reject this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: () => {
            fetch(`${BASE_URL}/expenses/${id}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Rejected' }),
            })
              .then(res => res.json())
              .then(() => setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'Rejected' } : e)))
              .catch(() => Alert.alert('Error', 'Failed to reject expense'));
          } },
      ]
    );
  } : undefined;
  const handlePending = userRole === 'CEO' ? (id: number) => {
    Alert.alert(
      'Set Pending',
      'Are you sure you want to set this expense as pending?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Pending', style: 'default', onPress: () => setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'Pending' } : e)) },
      ]
    );
  } : undefined;

  // Filter expenses by shop for CEO
  const filteredExpenses = selectedShop === 'all' ? expenses : expenses.filter(e => e.shop === selectedShop);

  // Employee cannot see expenses screen
  if (userRole === 'Employee') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 18, color: '#888', textAlign: 'center' }}>You do not have access to view expenses.</Text>
      </View>
    );
  }

  // Secretary: Only log expense, no list or management
  if (userRole === 'Secretary') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }} />
    );
  }

  // CEO: Manage expenses logged by Secretary
  if (userRole === 'CEO') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Expenses</Text>

        {/* CEO: Shop filter */}
        <View style={{ flexDirection: 'row', marginBottom: 18 }}>
          <TouchableOpacity
            onPress={() => setSelectedShop('all')}
            style={{ backgroundColor: selectedShop === 'all' ? '#e94560' : '#f3f4f6', padding: 8, borderRadius: 8, marginRight: 8 }}
          >
            <Text style={{ color: selectedShop === 'all' ? '#fff' : '#222', fontWeight: 'bold' }}>All Shops</Text>
          </TouchableOpacity>
          {shops.map(shop => (
            <TouchableOpacity
              key={shop.id}
              onPress={() => setSelectedShop(shop.id)}
              style={{ backgroundColor: selectedShop === shop.id ? '#e94560' : '#f3f4f6', padding: 8, borderRadius: 8, marginRight: 8 }}
            >
              <Text style={{ color: selectedShop === shop.id ? '#fff' : '#222', fontWeight: 'bold' }}>{shop.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Expenses list */}
        <FlatList
          data={filteredExpenses}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, padding: 14, marginVertical: 8, borderWidth: 1, borderColor: item.status === 'Approved' ? '#43d9ad' : item.status === 'Rejected' ? '#e94560' : '#fbbf24' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1a2238' }}>{item.description}</Text>
              <Text style={{ fontSize: 15, color: '#222', marginVertical: 4 }}>₦{item.amount.toLocaleString()}</Text>
              <Text style={{ fontSize: 13, color: '#888' }}>Date: {item.date}</Text>
              <Text style={{ fontSize: 13, color: '#888' }}>Status: <Text style={{ color: item.status === 'Approved' ? '#43d9ad' : item.status === 'Rejected' ? '#e94560' : '#fbbf24', fontWeight: 'bold' }}>{item.status}</Text></Text>
              <Text style={{ fontSize: 13, color: '#888' }}>Entered by: {item.enteredBy}</Text>
              <Text style={{ fontSize: 13, color: '#888' }}>Shop: {shops.find(s => s.id === item.shop)?.name || 'Unknown'}</Text>
              {/* CEO: Approve/Reject/Pending buttons for all expenses */}
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <TouchableOpacity onPress={() => handleApprove && handleApprove(item.id)} style={{ backgroundColor: item.status === 'Approved' ? '#43d9ad' : '#f3f4f6', padding: 8, borderRadius: 8, marginRight: 8 }}>
                  <Text style={{ color: item.status === 'Approved' ? '#fff' : '#222', fontWeight: 'bold' }}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject && handleReject(item.id)} style={{ backgroundColor: item.status === 'Rejected' ? '#e94560' : '#f3f4f6', padding: 8, borderRadius: 8, marginRight: 8 }}>
                  <Text style={{ color: item.status === 'Rejected' ? '#fff' : '#222', fontWeight: 'bold' }}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePending && handlePending(item.id)} style={{ backgroundColor: item.status === 'Pending' ? '#fbbf24' : '#f3f4f6', padding: 8, borderRadius: 8 }}>
                  <Text style={{ color: item.status === 'Pending' ? '#fff' : '#222', fontWeight: 'bold' }}>Set Pending</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>No expenses found.</Text>}
        />
      </View>
    );
  }
}
