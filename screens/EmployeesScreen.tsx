import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function EmployeesScreen() {
  // Each employee: { name: string, divisionBase: string }
  const [employees, setEmployees] = useState<{ name: string; divisionBase: string }[]>([
    { name: 'John Doe', divisionBase: '3' },
    { name: 'Jane Smith', divisionBase: '3' },
  ]);
  const [newEmployee, setNewEmployee] = useState('');
  const [divisionBase, setDivisionBase] = useState('3');

  const addEmployee = () => {
    if (newEmployee.trim() && divisionBase.trim() && !isNaN(Number(divisionBase)) && Number(divisionBase) > 0) {
      setEmployees([...employees, { name: newEmployee.trim(), divisionBase: divisionBase.trim() }]);
      setNewEmployee('');
      setDivisionBase('3');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Employees Management</Text>
      <FlatList
        data={employees}
        keyExtractor={item => item.name + item.divisionBase}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, padding: 12, marginVertical: 6, width: 260, alignItems: 'center', borderWidth: 1, borderColor: '#e94560' }}>
            <Text style={{ fontSize: 16, color: '#1a2238' }}>{item.name}</Text>
            <Text style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Division Base: {item.divisionBase}</Text>
          </View>
        )}
        style={{ marginBottom: 16, width: '100%' }}
      />
      <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 12, width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, width: 180, fontSize: 16, marginRight: 8 }}
            value={newEmployee}
            onChangeText={setNewEmployee}
            placeholder="New employee name"
          />
          <TouchableOpacity onPress={addEmployee} style={{ backgroundColor: '#e94560', padding: 10, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Employee</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 15, color: '#1a2238', marginRight: 8 }}>Division Base:</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 8, padding: 8, width: 80, fontSize: 16 }}
            value={divisionBase}
            onChangeText={setDivisionBase}
            placeholder="e.g. 3"
            keyboardType="numeric"
          />
        </View>
        <Text style={{ fontSize: 13, color: '#888', marginTop: 2, marginBottom: 4, alignSelf: 'flex-start' }}>
          Set how revenue is split for this employee (e.g., 2 or 3).
        </Text>
      </View>
    </View>
  );
}
