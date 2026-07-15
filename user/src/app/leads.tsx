import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATUSES = ['All', 'New', 'Following Up', 'Closed'] as const;
type Status = (typeof STATUSES)[number];

import { useState } from 'react';

export default function LeadsScreen() {
  const [activeFilter, setActiveFilter] = useState<Status>('All');

  const filtered = activeFilter === 'All'
    ? LEADS
    : LEADS.filter((l) => l.status === activeFilter);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setActiveFilter(s)}
            style={[styles.chip, activeFilter === s && styles.chipActive]}>
            <Text style={[styles.chipText, activeFilter === s && styles.chipTextActive]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lead Cards */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map((lead, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.initials}>
                <Text style={styles.initialsText}>{lead.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{lead.name}</Text>
                <Text style={styles.route}>{lead.route}</Text>
              </View>
              <StatusBadge status={lead.status} />
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.meta}>{lead.vehicle} · {lead.pax} pax</Text>
              <Text style={styles.meta}>{lead.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; color: string }> = {
    All: { bg: '#F6F6F6', color: '#000' },
    New: { bg: '#000000', color: '#FFFFFF' },
    'Following Up': { bg: '#FFF3CD', color: '#7A5B00' },
    Closed: { bg: '#E8F5E9', color: '#2E7D32' },
  };
  const { bg, color } = map[status];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{status}</Text>
    </View>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const LEADS: { name: string; route: string; vehicle: string; pax: number; date: string; status: Status }[] = [
  { name: 'Rahul Sharma', route: 'Delhi → Manali', vehicle: 'Innova', pax: 6, date: 'Jul 18', status: 'New' },
  { name: 'Priya Mehta', route: 'Mumbai → Lonavala', vehicle: 'Tempo', pax: 12, date: 'Jul 20', status: 'Following Up' },
  { name: 'Vikram Singh', route: 'Pune → Shirdi', vehicle: 'Bus', pax: 40, date: 'Jul 22', status: 'Closed' },
  { name: 'Anjali Rao', route: 'Bangalore → Coorg', vehicle: 'Innova', pax: 7, date: 'Jul 25', status: 'New' },
  { name: 'Suresh Kumar', route: 'Chennai → Ooty', vehicle: 'Tempo', pax: 10, date: 'Jul 28', status: 'Following Up' },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontFamily: 'Sora-Bold', color: '#000000' },
  addButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 100,
  },
  addButtonText: { color: '#FFFFFF', fontFamily: 'Sora-SemiBold', fontSize: 13 },

  filterRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#F6F6F6',
  },
  chipActive: { backgroundColor: '#000000' },
  chipText: { fontSize: 13, fontFamily: 'Sora-Medium', color: '#6B6B6B' },
  chipTextActive: { color: '#FFFFFF' },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  initials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: { fontFamily: 'Sora-Bold', fontSize: 15, color: '#000000' },
  name: { fontSize: 15, fontFamily: 'Sora-SemiBold', color: '#000000', marginBottom: 2 },
  route: { fontSize: 12, fontFamily: 'Sora-Regular', color: '#6B6B6B' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  badgeText: { fontSize: 11, fontFamily: 'Sora-SemiBold' },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F6F6F6',
  },
  meta: { fontSize: 12, fontFamily: 'Sora-Regular', color: '#6B6B6B' },
});
