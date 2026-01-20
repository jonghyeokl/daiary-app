import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MessageScreen, DiaryScreen } from '@/components/chat';
import {
  fetchChatByDate,
  createChat,
  fetchMessagesAndDiary,
  type Message,
  type Diary,
} from '@/lib/api/chat';
import { sendMessage } from '@/lib/api/message';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ChatScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const navigation = useNavigation();
  const pagerRef = useRef<PagerView>(null);

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [diary, setDiary] = useState<Diary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    if (date) {
      navigation.setOptions({
        title: formatDateTitle(date),
      });
      initializeChat();
    }
  }, [date]);

  const initializeChat = async () => {
    if (!date) return;

    try {
      setIsLoading(true);
      setError(null);

      const existingChat = await fetchChatByDate(date);

      if (existingChat) {
        setChatId(existingChat.chat_id);
        const data = await fetchMessagesAndDiary(existingChat.chat_id);
        setMessages(data.messages);
        setDiary(data.diary);

        if (data.diary) {
          setCurrentPage(1);
          setTimeout(() => pagerRef.current?.setPage(1), 100);
        }
      } else {
        const initialMessage = await createChat(date);
        setChatId(initialMessage.chat_id);
        setMessages([initialMessage]);
        setDiary(null);
      }
    } catch (e: any) {
      const errorMsg = e?.message ?? e?.body ?? JSON.stringify(e);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (content: string) => {
    if (!chatId || isSending || diary) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    const userMessage: Message = {
      message_id: `temp-${Date.now()}`,
      chat_id: chatId,
      parent_message_id: lastMessage.message_id,
      content,
      role: 1,
      created_dt: new Date().toISOString(),
      updated_dt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const aiResponse = await sendMessage({
        chatId,
        parentMessageId: lastMessage.message_id,
        content,
      });

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.message_id !== userMessage.message_id);
        const actualUserMessage: Message = {
          ...userMessage,
          message_id: `user-${Date.now()}`,
          parent_message_id: lastMessage.message_id,
        };
        return [...filtered, actualUserMessage, aiResponse];
      });
    } catch (e: any) {
      setMessages((prev) =>
        prev.filter((m) => m.message_id !== userMessage.message_id)
      );
      const errorMsg = e?.message ?? e?.body ?? '메시지 전송 실패';
      setError(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size='large' color={tintColor} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.tabIndicator}>
        <View
          style={[
            styles.tabDot,
            { backgroundColor: currentPage === 0 ? tintColor : iconColor },
          ]}
        />
        <View
          style={[
            styles.tabDot,
            { backgroundColor: currentPage === 1 ? tintColor : iconColor },
          ]}
        />
      </View>

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={diary ? 1 : 0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <View key='message' style={styles.page}>
          <MessageScreen
            messages={messages}
            diary={diary}
            isSending={isSending}
            onSend={handleSend}
          />
        </View>
        <View key='diary' style={styles.page}>
          <DiaryScreen
            chatId={chatId}
            diary={diary}
            onDiaryCreated={(newDiary) => setDiary(newDiary)}
          />
        </View>
      </PagerView>
    </ThemedView>
  );
}

function formatDateTitle(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
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
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    padding: 20,
  },
  tabIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});
