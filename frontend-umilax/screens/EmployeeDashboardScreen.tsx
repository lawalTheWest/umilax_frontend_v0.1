
import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

// Dummy employee personal details
const employeeDetails = {
  fullName: 'John Employee',
  yearsOfExperience: 3,
  specialty: 'Hair Styling',
  residentialAddress: '789 Employee St, City',
  phoneNumber: '+2348012345678',
  passport: 'https://randomuser.me/api/portraits/men/1.jpg', // Example image URL
  guarantor: {
    name: 'Mary Guarantor',
    relationship: 'Mother',
    residentialAddress: '321 Guarantor Ave, City',
    occupation: 'Teacher',
    employer: 'XYZ School',
    phoneNumber: '+2348098765432',
    email: 'mary.guarantor@email.com',
    identityNumber: 'GNT-654321',
  },
  performance: 'Good', // Can be: Poor, Worse, Average, Good, Excellent
};


export default function EmployeeDashboardScreen() {
  // Dummy: Replace with actual user data from backend
  const isDeactivated = employeeDetails.is_active === false;

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
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Employee Dashboard</Text>
      {/* Passport photo */}
      <Image
        source={{ uri: employeeDetails.passport }}
        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 16, borderWidth: 2, borderColor: '#e94560' }}
        resizeMode="cover"
      />
      <View style={{ backgroundColor: '#f3f4f6', borderRadius: 12, padding: 18, width: '100%', marginBottom: 18 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Personal Details</Text>
        <Text>Full Name: {employeeDetails.fullName}</Text>
        <Text>Years of Experience: {employeeDetails.yearsOfExperience}</Text>
        <Text>Specialty: {employeeDetails.specialty}</Text>
        <Text>Residential Address: {employeeDetails.residentialAddress}</Text>
        <Text>Phone Number: {employeeDetails.phoneNumber}</Text>
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Guarantor Details</Text>
        <Text>Name: {employeeDetails.guarantor.name}</Text>
        <Text>Relationship: {employeeDetails.guarantor.relationship}</Text>
        <Text>Residential Address: {employeeDetails.guarantor.residentialAddress}</Text>
        <Text>Occupation: {employeeDetails.guarantor.occupation}</Text>
        <Text>Employer: {employeeDetails.guarantor.employer}</Text>
        <Text>Phone Number: {employeeDetails.guarantor.phoneNumber}</Text>
        <Text>Email: {employeeDetails.guarantor.email}</Text>
        <Text>Identity Number: {employeeDetails.guarantor.identityNumber}</Text>
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Performance Level</Text>
        <Text>{employeeDetails.performance} Performance</Text>
      </View>
      {/* ...existing code... */}
    </ScrollView>
  );
}
