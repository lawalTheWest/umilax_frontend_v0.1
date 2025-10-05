import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

// Dummy secretary personal details
const secretaryDetails = {
  fullName: 'Jane Secretary',
  yearsOfExperience: 5,
  specialty: 'Salon Management',
  residentialAddress: '123 Main St, City',
  phoneNumber: '+2348012345678',
  passport: 'https://randomuser.me/api/portraits/women/1.jpg', // Example image URL
  guarantor: {
    name: 'John Guarantor',
    relationship: 'Uncle',
    residentialAddress: '456 Guarantor Ave, City',
    occupation: 'Accountant',
    employer: 'ABC Ltd',
    phoneNumber: '+2348098765432',
    email: 'john.guarantor@email.com',
    identityNumber: 'GNT-123456',
  },
  performance: 'Excellent', // Can be: Poor, Worse, Average, Good, Excellent
};

export default function SecretaryDashboardScreen() {
  // Dummy: Replace with actual user data from backend
  const isDeactivated = secretaryDetails.is_active === false;

  if (isDeactivated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#e94560', marginBottom: 16 }}>Account deactivated</Text>
        <Text style={{ fontSize: 16, color: '#1a2238', textAlign: 'center', maxWidth: 320 }}>
          You are no longer working with us. Contact the management.
        </Text>
      </View>
    );
  }

  // ...existing code...
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Secretary Dashboard</Text>
      {/* Passport photo */}
      <Image
        source={{ uri: secretaryDetails.passport }}
        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 16, borderWidth: 2, borderColor: '#e94560' }}
        resizeMode="cover"
      />
      <View style={{ backgroundColor: '#f3f4f6', borderRadius: 12, padding: 18, width: '100%', marginBottom: 18 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Personal Details</Text>
        <Text>Full Name: {secretaryDetails.fullName}</Text>
        <Text>Years of Experience: {secretaryDetails.yearsOfExperience}</Text>
        <Text>Specialty: {secretaryDetails.specialty}</Text>
        <Text>Residential Address: {secretaryDetails.residentialAddress}</Text>
        <Text>Phone Number: {secretaryDetails.phoneNumber}</Text>
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Guarantor Details</Text>
        <Text>Name: {secretaryDetails.guarantor.name}</Text>
        <Text>Relationship: {secretaryDetails.guarantor.relationship}</Text>
        <Text>Residential Address: {secretaryDetails.guarantor.residentialAddress}</Text>
        <Text>Occupation: {secretaryDetails.guarantor.occupation}</Text>
        <Text>Employer: {secretaryDetails.guarantor.employer}</Text>
        <Text>Phone Number: {secretaryDetails.guarantor.phoneNumber}</Text>
        <Text>Email: {secretaryDetails.guarantor.email}</Text>
        <Text>Identity Number: {secretaryDetails.guarantor.identityNumber}</Text>
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Performance Level</Text>
        <Text>{secretaryDetails.performance} Performance</Text>
      </View>
    </ScrollView>
  );
}
