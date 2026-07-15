import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Sora-Light': require('@/assets/fonts/Sora-Light.ttf'),
    'Sora-Regular': require('@/assets/fonts/Sora-Regular.ttf'),
    'Sora-Medium': require('@/assets/fonts/Sora-Medium.ttf'),
    'Sora-SemiBold': require('@/assets/fonts/Sora-SemiBold.ttf'),
    'Sora-Bold': require('@/assets/fonts/Sora-Bold.ttf'),
    'Sora-ExtraBold': require('@/assets/fonts/Sora-ExtraBold.ttf'),
  });

  // Keep splash visible until fonts are ready
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      <AppTabs />
    </View>
  );
}
