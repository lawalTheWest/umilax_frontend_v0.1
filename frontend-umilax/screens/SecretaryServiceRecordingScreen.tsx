import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Dummy data for services
const services = [
  { id: 1, name: 'Haircut', base_price: 2000, priority: 1 },
  { id: 2, name: 'Dye', base_price: 3500, priority: 2 },
  { id: 3, name: 'Manicure', base_price: 1500, priority: 1 },
  { id: 4, name: 'Pedicure', base_price: 1800, priority: 1 },
];

type Service = { id: number; name: string; base_price: number; priority: number };
function calculateTotal(selected: number[], allServices: Service[]): number {
  // Example: sum base_price * priority for selected services
  return selected.reduce((sum: number, id: number) => {
    const svc = allServices.find((s: Service) => s.id === id);
    return sum + (svc ? svc.base_price * svc.priority : 0);
  }, 0);
}

export default function SecretaryServiceRecordingScreen() {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [manualPrice, setManualPrice] = useState<string>('');
  const totalPrice = calculateTotal(selectedServices, services);
  const displayPrice = manualPrice !== '' ? Number(manualPrice) : totalPrice;

  // Dummy employees for demo
  const employees = [
    { id: 1, name: 'John Doe', shop: 'Shop A' },
    { id: 2, name: 'Jane Smith', shop: 'Shop B' },
    { id: 3, name: 'Mary Johnson', shop: 'Shop C' },
  ];
  // For Secretary, assume assignedShop is Shop A
  const assignedShop = 'Shop A';
  // Employee selection
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  // Common payment types
  const paymentTypes = ['Cash', 'Card', 'Transfer', 'POS', 'Wallet'];
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleService = (id: number) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return (
  <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1a2238' }}>
        <MaterialCommunityIcons name="clipboard-list" size={24} color="#e94560" /> Service Recording
      </Text>
      <View style={{ marginBottom: 16, width: 280 }}>
        <Text style={{ fontSize: 16, color: '#1a2238', marginBottom: 6 }}>Shop:</Text>
        <View style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 10, backgroundColor: '#f3f4f6', padding: 8 }}>
          <Text style={{ color: '#1a2238', fontWeight: 'bold' }}>{assignedShop}</Text>
        </View>
      </View>
  {/* Employee selection dropdown for assigned shop only */}
      {/* Payment type dropdown - always visible */}
      <View style={{ marginBottom: 16, width: 280 }}>
        <Text style={{ fontSize: 16, color: '#1a2238', marginBottom: 6 }}>Select Payment Type:</Text>
        <View style={{ borderWidth: 2, borderColor: '#e94560', borderRadius: 12, backgroundColor: '#fff', padding: 8, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {paymentTypes.map(pt => (
            <TouchableOpacity
              key={pt}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 18,
                backgroundColor: selectedPaymentType === pt ? '#e94560' : '#f3f4f6',
                borderRadius: 8,
                marginBottom: 8,
                marginRight: 8,
                borderWidth: selectedPaymentType === pt ? 2 : 0,
                borderColor: selectedPaymentType === pt ? '#e94560' : 'transparent',
              }}
              onPress={() => setSelectedPaymentType(pt)}
            >
              <Text style={{ color: selectedPaymentType === pt ? '#fff' : '#1a2238', fontWeight: selectedPaymentType === pt ? 'bold' : 'normal', fontSize: 15 }}>{pt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ marginBottom: 16, width: 280 }}>
        <Text style={{ fontSize: 16, color: '#1a2238', marginBottom: 6 }}>Select Employee:</Text>
        <View style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 10, backgroundColor: '#f3f4f6', padding: 8 }}>
          {employees
            .filter(emp => emp.shop === assignedShop)
            .map(emp => (
              <TouchableOpacity
                key={emp.id}
                style={{ padding: 8, backgroundColor: selectedEmployee === emp.id ? '#e94560' : 'transparent', borderRadius: 8, marginBottom: 4 }}
                onPress={() => setSelectedEmployee(emp.id)}
              >
                <Text style={{ color: selectedEmployee === emp.id ? '#fff' : '#1a2238', fontWeight: selectedEmployee === emp.id ? 'bold' : 'normal' }}>{emp.name}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Select services performed:</Text>
      {services.map(service => (
        <TouchableOpacity
          key={service.id}
          style={{
            backgroundColor: selectedServices.includes(service.id) ? '#e94560' : '#f3f4f6',
            borderColor: '#1a2238',
            borderWidth: 2,
            borderRadius: 16,
            padding: 16,
            marginVertical: 8,
            width: 280,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
          onPress={() => toggleService(service.id)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name={selectedServices.includes(service.id) ? 'checkbox-marked' : 'checkbox-blank-outline'} size={22} color={selectedServices.includes(service.id) ? '#fff' : '#1a2238'} style={{ marginRight: 10 }} />
            <Text style={{ color: selectedServices.includes(service.id) ? '#fff' : '#1a2238', fontWeight: 'bold', fontSize: 16 }}>{service.name}</Text>
          </View>
          <Text style={{ color: selectedServices.includes(service.id) ? '#fff' : '#1a2238', fontSize: 14 }}>
            ₦{service.base_price} | P: {service.priority}
          </Text>
        </TouchableOpacity>
      ))}
      <View style={{ marginTop: 24, padding: 18, backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: '#e94560', width: 280, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#e94560', marginBottom: 4 }}>
          <MaterialCommunityIcons name="cash-multiple" size={20} color="#e94560" /> Total Price
        </Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1a2238' }}>₦{displayPrice}</Text>
        <View style={{ marginTop: 12, width: '100%' }}>
          <Text style={{ fontSize: 14, color: '#1a2238', marginBottom: 4 }}>Manual Price Input (optional):</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#1a2238', marginRight: 4 }}>₦</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, width: 120, fontSize: 16, color: '#1a2238', backgroundColor: '#f3f4f6' }}
              keyboardType="numeric"
              value={manualPrice}
              onChangeText={setManualPrice}
              placeholder="Enter price"
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{ marginTop: 24, backgroundColor: '#e94560', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16, alignItems: 'center', width: 220, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}
        onPress={() => setShowConfirm(true)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#fff" /> Submit Transaction
        </Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      {showConfirm && (
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
              borderRadius: 16,
              padding: 28,
              width: '85%',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12, color: '#e94560', textAlign: 'center' }}>Confirm Transaction</Text>
            <Text style={{ color: '#374151', fontSize: 16, marginBottom: 4 }}>Shop: <Text style={{ fontWeight: 'bold' }}>{assignedShop || '-'}</Text></Text>
            <Text style={{ color: '#374151', fontSize: 16, marginBottom: 4 }}>Employee: <Text style={{ fontWeight: 'bold' }}>{employees.find(e => e.id === selectedEmployee)?.name || '-'}</Text></Text>
            <Text style={{ color: '#374151', fontSize: 16, marginBottom: 4 }}>Services: <Text style={{ fontWeight: 'bold' }}>{selectedServices.map(id => services.find(s => s.id === id)?.name).filter(Boolean).join(', ') || '-'}</Text></Text>
            <Text style={{ color: '#374151', fontSize: 16, marginBottom: 4 }}>Payment Type: <Text style={{ fontWeight: 'bold' }}>{selectedPaymentType || '-'}</Text></Text>
            <Text style={{ color: '#374151', fontSize: 16, marginBottom: 4 }}>Price: <Text style={{ fontWeight: 'bold' }}>₦{displayPrice}</Text></Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#e94560', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginRight: 12, flex: 1 }}
                onPress={() => {
                  setIsSubmitting(true);
                  setTimeout(() => {
                    setIsSubmitting(false);
                    setShowConfirm(false);
                    alert('Transaction submitted!');
                  }, 800);
                }}
                disabled={isSubmitting}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{isSubmitting ? 'Submitting...' : 'Proceed to Submit'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#f3f4f6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginLeft: 12, flex: 1 }}
                onPress={() => setShowConfirm(false)}
                disabled={isSubmitting}
              >
                <Text style={{ color: '#e94560', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Edit Selection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
