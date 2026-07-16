import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OverviewCard } from '@/components/OverviewCard';
import { SectionHeader } from '@/components/SectionHeader';
import { TripCard, type TripCardData } from '@/components/TripCard';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DashboardScreen() {

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── App Bar ──────────────────────────────────────────────────── */}
        <View style={s.appBar}>
          <Text style={s.appName}>Barakah Travels</Text>
          <View style={s.appBarRight}>
            <Pressable style={s.iconBtn}>
              <Feather name="bell" size={20} color="#000000" />
            </Pressable>
            <View style={s.avatar}>
              <Text style={s.avatarText}>TM</Text>
            </View>
          </View>
        </View>

        {/* ── Page Title ────────────────────────────────────────────────── */}
        <View style={s.pageTitleBlock}>
          <Text style={s.pageTitle}>Operations Hub</Text>
          <Text style={s.pageSubtitle}>
            Real-time oversight and scheduling for active fleet assets.
          </Text>
        </View>



        {/* ── Overview Cards (2 × 2 grid) ───────────────────────────────── */}
        <View style={s.cardGrid}>
          <View style={s.cardRow}>
            <OverviewCard title="Total Orders" number="124" percentage="+12%" noOfCardsInRow={2} />
            <OverviewCard title="Order Value" number="₹1,24,500" percentage="+9%" noOfCardsInRow={2} />
          </View>
          <View style={s.cardRow}>
            <OverviewCard title="Personal Fleet" number="48" percentage="+4%" noOfCardsInRow={2} />
            <OverviewCard title="Partner Fleet" number="76" percentage="-2%" noOfCardsInRow={2} />
          </View>
        </View>

        {/* ── Ongoing Trips ─────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Ongoing Trips"
            icon={<Feather name="truck" size={17} color="#000000" />}
            actionLabel="View live fleet map"
          />
          {ONGOING.map((t) => <TripCard key={t.routeId} trip={t} />)}
        </View>

        {/* ── Top Performing Vehicles ───────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Top Performing Vehicles"
            icon={<Feather name="award" size={17} color="#000000" />}
            actionLabel="View fleet reports"
          />
          <View style={s.vehiclesCard}>
            {TOP_VEHICLES.map((v, i) => (
              <View key={v.name} style={[s.vehicleRow, i === TOP_VEHICLES.length - 1 && s.vehicleRowLast]}>
                <View style={s.rankBadge}>
                  <Text style={s.rankText}>{v.rank}</Text>
                </View>
                <View style={s.vehicleInfo}>
                  <View style={s.vehicleNameRow}>
                    <Text style={s.vehicleName}>{v.name}</Text>
                    <View style={[s.ownBadge, v.type === 'personal' ? s.ownBadgePersonal : s.ownBadgeVendor]}>
                      <Text style={[s.ownBadgeText, v.type === 'personal' ? s.ownTextPersonal : s.ownTextVendor]}>
                        {v.type === 'personal' ? 'OWN' : 'PARTNER'}
                      </Text>
                    </View>
                  </View>
                  <Text style={s.vehicleMeta}>{v.trips} Trips completed • {v.utilization} Util.</Text>
                </View>
                <View style={s.vehicleProfitCol}>
                  <Text style={s.vehicleProfit}>₹{v.profit.toLocaleString()}</Text>
                  <Text style={s.vehicleProfitLabel}>Net Profit</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Upcoming Trips ────────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Upcoming Trips"
            icon={<Feather name="calendar" size={17} color="#000000" />}
            actionLabel="View all upcoming"
          />
          {UPCOMING.map((t) => <TripCard key={t.routeId} trip={t} />)}
        </View>

        {/* ── Completed Trips ───────────────────────────────────────────── */}
        <View style={s.section}>
          <SectionHeader
            title="Completed Trips"
            icon={<Feather name="check-circle" size={17} color="#000000" />}
            actionLabel="View all completed"
          />
          {COMPLETED.map((t) => <TripCard key={t.routeId} trip={t} />)}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TOP_VEHICLES = [
  { rank: 1, name: 'Innova Crysta (Own)', trips: 42, profit: 345000, type: 'personal', utilization: '94%' },
  { rank: 2, name: 'Sardar Travels Bus', trips: 18, profit: 285000, type: 'vendor', utilization: '88%' },
  { rank: 3, name: 'Tempo Traveller (Own)', trips: 31, profit: 215000, type: 'personal', utilization: '82%' },
  { rank: 4, name: 'HP Travels Bus', trips: 12, profit: 190000, type: 'vendor', utilization: '75%' },
  { rank: 5, name: 'Ertiga (Own)', trips: 28, profit: 142000, type: 'personal', utilization: '80%' }
];

const ONGOING: TripCardData[] = [
  { routeId: 'RT-8422', from: 'Kolkata', to: 'Mandarmani', customer: 'Anil Sharma', vendor: 'Blue Dart Logistics', status: 'In Transit' },
  { routeId: 'RT-9011', from: 'Delhi', to: 'Manali', customer: 'Sarah Jenkins', vendor: 'Swift Freight', status: 'In Transit' },
  { routeId: 'RT-7734', from: 'Mumbai', to: 'Goa', customer: 'TechCorp Inc.', vendor: 'Bay Area Logistics', status: 'Loading' },
];

const UPCOMING: TripCardData[] = [
  { routeId: 'RT-1102', from: 'Bangalore', to: 'Coorg', customer: 'Priya Mehta', vendor: 'FastHaul', status: 'Assigned', date: 'Jul 18' },
  { routeId: 'RT-2398', from: 'Pune', to: 'Shirdi', customer: 'Ramesh Iyer', vendor: '—', status: 'Unassigned', date: 'Jul 20' },
  { routeId: 'RT-0044', from: 'Chennai', to: 'Ooty', customer: 'Vikram Singh', vendor: 'DesertMove', status: 'Assigned', date: 'Jul 22' },
];

const COMPLETED: TripCardData[] = [
  { routeId: 'RT-0982', from: 'Delhi', to: 'Agra', customer: 'Anjali Rao', vendor: 'NorthWest Haulage', status: 'Delivered' },
  { routeId: 'RT-1145', from: 'Hyderabad', to: 'Vizag', customer: 'Suresh Kumar', vendor: 'TexasFleet', status: 'Delivered' },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingBottom: 120 },

  // App bar
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  appName: { fontSize: 18, fontFamily: 'Sora-Bold', color: '#000000' },
  appBarRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center', alignItems: 'center',
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#FFFFFF', fontFamily: 'Sora-SemiBold', fontSize: 12 },

  // Page title
  pageTitleBlock: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 4 },
  pageTitle: { fontSize: 26, fontFamily: 'Sora-Bold', color: '#000000' },
  pageSubtitle: { fontSize: 13, fontFamily: 'Sora-Regular', color: '#6B6B6B', lineHeight: 20 },

  // Timeframe
  timeframeWrap: { paddingHorizontal: 20, marginBottom: 20 },

  // Overview grid
  cardGrid: { paddingHorizontal: 20, gap: 10, marginBottom: 28 },
  cardRow: { flexDirection: 'row', gap: 10 },

  // Sections
  section: { paddingHorizontal: 20, marginBottom: 28 },

  // CTA
  ctaRow: { alignItems: 'center', marginTop: 8 },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#000000',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 100,
  },
  ctaText: { color: '#FFFFFF', fontFamily: 'Sora-SemiBold', fontSize: 14 },
  pressed: { opacity: 0.8 },

  // Top Vehicles Section Styles
  vehiclesCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 16,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  vehicleRowLast: {
    borderBottomWidth: 0,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 11,
    fontFamily: 'Sora-Bold',
    color: '#000000',
  },
  vehicleInfo: {
    flex: 1,
    gap: 2,
  },
  vehicleNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleName: {
    fontSize: 13,
    fontFamily: 'Sora-SemiBold',
    color: '#000000',
  },
  ownBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ownBadgeText: {},
  ownBadgePersonal: {
    backgroundColor: '#D1FAE5',
  },
  ownTextPersonal: {
    color: '#065F46',
    fontSize: 8,
    fontFamily: 'Sora-Bold',
  },
  ownBadgeVendor: {
    backgroundColor: '#F3E8FF',
  },
  ownTextVendor: {
    color: '#5B21B6',
    fontSize: 8,
    fontFamily: 'Sora-Bold',
  },
  vehicleMeta: {
    fontSize: 11,
    fontFamily: 'Sora-Regular',
    color: '#6B6B6B',
  },
  vehicleProfitCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  vehicleProfit: {
    fontSize: 13,
    fontFamily: 'Sora-Bold',
    color: '#22C55E',
  },
  vehicleProfitLabel: {
    fontSize: 9,
    fontFamily: 'Sora-Regular',
    color: '#9CA3AF',
  },
});

