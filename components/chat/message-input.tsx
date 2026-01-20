import { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';

const SEND_BUTTON_COLOR = '#0a7ea4';

interface MessageInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function MessageInput({
  onSend,
  isLoading,
  disabled = false,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const handleSend = () => {
    if (text.trim() && !isLoading && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const canSend = text.trim().length > 0 && !isLoading && !disabled;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.inputContainer, { borderColor: iconColor }]}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={text}
          onChangeText={setText}
          placeholder='메시지를 입력하세요...'
          placeholderTextColor={iconColor}
          multiline
          maxLength={1000}
          editable={!isLoading && !disabled}
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={({ pressed }) => [
            styles.sendButton,
            { backgroundColor: canSend ? SEND_BUTTON_COLOR : iconColor },
            pressed && canSend && { opacity: 0.8 },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size='small' color='#fff' />
          ) : (
            <Ionicons name='send' size={18} color='#fff' />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
