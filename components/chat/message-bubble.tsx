import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Message } from '@/lib/api/chat';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const USER_BUBBLE_COLOR = '#0a7ea4';

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 1;
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: USER_BUBBLE_COLOR }]
            : [styles.aiBubble, { backgroundColor }],
        ]}
      >
        <ThemedText
          style={[styles.content, isUser && styles.userContent]}
          lightColor={isUser ? '#fff' : undefined}
          darkColor={isUser ? '#fff' : undefined}
        >
          {message.content}
        </ThemedText>
        <ThemedText
          style={[styles.timestamp, isUser && styles.userTimestamp]}
          lightColor={isUser ? 'rgba(255,255,255,0.7)' : '#999'}
          darkColor={isUser ? 'rgba(255,255,255,0.7)' : '#666'}
        >
          {formatTime(message.created_dt)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
  },
  userContent: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
});
