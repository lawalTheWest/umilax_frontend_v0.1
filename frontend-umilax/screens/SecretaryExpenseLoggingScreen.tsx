import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Expense = {
  id: number;
  description: string;
  amount: number;
  status: string;
  receipt: string | null;
};

const dummyExpenses: Expense[] = [
  { id: 1, description: 'Dye purchase', amount: 1500, status: 'pending', receipt: null },
  { id: 2, description: 'Snacks', amount: 500, status: 'pending', receipt: null },
];

export default function SecretaryExpenseLoggingScreen() {
  const [expenses, setExpenses] = useState<Expense[]>(dummyExpenses);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);

  const handleAddExpense = () => {
    if (!description || !amount) return;
    setExpenses(prev => [
      ...prev,
      {
        id: prev.length + 1,
        description,
        amount: parseFloat(amount),
        status: 'pending',
        receipt,
      },
    ]);
    setDescription('');
    setAmount('');
    setReceipt(null);
  };

  // Dummy receipt upload (just sets a placeholder image)
  const handleUploadReceipt = () => {
    setReceipt('https://via.placeholder.com/100x100.png?text=Receipt');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1a2238' }}>
        <MaterialCommunityIcons name="file-document-edit" size={24} color="#e94560" /> Expense Logging
      </Text>
  <View style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: '#e94560', padding: 18, width: 300, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}>
        <Text style={{ fontSize: 16, color: '#1a2238', marginBottom: 8 }}>
          <MaterialCommunityIcons name="text" size={18} color="#1a2238" /> Description
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Expense description"
          style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 10, padding: 10, marginBottom: 12, backgroundColor: '#f3f4f6', fontSize: 15 }}
        />
        <Text style={{ fontSize: 16, color: '#1a2238', marginBottom: 8 }}>
          <MaterialCommunityIcons name="currency-ngn" size={18} color="#1a2238" /> Amount
        </Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Amount"
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 10, padding: 10, marginBottom: 12, backgroundColor: '#f3f4f6', fontSize: 15 }}
        />
        <TouchableOpacity onPress={handleUploadReceipt} style={{ backgroundColor: '#e94560', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
            <MaterialCommunityIcons name="file-upload" size={18} color="#fff" /> Upload Receipt
          </Text>
        </TouchableOpacity>
        {receipt && (
          <Image source={{ uri: receipt }} style={{ width: 100, height: 100, marginBottom: 12, borderRadius: 10, borderWidth: 2, borderColor: '#e94560' }} />
        )}
        <TouchableOpacity onPress={handleAddExpense} style={{ backgroundColor: '#1a2238', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
            <MaterialCommunityIcons name="plus-circle" size={18} color="#fff" /> Add Expense
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a2238', marginBottom: 8 }}>
        <MaterialCommunityIcons name="clock-outline" size={18} color="#e94560" /> Pending Expenses
      </Text>
      {expenses.map(exp => (
        <View key={exp.id} style={{ backgroundColor: '#f3f4f6', borderRadius: 12, padding: 12, marginBottom: 10, width: 300, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}>
          <Text style={{ color: '#1a2238', fontWeight: 'bold', fontSize: 16 }}>
            <MaterialCommunityIcons name="file-document" size={16} color="#e94560" /> {exp.description}
          </Text>
          <Text style={{ color: '#1a2238', fontSize: 15 }}>
            <MaterialCommunityIcons name="currency-ngn" size={15} color="#1a2238" /> ₦{exp.amount} | Status: {exp.status}
          </Text>
          {exp.receipt && <Image source={{ uri: exp.receipt }} style={{ width: 60, height: 60, borderRadius: 8, marginTop: 6, borderWidth: 2, borderColor: '#e94560' }} />}
        </View>
      ))}
    </ScrollView>
  );
}
