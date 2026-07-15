import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TripsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trips</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Book</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Upcoming Section */}
        <Text style={styles.sectionTitle}>Upcoming</Text>
        {TRIPS.filter((t) => t.section === 'upcoming').map((trip, i) => (
          <TripCard key={i} trip={trip} />
        ))}

        {/* Past Section */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Past</Text>
        {TRIPS.filter((t) => t.section === 'past').map((trip, i) => (
          <TripCard key={i} trip={trip} faded />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Trip Card ────────────────────────────────────────────────────────────────

function TripCard({ trip, faded }: { trip: (typeof TRIPS)[0]; faded?: boolean }) {
  return (
    <View style={[styles.card, faded && styles.cardFaded]}>
      {/* Route line */}
      <View style={styles.routeRow}>
        <View style={styles.routeDot} />
        <View style={styles.routeLine} />
        <View style={[styles.routeDot, styles.routeDotDest]} />
      </View>

      <View style={styles.routeLabels}>
        <View>
          <Text style={styles.city}>{trip.from}</Text>
          <Text style={styles.time}>{trip.departure}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.city}>{trip.to}</Text>
          <Text style={styles.time}>{trip.arrival}</Text>
        </View>
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Vehicle</Text>
          <Text style={styles.metaValue}>{trip.vehicle}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Pax</Text>
          <Text style={styles.metaValue}>{trip.pax}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Fare</Text>
          <Text style={styles.metaValue}>{trip.fare}</Text>
        </View>
        <View style={[styles.tripBadge, { backgroundColor: trip.statusColor }]}>
          <Text style={styles.tripBadgeText}>{trip.status}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TRIPS = [
  { from: 'Delhi', to: 'Manali', departure: 'Jul 18, 06:00', arrival: 'Jul 18, 18:00', vehicle: 'Innova Crysta', pax: 6, fare: '₹12,000', status: 'Confirmed', statusColor: '#000000', section: 'upcoming' },
  { from: 'Mumbai', to: 'Goa', departure: 'Jul 20, 07:30', arrival: 'Jul 20, 17:00', vehicle: '2x2 Bus', pax: 40, fare: '₹85,000', status: 'In Transit', statusColor: '#3B82F6', section: 'upcoming' },
  { from: 'Pune', to: 'Shirdi', departure: 'Jul 10, 05:00', arrival: 'Jul 10, 09:00', vehicle: 'Tempo Traveller', pax: 14, fare: '₹9,500', status: 'Completed', statusColor: '#22C55E', section: 'past' },
  { from: 'Bangalore', to: 'Coorg', departure: 'Jul 5, 08:00', arrival: 'Jul 5, 13:00', vehicle: 'Innova Crysta', pax: 7, fare: '₹7,200', status: 'Completed', statusColor: '#22C55E', section: 'past' },
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
    paddingBottom: 20,
  },
  title: { fontSize: 28, fontFamily: 'Sora-Bold', color: '#000000' },
  addButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 100,
  },
  addButtonText: { color: '#FFFFFF', fontFamily: 'Sora-SemiBold', fontSize: 13 },

  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Sora-SemiBold',
    color: '#9E9E9E',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardFaded: { opacity: 0.65 },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#000000',
  },
  routeDotDest: { backgroundColor: '#FFFFFF' },
  routeLine: { flex: 1, height: 1.5, backgroundColor: '#E0E0E0', marginHorizontal: 6 },

  routeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  city: { fontSize: 15, fontFamily: 'Sora-SemiBold', color: '#000000' },
  time: { fontSize: 11, fontFamily: 'Sora-Regular', color: '#6B6B6B', marginTop: 2 },

  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F6F6F6',
  },
  metaItem: { gap: 2 },
  metaLabel: { fontSize: 10, fontFamily: 'Sora-Regular', color: '#9E9E9E', textTransform: 'uppercase' },
  metaValue: { fontSize: 13, fontFamily: 'Sora-SemiBold', color: '#000000' },
  tripBadge: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  tripBadgeText: { fontSize: 11, fontFamily: 'Sora-SemiBold', color: '#FFFFFF' },
});
