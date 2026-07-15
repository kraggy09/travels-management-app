import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CashFlowScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Cash Flow</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Net Balance · July 2026</Text>
          <Text style={styles.balanceValue}>₹2,34,500</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>↑ Income</Text>
              <Text style={styles.balanceStatValue}>₹3,12,000</Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>↓ Expenses</Text>
              <Text style={styles.balanceStatValue}>₹77,500</Text>
            </View>
          </View>
        </View>

        {/* Mini Bar Chart */}
        <Text style={styles.sectionTitle}>Last 6 Months</Text>
        <View style={styles.chartRow}>
          {MONTHLY.map((m, i) => (
            <View key={i} style={styles.chartColumn}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${m.pct}%` as any }]} />
              </View>
              <Text style={styles.chartLabel}>{m.month}</Text>
            </View>
          ))}
        </View>

        {/* Transaction List */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Recent Transactions</Text>
        {TRANSACTIONS.map((t, i) => (
          <View key={i} style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: t.type === 'credit' ? '#F0FFF4' : '#FFF5F5' }]}>
              <Text style={styles.txIconText}>{t.type === 'credit' ? '↑' : '↓'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txLabel}>{t.label}</Text>
              <Text style={styles.txSub}>{t.sub}</Text>
            </View>
            <Text style={[styles.txAmount, { color: t.type === 'credit' ? '#22C55E' : '#EF4444' }]}>
              {t.type === 'credit' ? '+' : '-'}{t.amount}
            </Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MONTHLY = [
  { month: 'Feb', pct: 40 },
  { month: 'Mar', pct: 60 },
  { month: 'Apr', pct: 55 },
  { month: 'May', pct: 80 },
  { month: 'Jun', pct: 70 },
  { month: 'Jul', pct: 90 },
];

const TRANSACTIONS = [
  { label: 'Mumbai → Goa Trip', sub: 'Jul 20 · Bus', amount: '₹85,000', type: 'credit' },
  { label: 'Diesel Reimbursement', sub: 'Jul 19 · Driver: Ramesh', amount: '₹4,200', type: 'debit' },
  { label: 'Delhi → Manali Advance', sub: 'Jul 15 · Rahul S.', amount: '₹6,000', type: 'credit' },
  { label: 'Vehicle Service', sub: 'Jul 12 · KA05 AB 1234', amount: '₹3,800', type: 'debit' },
  { label: 'Pune → Shirdi Payment', sub: 'Jul 10 · Full payment', amount: '₹9,500', type: 'credit' },
] as const;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },

  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: { fontSize: 28, fontFamily: 'Sora-Bold', color: '#000000' },

  balanceCard: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
  },
  balanceLabel: { fontSize: 12, fontFamily: 'Sora-Regular', color: '#9E9E9E', marginBottom: 6 },
  balanceValue: { fontSize: 36, fontFamily: 'Sora-Bold', color: '#FFFFFF', marginBottom: 20 },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balanceStat: { flex: 1 },
  balanceStatLabel: { fontSize: 11, fontFamily: 'Sora-Regular', color: '#6B6B6B', marginBottom: 4 },
  balanceStatValue: { fontSize: 16, fontFamily: 'Sora-SemiBold', color: '#FFFFFF' },
  balanceDivider: { width: 1, height: 32, backgroundColor: '#2A2A2A', marginHorizontal: 16 },

  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Sora-SemiBold',
    color: '#9E9E9E',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  chartRow: { flexDirection: 'row', gap: 8, height: 100, alignItems: 'flex-end', marginBottom: 8 },
  chartColumn: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, width: '100%', backgroundColor: '#F6F6F6', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: '#000000', borderRadius: 6 },
  chartLabel: { fontSize: 10, fontFamily: 'Sora-Regular', color: '#9E9E9E' },

  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F6F6',
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txIconText: { fontSize: 16, fontFamily: 'Sora-Bold', color: '#000000' },
  txLabel: { fontSize: 14, fontFamily: 'Sora-Medium', color: '#000000', marginBottom: 2 },
  txSub: { fontSize: 12, fontFamily: 'Sora-Regular', color: '#6B6B6B' },
  txAmount: { fontSize: 14, fontFamily: 'Sora-SemiBold' },
});
