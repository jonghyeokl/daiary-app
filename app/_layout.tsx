import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name='chat/[date]'
        options={{
          headerBackTitle: '캘린더',
        }}
      />
      <Stack.Screen
        name='login'
        options={{ presentation: 'modal', title: 'Login' }}
      />
      <Stack.Screen
        name='signup'
        options={{ presentation: 'modal', title: 'Sign Up' }}
      />
    </Stack>
  );
}
