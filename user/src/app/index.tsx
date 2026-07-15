import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.title}>Dashboard</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>TM</Text>
          </View>
        </View>

        {/* KPI Row */}
        <View style={styles.kpiRow}>
          <KpiCard label="Active Trips" value="12" />
          <KpiCard label="Open Leads" value="34" />
          <KpiCard label="Revenue" value="₹1.2L" dark />
        </View>

        {/* Section: Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>

        {ACTIVITY.map((item, i) => (
          <View key={i} style={styles.activityCard}>
            <View style={[styles.activityDot, { backgroundColor: item.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityLabel}>{item.label}</Text>
              <Text style={styles.activitySub}>{item.sub}</Text>
            </View>
            <Text style={styles.activityTime}>{item.time}</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, dark }: { label: string; value: string; dark?: boolean }) {
  return (
    <View style={[styles.kpiCard, dark && styles.kpiCardDark]}>
      <Text style={[styles.kpiValue, dark && styles.kpiValueDark]}>{value}</Text>
      <Text style={[styles.kpiLabel, dark && styles.kpiLabelDark]}>{label}</Text>
    </View>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ACTIVITY = [
  { label: 'New lead from Rahul S.', sub: 'Delhi → Manali · 6-seater', time: '2m ago', color: '#000' },
  { label: 'Trip confirmed', sub: 'Mumbai → Goa · Bus', time: '1h ago', color: '#22C55E' },
  { label: 'Payment received', sub: '₹18,500 via UPI', time: '3h ago', color: '#3B82F6' },
  { label: 'Lead cancelled', sub: 'Pune → Shirdi', time: 'Yesterday', color: '#EF4444' },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
  },
  greeting: { fontSize: 13, color: '#6B6B6B', fontFamily: 'Sora-Regular', marginBottom: 2 },
  title: { fontSize: 28, fontFamily: 'Sora-Bold', color: '#000000' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#FFFFFF', fontFamily: 'Sora-SemiBold', fontSize: 13 },

  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  kpiCard: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    padding: 16,
  },
  kpiCardDark: { backgroundColor: '#000000' },
  kpiValue: { fontSize: 22, fontFamily: 'Sora-Bold', color: '#000000', marginBottom: 4 },
  kpiValueDark: { color: '#FFFFFF' },
  kpiLabel: { fontSize: 11, fontFamily: 'Sora-Regular', color: '#6B6B6B' },
  kpiLabelDark: { color: '#9E9E9E' },

  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Sora-SemiBold',
    color: '#000000',
    marginBottom: 16,
  },

  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityDot: { width: 10, height: 10, borderRadius: 5 },
  activityLabel: { fontSize: 14, fontFamily: 'Sora-Medium', color: '#000000', marginBottom: 2 },
  activitySub: { fontSize: 12, fontFamily: 'Sora-Regular', color: '#6B6B6B' },
  activityTime: { fontSize: 11, fontFamily: 'Sora-Regular', color: '#9E9E9E' },
});
