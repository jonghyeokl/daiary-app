import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { login } from '@/lib/api/user';

export default function LoginModal() {
  const [email, setEmail] = useState('oneashxx@gmail.com');
  const [password, setPassword] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await login({ email, password });
      router.back();
    } catch (e: any) {
      Alert.alert('로그인 실패', e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title'>Login</ThemedText>

      <ThemedText style={styles.label}>Email</ThemedText>
      <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        keyboardType='email-address'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder='email'
      />

      <ThemedText style={styles.label}>Password</ThemedText>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder='password'
        secureTextEntry
      />

      <Pressable
        onPress={onSubmit}
        disabled={isLoading}
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.8 },
          isLoading && { opacity: 0.6 },
        ]}
      >
        <ThemedText type='defaultSemiBold'>
          {isLoading ? '로그인 중...' : '로그인'}
        </ThemedText>
      </Pressable>

      <Pressable onPress={() => router.back()} style={styles.link}>
        <ThemedText>닫기</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: 'center' },
  label: { marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  link: { marginTop: 10, alignItems: 'center' },
});
