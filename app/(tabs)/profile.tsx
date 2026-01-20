import { useCallback, useState } from 'react';
import { StyleSheet, Pressable, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getLoginEmail, clearLoginEmail } from '@/lib/storage/auth';
import { clearTokens } from '@/lib/storage/token';

export default function ProfileScreen() {
  const [loginEmail, setLoginEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    const email = await getLoginEmail();
    setLoginEmail(email);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      checkAuthStatus();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await clearTokens();
          await clearLoginEmail();
          setLoginEmail(null);
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>로딩 중...</ThemedText>
      </ThemedView>
    );
  }

  if (loginEmail) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.card}>
          <ThemedText type='subtitle'>계정</ThemedText>
          <ThemedText style={styles.email}>{loginEmail}</ThemedText>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.button,
              styles.logoutButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <ThemedText style={styles.logoutText}>로그아웃</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type='subtitle'>환영합니다</ThemedText>
        <ThemedText style={styles.description}>
          로그인하면 채팅을 저장하고 동기화할 수 있습니다
        </ThemedText>

        <Pressable
          onPress={() => router.push('/login')}
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <ThemedText style={styles.primaryButtonText}>로그인</ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push('/signup')}
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <ThemedText type='defaultSemiBold'>회원가입</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    gap: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
  },
  email: {
    fontSize: 16,
    marginTop: 4,
  },
  description: {
    opacity: 0.7,
    marginBottom: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#999',
  },
  logoutButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutText: {
    color: '#ff4444',
    fontWeight: '600',
  },
});
