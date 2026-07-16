import { StyleSheet, Text, View } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TripStatus = 'In Transit' | 'Loading' | 'Assigned' | 'Unassigned' | 'Delivered' | 'Completed';

export interface TripCardData {
  routeId: string;
  from: string;
  to: string;
  customer: string;
  vendor: string;
  status: TripStatus;
  date?: string;
}

// Status → colour map
const STATUS_STYLE: Record<TripStatus, { bg: string; color: string }> = {
  'In Transit': { bg: '#E8F5FF', color: '#0077CC' },
  'Loading':    { bg: '#FFF7E6', color: '#CC7700' },
  'Assigned':   { bg: '#E8F9EF', color: '#1AAD5E' },
  'Unassigned': { bg: '#F6F6F6', color: '#6B6B6B' },
  'Delivered':  { bg: '#E8F9EF', color: '#1AAD5E' },
  'Completed':  { bg: '#E8F9EF', color: '#1AAD5E' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function TripCard({ trip }: { trip: TripCardData }) {
  const { bg, color } = STATUS_STYLE[trip.status];

  return (
    <View style={styles.card}>
      {/* Top row: route ID + status badge */}
      <View style={styles.topRow}>
        <Text style={styles.routeId}>{trip.routeId}</Text>
        <View style={[styles.badge, { backgroundColor: bg }]}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.badgeText, { color }]}>{trip.status}</Text>
        </View>
      </View>

      {/* Route */}
      <Text style={styles.route}>{trip.from} → {trip.to}</Text>

      {/* Footer: customer + vendor */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>CUSTOMER</Text>
          <Text style={styles.footerValue}>{trip.customer}</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>VENDOR</Text>
          <Text style={styles.footerValue}>{trip.vendor}</Text>
        </View>
        {trip.date && (
          <View style={[styles.footerItem, { alignItems: 'flex-end', marginLeft: 'auto' }]}>
            <Text style={styles.footerLabel}>DATE</Text>
            <Text style={styles.footerValue}>{trip.date}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 14,
    gap: 8,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeId: {
    fontSize: 12,
    fontFamily: 'Sora-SemiBold',
    color: '#9E9E9E',
    letterSpacing: 0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Sora-SemiBold',
  },
  route: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F6F6F6',
    flexWrap: 'wrap',
  },
  footerItem: { gap: 2 },
  footerLabel: {
    fontSize: 10,
    fontFamily: 'Sora-Regular',
    color: '#9E9E9E',
    letterSpacing: 0.5,
  },
  footerValue: {
    fontSize: 13,
    fontFamily: 'Sora-Medium',
    color: '#000000',
  },
});
