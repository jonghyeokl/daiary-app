import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { signup } from '@/lib/api/user';

export default function SignupModal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phoneNumber.trim()
    ) {
      Alert.alert('오류', '모든 항목을 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        phone_number: phoneNumber.trim(),
      });
      Alert.alert('성공', '계정이 생성되었습니다!', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('회원가입 실패', e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type='title'>회원가입</ThemedText>

          <ThemedText style={styles.label}>이름</ThemedText>
          <TextInput
            autoCapitalize='words'
            autoCorrect={false}
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder='이름'
          />

          <ThemedText style={styles.label}>이메일</ThemedText>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='email-address'
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder='email@example.com'
          />

          <ThemedText style={styles.label}>비밀번호</ThemedText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder='비밀번호'
            secureTextEntry
          />

          <ThemedText style={styles.label}>전화번호</ThemedText>
          <TextInput
            keyboardType='phone-pad'
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            placeholder='010-1234-5678'
          />

          <Pressable
            onPress={onSubmit}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && { opacity: 0.8 },
              isLoading && { opacity: 0.6 },
            ]}
          >
            <ThemedText style={styles.primaryButtonText}>
              {isLoading ? '계정 생성 중...' : '계정 만들기'}
            </ThemedText>
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.link}>
            <ThemedText>닫기</ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 20, gap: 8, paddingBottom: 40 },
  label: { marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 20,
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
  link: { marginTop: 10, alignItems: 'center' },
});
