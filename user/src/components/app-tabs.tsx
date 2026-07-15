/**
 * Native bottom tab bar for iOS / Android.
 * Uses expo-router's NativeTabs (Expo SDK 56).
 * Icons are inline SVG paths rendered via react-native-svg.
 */
import { NativeTabs } from 'expo-router/unstable-native-tabs';


// ─── Tab Bar ─────────────────────────────────────────────────────────────────


export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#FFFFFF"
      indicatorColor="#000000"
      labelStyle={{ selected: { color: '#000000' } }}>

      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/home.png')} renderingMode="template" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="leads">
        <NativeTabs.Trigger.Label>Leads</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/explore.png')} renderingMode="template" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="trips">
        <NativeTabs.Trigger.Label>Trips</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/explore.png')} renderingMode="template" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cash-flow">
        <NativeTabs.Trigger.Label>Cash Flow</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/explore.png')} renderingMode="template" />
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}
