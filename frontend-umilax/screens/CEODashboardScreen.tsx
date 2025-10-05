import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableWithoutFeedback, Animated, TouchableOpacity } from 'react-native';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Text as SVGText } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { BASE_API_URL } from '../utils/api';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const defaultMetrics = {
  total_earnings: 0,
  total_expenses: 0,
  transaction_count: 0,
  shop_count: 0,
  employee_count: 0,
  secretary_count: 0,
  recent_transactions: [],
  recent_expenses: [],
  ceo_share: 0,
  shop_share: 0,
  employee_shares: [],
};

const menu = [
  { title: 'Reports', icon: <FontAwesome5 name="file-alt" size={24} color="#1a2238" />, screen: 'ReportExport' },
  { title: 'Complaints', icon: <MaterialIcons name="report-problem" size={24} color="#1a2238" />, screen: 'Complaints' },
  { title: 'Transactions', icon: <FontAwesome5 name="exchange-alt" size={24} color="#1a2238" />, screen: 'TransactionsScreen' },
  { title: 'Expenses', icon: <MaterialIcons name="attach-money" size={24} color="#1a2238" />, screen: 'ExpensesScreen' },
  { title: 'Shops', icon: <FontAwesome5 name="store" size={24} color="#1a2238" />, screen: 'ShopsScreen' },
  { title: 'Employees', icon: <MaterialIcons name="people" size={24} color="#1a2238" />, screen: 'EmployeesScreen' },
  { title: 'Secretaries', icon: <Ionicons name="person" size={24} color="#1a2238" />, screen: 'SecretariesScreen' },
  { title: 'Division Settings', icon: <MaterialIcons name="settings" size={24} color="#1a2238" />, screen: 'DivisionSettingsScreen' },
  { title: 'Earnings', icon: <FontAwesome5 name="money-bill-wave" size={24} color="#1a2238" />, screen: 'EarningsScreen' },
  { title: 'Export PDF', icon: <FontAwesome5 name="file-pdf" size={24} color="#1a2238" />, screen: 'ReportExport' },
  { title: 'Export CSV', icon: <FontAwesome5 name="file-csv" size={24} color="#1a2238" />, screen: 'ReportExport' },
];

function AnimatedCard({ onPress, children }: { onPress: () => void; children: React.ReactNode }) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.88, friction: 4, tension: 80, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }).start();
  };
  return (
    <TouchableWithoutFeedback onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, styles.cardNavyBorder, { transform: [{ scale }] }]}> 
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

/**
 * CEODashboardScreen
 * Displays CEO dashboard metrics including revenue, expenses, shares, and recent activity.
 * Fetches data from the backend and handles loading and error states.
 */
export default function CEODashboardScreen() {
  const navigation = useNavigation();
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const BASE_URL = BASE_API_URL.replace(/\/$/, '');

  useEffect(() => {
    // backend registers the CEO dashboard under /shops/ceo-dashboard/
    fetch(`${BASE_API_URL.replace(/\/$/, '')}/shops/ceo-dashboard/metrics/`)
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load dashboard metrics');
        setLoading(false);
      });
  }, []);

  const chartLabels = ['CEO', 'Shop', ...(metrics.employee_shares ? metrics.employee_shares.map((e: any) => e.name) : [])];
  const chartValues = [metrics.ceo_share, metrics.shop_share, ...(metrics.employee_shares ? metrics.employee_shares.map((e: any) => e.amount) : [])];

  if (loading) return <View style={styles.container}><Text style={styles.menuTitle}>Loading dashboard...</Text></View>;
  if (error) return <View style={styles.container}><Text style={styles.menuTitle}>{error}</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
      <View style={styles.header}>
        <View style={styles.avatarIcon}><FontAwesome5 name="user-circle" size={72} color="#1a2238" /></View>
        <Text style={styles.welcome}>Welcome, CEO</Text>
      </View>
      <View style={styles.cardRow}>
        <AnimatedCard onPress={() => (navigation as any).navigate('ReportExport')}>
          <Text style={styles.cardTitle}>Revenue</Text>
          <Text style={styles.cardValue}>${metrics.total_earnings?.toLocaleString()}</Text>
        </AnimatedCard>
        <AnimatedCard onPress={() => (navigation as any).navigate('ExpensesScreen')}>
          <Text style={styles.cardTitle}>Expenses</Text>
          <Text style={styles.cardValue}>${metrics.total_expenses?.toLocaleString()}</Text>
        </AnimatedCard>
      </View>
      <View style={styles.cardRow}>
        <AnimatedCard onPress={() => (navigation as any).navigate('TransactionsScreen')}>
          <Text style={styles.cardTitle}>Transactions</Text>
          <Text style={styles.cardValue}>{metrics.transaction_count}</Text>
        </AnimatedCard>
        <AnimatedCard onPress={() => (navigation as any).navigate('ShopsScreen')}>
          <Text style={styles.cardTitle}>Shops</Text>
          <Text style={styles.cardValue}>{metrics.shop_count}</Text>
        </AnimatedCard>
      </View>
      <View style={styles.cardRow}>
        <AnimatedCard onPress={() => (navigation as any).navigate('EmployeesScreen')}>
          <Text style={styles.cardTitle}>Employees</Text>
          <Text style={styles.cardValue}>{metrics.employee_count}</Text>
        </AnimatedCard>
        <AnimatedCard onPress={() => (navigation as any).navigate('SecretariesScreen')}>
          <Text style={styles.cardTitle}>Secretaries</Text>
          <Text style={styles.cardValue}>{metrics.secretary_count}</Text>
        </AnimatedCard>
      </View>
      <View style={styles.breakdownSection}>
        <Text style={styles.breakdownTitle}>Shares Breakdown</Text>
        <View style={{ height: 220, flexDirection: 'row', marginBottom: 12 }}>
          <YAxis
            data={chartValues}
            contentInset={{ top: 20, bottom: 20 }}
            svg={{ fontSize: 10, fill: '#1a2238' }}
            numberOfTicks={5}
            formatLabel={(value: number) => `$${value}`}
            style={{ marginRight: 8 }}
          />
          <BarChart
            style={{ flex: 1 }}
            data={chartValues}
            svg={{ fill: '#e94560' }}
            contentInset={{ top: 20, bottom: 20 }}
            spacingInner={0.3}
          >
            <Grid direction={Grid.Direction.HORIZONTAL} />
          </BarChart>
        </View>
        <XAxis
          style={{ marginHorizontal: -10, height: 20 }}
          data={chartValues}
          formatLabel={(_value: number, index: number) => chartLabels[index]}
          contentInset={{ left: 30, right: 10 }}
          svg={{ fontSize: 10, fill: '#1a2238', rotation: 30, originY: 10, y: 5 }}
        />
        <View style={styles.breakdownRow}>
          <View style={[styles.breakdownCard, styles.breakdownCardNavy]}>
            <Text style={styles.breakdownTextWhite}>CEO Share</Text>
            <Text style={styles.breakdownValueWhite}>${metrics.ceo_share?.toLocaleString()}</Text>
          </View>
          <View style={[styles.breakdownCard, styles.breakdownCardNavy]}>
            <Text style={styles.breakdownTextWhite}>Shop Share</Text>
            <Text style={styles.breakdownValueWhite}>${metrics.shop_share?.toLocaleString()}</Text>
          </View>
        </View>
        <Text style={styles.breakdownText}>Employee Shares:</Text>
        <View style={styles.breakdownRow}>
          {metrics.employee_shares?.map((share: any, idx: number) => (
            <View key={idx} style={[styles.breakdownCard, styles.breakdownCardNavy]}>
              <Text style={styles.breakdownTextWhite}>{share.name}</Text>
              <Text style={styles.breakdownValueWhite}>${share.amount?.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.menuTitle}>CEO Menu</Text>
      <View style={styles.menuGrid}>
        {menu.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.menuBtn} onPress={() => (navigation as any).navigate(item.screen)}>
            {item.icon}
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fa' },
  header: { alignItems: 'center', marginTop: 32, marginBottom: 16 },
  avatarIcon: { marginBottom: 8 },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#1a2238' },
  cardRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 8, alignItems: 'center', width: 140, elevation: 2 },
  cardNavyBorder: { borderWidth: 2, borderColor: '#1a2238' },
  cardTitle: { fontSize: 16, color: '#8d5524', marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: 'bold', color: '#1a2238' },
    breakdownSection: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginVertical: 12, width: '95%', elevation: 2 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8, flexWrap: 'wrap' },
    breakdownCard: { borderRadius: 12, padding: 16, margin: 8, alignItems: 'center', minWidth: 120, elevation: 2 },
    breakdownCardNavy: { backgroundColor: '#1a2238', borderWidth: 2, borderColor: '#1a2238' },
  breakdownTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a2238', marginBottom: 6, textAlign: 'center' },
    breakdownText: { fontSize: 15, color: '#333', marginBottom: 2, textAlign: 'center' },
    breakdownTextWhite: { fontSize: 15, color: '#fff', marginBottom: 2, textAlign: 'center' },
    breakdownValue: { fontSize: 17, fontWeight: 'bold', color: '#1a2238', marginBottom: 2, textAlign: 'center' },
    breakdownValueWhite: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginBottom: 2, textAlign: 'center' },
  menuTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a2238', marginTop: 18, marginBottom: 8 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  menuBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 14, margin: 8, alignItems: 'center', width: 120, elevation: 2, borderWidth: 2, borderColor: '#1a2238' },
  menuText: { fontSize: 14, color: '#1a2238', marginTop: 6, fontWeight: 'bold', textAlign: 'center' },
});
