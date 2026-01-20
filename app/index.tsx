import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getLoginEmail } from '@/lib/storage/auth';

export default function HomeScreen() {
  const [loginEmail, setLoginEmail] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const email = await getLoginEmail();
        setLoginEmail(email);
      })();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DAIARY</Text>

      <View style={styles.card}>
        {loginEmail ? (
          <>
            <Text style={styles.subtitle}>Logged in</Text>
            <Text>{loginEmail}</Text>
          </>
        ) : (
          <Pressable
            onPress={() => router.push({ pathname: '/login' })}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.buttonText}>로그인</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  card: {
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
  },
  button: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
