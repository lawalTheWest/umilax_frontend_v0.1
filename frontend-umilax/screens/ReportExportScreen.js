import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';

import { BASE_API_URL } from '../utils/api';
const BACKEND_URL = BASE_API_URL; // Uses deployed backend by default

export default function ReportExportScreen() {
  const [reportId, setReportId] = useState('');
  const [loading, setLoading] = useState(false);

  // Download PDF
  const downloadPDF = async () => {
    if (!reportId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/reports/${reportId}/export_pdf/`);
      if (res.ok) {
        // For demo: just alert success. In real app, handle file download.
        Alert.alert('Success', 'PDF downloaded (see backend response)');
      } else {
        Alert.alert('Error', 'Failed to download PDF');
      }
    } catch (_err) {
      Alert.alert('Error', 'Failed to download PDF');
    }
    setLoading(false);
  };

  // Download CSV
  const downloadCSV = async () => {
    if (!reportId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/reports/${reportId}/export_csv/`);
      if (res.ok) {
        Alert.alert('Success', 'CSV downloaded (see backend response)');
      } else {
        Alert.alert('Error', 'Failed to download CSV');
      }
    } catch (_err) {
      Alert.alert('Error', 'Failed to download CSV');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Export Reports</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginVertical: 12 }}
        placeholder="Enter Report ID"
        value={reportId}
        onChangeText={setReportId}
      />
      <Button title="Download PDF" onPress={downloadPDF} disabled={loading} />
      <Button title="Download CSV" onPress={downloadCSV} disabled={loading} />
      <Text style={{ marginTop: 16 }}>
        Enter a report ID to export reports in PDF or CSV format.
      </Text>
    </View>
  );
}
