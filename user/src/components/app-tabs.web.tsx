/**
 * Web bottom tab bar — Uber-inspired black & white design.
 * Uses Feather icons from @expo/vector-icons for a clean, modern look.
 */
import { Feather } from '@expo/vector-icons';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  type TabTriggerSlotProps,
  type TabListProps,
} from 'expo-router/ui';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing, MaxContentWidth } from '@/constants/theme';

// ─── Tab Config ───────────────────────────────────────────────────────────────

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const TABS: { name: string; href: Href; label: string; icon: FeatherIconName }[] = [
  { name: 'home',      href: '/'          as Href, label: 'Dashboard', icon: 'grid'        },
  { name: 'leads',     href: '/leads'     as Href, label: 'Leads',     icon: 'users'       },
  { name: 'trips',     href: '/trips'     as Href, label: 'Trips',     icon: 'navigation'  },
  { name: 'cash-flow', href: '/cash-flow' as Href, label: 'Cash Flow', icon: 'bar-chart-2' },
];

// ─── App Tabs ─────────────────────────────────────────────────────────────────

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1, height: '100%' }} />
      <TabList asChild>
        <BottomBar>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton label={tab.label} icon={tab.icon} />
            </TabTrigger>
          ))}
        </BottomBar>
      </TabList>
    </Tabs>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: FeatherIconName;
};

function TabButton({ children: _children, isFocused, label, icon, ...props }: TabButtonProps) {
  const color = isFocused ? '#000000' : '#9E9E9E';

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabButton, pressed && styles.tabButtonPressed]}>
      {/* Active indicator dot */}
      <View style={[styles.dot, isFocused && styles.dotActive]} />
      <Feather name={icon} size={22} color={color} />
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
        {label}
      </Text>
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
    paddingTop: Spacing.one,
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    justifyContent: 'space-around',
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.one,
    gap: 4,
  },
  tabButtonPressed: { opacity: 0.7 },

  // Small active indicator dot above the icon
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginBottom: 2,
  },
  dotActive: {
    backgroundColor: '#000000',
  },

  tabLabel: {
    fontSize: 10,
    fontFamily: 'Sora-Medium',
    color: '#9E9E9E',
  },
  tabLabelActive: {
    color: '#000000',
    fontFamily: 'Sora-SemiBold',
  },
});
