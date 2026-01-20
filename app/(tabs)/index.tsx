import { useCallback, useState } from 'react';
import { StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Calendar } from '@/components/calendar';
import { fetchChatDates } from '@/lib/api/chat';
import { getAccessToken } from '@/lib/storage/token';

export default function CalendarScreen() {
  const router = useRouter();
  const [chatDates, setChatDates] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChatDates = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getAccessToken();
      if (!token) {
        setIsLoggedIn(false);
        setChatDates(new Set());
        return;
      }

      setIsLoggedIn(true);
      const dates = await fetchChatDates();
      setChatDates(dates);
    } catch (e: any) {
      const errorMsg = e?.message ?? e?.body ?? JSON.stringify(e);
      setError(`채팅을 불러오지 못했습니다: ${errorMsg}`);
      console.error('fetchChatDates error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadChatDates();
    }, [])
  );

  const handleDatePress = (date: Date) => {
    if (!isLoggedIn) {
      Alert.alert('로그인 필요', '채팅을 시작하려면 로그인이 필요합니다', [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.push('/login') },
      ]);
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    router.push(`/chat/${dateStr}`);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size='large' />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {!isLoggedIn && (
        <ThemedView style={styles.notice}>
          <ThemedText>로그인하면 채팅 기록을 볼 수 있습니다</ThemedText>
        </ThemedView>
      )}

      {error && (
        <ThemedView style={styles.error}>
          <ThemedText>{error}</ThemedText>
        </ThemedView>
      )}

      <Calendar highlightedDates={chatDates} onDatePress={handleDatePress} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notice: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  error: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
});
