import { Stack } from 'expo-router';

export default function LeadsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new" />
      <Stack.Screen name="success" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="advance" />
    </Stack>
  );
}
