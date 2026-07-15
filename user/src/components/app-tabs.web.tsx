/**
 * Web bottom tab bar — Uber-inspired black & white design.
 * Renders a fixed bottom bar with 4 tabs.
 */
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  type TabTriggerSlotProps,
  type TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing, MaxContentWidth } from '@/constants/theme';

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS = [
  { name: 'home', href: '/', label: 'Dashboard', emoji: '▦' },
  { name: 'leads', href: '/leads', label: 'Leads', emoji: '👥' },
  { name: 'trips', href: '/trips', label: 'Trips', emoji: '✈' },
  { name: 'cash-flow', href: '/cash-flow', label: 'Cash Flow', emoji: '₹' },
] as const;

// ─── App Tabs ─────────────────────────────────────────────────────────────────

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1, height: '100%' }} />
      <TabList asChild>
        <BottomBar>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton label={tab.label} emoji={tab.emoji} />
            </TabTrigger>
          ))}
        </BottomBar>
      </TabList>
    </Tabs>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

type TabButtonProps = TabTriggerSlotProps & { label: string; emoji: string };

function TabButton({ children: _children, isFocused, label, emoji, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabButton, pressed && styles.tabButtonPressed]}>
      <View style={[styles.tabButtonInner, isFocused && styles.tabButtonActive]}>
        <Text style={[styles.tabEmoji, isFocused && styles.tabEmojiActive]}>{emoji}</Text>
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{label}</Text>
      </View>
    </Pressable>
  );
}

// ─── Bottom Bar ───────────────────────────────────────────────────────────────

function BottomBar(props: TabListProps) {
  return (
    <View style={styles.barWrapper}>
      <View style={styles.bar} {...props} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingBottom: Spacing.three,
    paddingTop: Spacing.two,
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    justifyContent: 'space-around',
  },

  tabButton: { flex: 1, alignItems: 'center' },
  tabButtonPressed: { opacity: 0.7 },

  tabButtonInner: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 12,
    gap: 4,
  },
  tabButtonActive: {
    // Subtle underline dot to indicate active state
  },

  tabEmoji: {
    fontSize: 20,
    color: '#9E9E9E',
  },
  tabEmojiActive: { color: '#000000' },

  tabLabel: {
    fontSize: 11,
    fontFamily: 'Sora-Medium',
    color: '#9E9E9E',
  },
  tabLabelActive: {
    color: '#000000',
    fontFamily: 'Sora-SemiBold',
  },
});
