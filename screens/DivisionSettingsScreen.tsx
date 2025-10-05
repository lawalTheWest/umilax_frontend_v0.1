import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_API_URL } from '../utils/api';
const BASE_URL = BASE_API_URL.replace(/\/$/, '');

export default function DivisionSettingsScreen() {
  const [description, setDescription] = useState('');
  const [divisionBase, setDivisionBase] = useState('');
  const [deductBeforeDivision, setDeductBeforeDivision] = useState(true);
  const [graceWindow, setGraceWindow] = useState('');
  const [roundingRule, setRoundingRule] = useState('up');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Removed unused fetch for shops
    setLoading(false);
  }, []);

  // handleUpdate is not used in this screen, can be removed if not needed

  // Add handleSave for the Save button
  const handleSave = () => {
    // TODO: Replace with actual save logic/API call
    setSuccess(false);
    setError('');
    setLoading(true);
    // division-settings is registered under the shops router on the backend
    fetch(`${BASE_URL}/shops/division-settings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, division_base: divisionBase, deduct_before_division: deductBeforeDivision, grace_window: graceWindow, rounding_rule: roundingRule }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save settings');
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to save division settings');
        setLoading(false);
      });
  };


  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e94560" />;
  }
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#e94560', fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
      <View style={{ width: '100%' }}>
        <Text style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>
          Unique code or identifier for backend reference and quick selection.
        </Text>
        {/* Description */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialCommunityIcons name="text-box-outline" size={18} color="#1a2238" />
          <Text style={{ fontSize: 16, color: '#1a2238', marginLeft: 6 }}>Description</Text>
          <MaterialCommunityIcons name="help-circle-outline" size={16} color="#43d9ad" style={{ marginLeft: 6 }} />
        </View>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe this division"
          multiline
          style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 10, padding: 10, marginBottom: 14, backgroundColor: '#f3f4f6', fontSize: 15, minHeight: 60, width: '100%' }}
        />
        <Text style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>
          Add notes or details about this division logic (e.g., &quot;Standard split for Shop A, includes dye deduction&quot;).
        </Text>
        {/* Division Base */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialCommunityIcons name="calculator" size={18} color="#1a2238" />
          <Text style={{ fontSize: 16, color: '#1a2238', marginLeft: 6 }}>Division Base</Text>
          <MaterialCommunityIcons name="help-circle-outline" size={16} color="#43d9ad" style={{ marginLeft: 6 }} />
        </View>
        <TextInput
          value={divisionBase}
          onChangeText={setDivisionBase}
          placeholder="e.g. 3"
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 10, padding: 10, marginBottom: 14, backgroundColor: '#f3f4f6', fontSize: 15, width: '100%' }}
        />
        <Text style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>
          Controls how revenue is split (e.g., 1 share to employee pool, 1 to shop, 1 to CEO).
        </Text>
        {/* Expense Deduction Timing */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialCommunityIcons name="cash-remove" size={18} color="#1a2238" />
          <Text style={{ fontSize: 16, color: '#1a2238', marginLeft: 6 }}>Expense Deduction Timing</Text>
          <MaterialCommunityIcons name="help-circle-outline" size={16} color="#43d9ad" style={{ marginLeft: 6 }} />
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: 14 }}>
          <TouchableOpacity onPress={() => setDeductBeforeDivision(true)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MaterialCommunityIcons name={deductBeforeDivision ? 'radiobox-marked' : 'radiobox-blank'} size={18} color="#e94560" />
            <Text style={{ marginLeft: 6, color: '#1a2238' }}>Deduct Before Division</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDeductBeforeDivision(false)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name={!deductBeforeDivision ? 'radiobox-marked' : 'radiobox-blank'} size={18} color="#e94560" />
            <Text style={{ marginLeft: 6, color: '#1a2238' }}>Deduct After Division</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>
          Choose when expenses are deducted: before splitting revenue or only from shop&apos;s share after division.
        </Text>
        {/* Grace Window */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialCommunityIcons name="timer-sand" size={18} color="#1a2238" />
          <Text style={{ fontSize: 16, color: '#1a2238', marginLeft: 6 }}>Grace Window (minutes)</Text>
          <MaterialCommunityIcons name="help-circle-outline" size={16} color="#43d9ad" style={{ marginLeft: 6 }} />
        </View>
        <TextInput
          value={graceWindow}
          onChangeText={setGraceWindow}
          placeholder="e.g. 60"
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#e94560', borderRadius: 10, padding: 10, marginBottom: 14, backgroundColor: '#f3f4f6', fontSize: 15, width: '100%' }}
        />
        <Text style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>
          Time window (in minutes) for editing or deleting records after creation (CEO only).
        </Text>
        {/* Rounding Rule */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialCommunityIcons name="calculator-variant" size={18} color="#1a2238" />
          <Text style={{ fontSize: 16, color: '#1a2238', marginLeft: 6 }}>Rounding Rule</Text>
          <MaterialCommunityIcons name="help-circle-outline" size={16} color="#43d9ad" style={{ marginLeft: 6 }} />
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: 14 }}>
          <TouchableOpacity onPress={() => setRoundingRule('up')} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MaterialCommunityIcons name={roundingRule === 'up' ? 'radiobox-marked' : 'radiobox-blank'} size={18} color="#e94560" />
            <Text style={{ marginLeft: 6, color: '#1a2238' }}>Round Up (Employee)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRoundingRule('down')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name={roundingRule === 'down' ? 'radiobox-marked' : 'radiobox-blank'} size={18} color="#e94560" />
            <Text style={{ marginLeft: 6, color: '#1a2238' }}>Round Down (Shop)</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>
          Select how to handle fractional naira: round up for employees or down for shop.
        </Text>
        {/* Audit Log Link */}
        <TouchableOpacity style={{ backgroundColor: '#43d9ad', borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            <MaterialCommunityIcons name="file-document-outline" size={16} color="#fff" /> View Audit Log
          </Text>
        </TouchableOpacity>
        {/* Save Button & Feedback */}
        <TouchableOpacity onPress={handleSave} style={{ backgroundColor: '#e94560', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            <MaterialCommunityIcons name="content-save" size={18} color="#fff" /> Save Settings
          </Text>
        </TouchableOpacity>
        {error ? (
          <View style={{ backgroundColor: '#e94560', padding: 10, borderRadius: 8, marginTop: 14 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{error}</Text>
          </View>
        ) : null}
        {success && (
          <View style={{ backgroundColor: '#43d9ad', padding: 10, borderRadius: 8, marginTop: 14 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Settings saved!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
