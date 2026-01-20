import { useRef, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';
import type { Message, Diary } from '@/lib/api/chat';

interface MessageScreenProps {
  messages: Message[];
  diary: Diary | null;
  isSending: boolean;
  onSend: (content: string) => void;
}

export function MessageScreen({
  messages,
  diary,
  isSending,
  onSend,
}: MessageScreenProps) {
  const flatListRef = useRef<FlatList>(null);
  const isReadOnly = diary !== null;

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
    >
      <ThemedView style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyExtractor={(item) => item.message_id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        />

        {isReadOnly ? (
          <View style={styles.readOnlyNotice}>
            <ThemedText style={styles.readOnlyText}>
              다이어리가 작성되어 채팅이 종료되었습니다
            </ThemedText>
          </View>
        ) : (
          <MessageInput onSend={onSend} isLoading={isSending} />
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    paddingVertical: 12,
  },
  readOnlyNotice: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  readOnlyText: {
    opacity: 0.6,
    fontSize: 14,
  },
});
