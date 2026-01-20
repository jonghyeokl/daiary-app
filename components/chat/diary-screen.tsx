import { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { DiaryCard } from './diary-card';
import { createDiary } from '@/lib/api/diary';
import type { Diary } from '@/lib/api/chat';

const BUTTON_COLOR = '#0a7ea4';

interface DiaryScreenProps {
  chatId: string | null;
  diary: Diary | null;
  onDiaryCreated: (diary: Diary) => void;
}

export function DiaryScreen({ chatId, diary, onDiaryCreated }: DiaryScreenProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateDiary = async () => {
    if (!chatId || isCreating) return;

    try {
      setIsCreating(true);
      setError(null);
      const newDiary = await createDiary(chatId);
      onDiaryCreated(newDiary);
    } catch (e: any) {
      const errorMsg = e?.message ?? e?.body ?? '다이어리 생성 실패';
      setError(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  if (!diary) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText type='subtitle' style={styles.emptyTitle}>
          아직 다이어리가 없습니다
        </ThemedText>
        <ThemedText style={styles.emptySubtext}>
          AI와의 대화를 바탕으로 다이어리를 생성합니다
        </ThemedText>

        {error && (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        )}

        <Pressable
          onPress={handleCreateDiary}
          disabled={isCreating || !chatId}
          style={({ pressed }) => [
            styles.createButton,
            { backgroundColor: BUTTON_COLOR },
            pressed && { opacity: 0.8 },
            isCreating && { opacity: 0.6 },
          ]}
        >
          {isCreating ? (
            <ActivityIndicator size='small' color='#fff' />
          ) : (
            <ThemedText style={styles.createButtonText}>
              다이어리 생성하기
            </ThemedText>
          )}
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <DiaryCard diary={diary} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    color: '#ff4444',
    marginTop: 16,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
