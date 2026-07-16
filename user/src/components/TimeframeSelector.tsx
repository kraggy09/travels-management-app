import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Timeframe = '7d' | '15d' | '30d' | '60d';

interface TimeframeSelectorProps {
  value?: Timeframe;
  onChange?: (value: Timeframe) => void;
  options?: Timeframe[];
}

const DEFAULT_OPTIONS: Timeframe[] = ['7d', '15d', '30d', '60d'];

// ─── Component ────────────────────────────────────────────────────────────────

export function TimeframeSelector({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}: TimeframeSelectorProps) {
  // Uncontrolled fallback — if no value/onChange passed, manages own state
  const [internal, setInternal] = useState<Timeframe>(options[0]);
  const active = value ?? internal;

  const handlePress = (opt: Timeframe) => {
    setInternal(opt);
    onChange?.(opt);
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Timeframe:</Text>
      <View style={styles.pillGroup}>
        {options.map((opt) => {
          const isActive = opt === active;
          return (
            <Pressable
              key={opt}
              onPress={() => handlePress(opt)}
              style={({ pressed }) => [
                styles.pill,
                isActive && styles.pillActive,
                pressed && styles.pillPressed,
              ]}>
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Sora-Regular',
    color: '#6B6B6B',
  },
  pillGroup: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
    padding: 3,
    gap: 2,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  pillActive: {
    backgroundColor: '#000000',
  },
  pillPressed: {
    opacity: 0.7,
  },
  pillText: {
    fontSize: 12,
    fontFamily: 'Sora-SemiBold',
    color: '#6B6B6B',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});
