import { StyleSheet, Text, View } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OverviewCardProps {
  title: string;
  number: string;
  /** Signed string like "+12%" or "-4%" — sign determines badge colour */
  percentage: string;
  /**
   * Cards sharing the same row.
   * 1 → full width · 2 → half · 3 → one-third
   */
  noOfCardsInRow?: 1 | 2 | 3;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OverviewCard({
  title,
  number,
  percentage,
  noOfCardsInRow = 1,
}: OverviewCardProps) {
  const isPositive = !percentage.startsWith('-');

  return (
    <View style={[styles.card, { flex: 1 / noOfCardsInRow }]}>

      {/* Label ─────────────────────────────────────────────────────────── */}
      <Text style={styles.title} numberOfLines={1}>
        {title.toUpperCase()}
      </Text>

      {/* Number ─────────────────────────────────────────────────────────
          Takes the FULL card width — never competes with the badge.
          adjustsFontSizeToFit ensures very long amounts (₹1,24,500)
          scale down gracefully instead of being clipped.
      ─────────────────────────────────────────────────────────────────── */}
      <Text
        style={styles.number}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.55}
      >
        {number}
      </Text>

      {/* Badge ──────────────────────────────────────────────────────────
          Sits below the number, left-aligned, so it always has room.
      ─────────────────────────────────────────────────────────────────── */}
      <View style={[styles.badge, isPositive ? styles.badgePos : styles.badgeNeg]}>
        <Text style={[styles.badgeText, isPositive ? styles.textPos : styles.textNeg]}>
          {isPositive && !percentage.startsWith('+') ? '+' : ''}{percentage}
        </Text>
      </View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 16,
    gap: 8,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Android
    elevation: 2,
  },

  title: {
    fontSize: 11,
    fontFamily: 'Sora-SemiBold',
    color: '#9E9E9E',
    letterSpacing: 0.8,
  },

  // Number occupies full card width
  number: {
    fontSize: 28,
    fontFamily: 'Sora-Bold',
    color: '#000000',
    // Do NOT set flexShrink — let adjustsFontSizeToFit handle it
  },

  // Badge is left-aligned pill below the number
  badge: {
    alignSelf: 'flex-start',       // shrink-wrap to text — never stretches
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  badgePos: { backgroundColor: '#E6F9EF' },
  badgeNeg: { backgroundColor: '#FEE9E9' },

  badgeText: { fontSize: 12, fontFamily: 'Sora-SemiBold' },
  textPos:   { color: '#1AAD5E' },
  textNeg:   { color: '#E53935' },
});
