import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { BASE_API_URL } from '../utils/api';
import { saveTokens } from '../utils/authStorage';

/**
 * CEOLoginScreen
 * Renders the CEO login form with email and password fields, handles authentication, and provides a stub for Google SSO (post-launch).
 * Navigates to the CEO dashboard on successful login.
 */
export default function CEOLoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Send both email and username (email-first). Some backends expect 'email' as the identifier.
      const bodyPayload = { email, username: email, password };
      const res = await fetch(`${BASE_API_URL}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Login failed');
      }
      const data = await res.json();
      // Expected: { access: '...', refresh: '...' }
  await saveTokens(data.access, data.refresh);
      navigation.replace('Dashboard', { role: 'CEO' });
    } catch (e) {
      Alert.alert('Login Failed', String(e));
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-4">CEO Login</Text>
      <TextInput
        className="border rounded px-4 py-2 mb-2 w-64"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="border rounded px-4 py-2 mb-4 w-64"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
        <View className="mt-4 w-64">
          <Button
            title="Google SSO (Post-Launch)"
            onPress={() => {}}
            disabled
            color="#4285F4"
          />
        </View>
    </View>
  );
}
