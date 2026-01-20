import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import type { Diary } from '@/lib/api/chat';

interface DiaryCardProps {
  diary: Diary;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function DiaryCard({ diary }: DiaryCardProps) {
  return (
    <ThemedView style={styles.card}>
      <ThemedText type='title' style={styles.title}>
        {diary.title}
      </ThemedText>
      <ThemedText style={styles.date}>{formatDate(diary.created_dt)}</ThemedText>
      <ThemedText style={styles.body}>{diary.body}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
  },
});
