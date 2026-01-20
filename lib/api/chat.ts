import { apiFetchJson } from './client';

export interface Chat {
  chat_id: string;
  user_id: string;
  root_message_id: string;
  chat_date: string;
  created_dt: string;
  updated_dt: string;
}

export interface Message {
  message_id: string;
  chat_id: string;
  parent_message_id: string | null;
  content: string;
  role: number; // 0 = MODEL, 1 = USER
  created_dt: string;
  updated_dt: string;
}

export interface Diary {
  diary_id: string;
  chat_id: string;
  title: string;
  body: string;
  created_dt: string;
  updated_dt: string;
}

export interface MessagesAndDiary {
  messages: Message[];
  diary: Diary | null;
}

/**
 * 모든 채팅 가져오기
 * GET /api/chat/v1/
 */
export async function fetchChats(): Promise<Chat[]> {
  const result = await apiFetchJson<Chat[]>('/api/chat/v1/');
  return Array.isArray(result) ? result : [];
}

/**
 * 채팅이 있는 날짜 Set 반환 (YYYY-MM-DD 형식)
 */
export async function fetchChatDates(): Promise<Set<string>> {
  const chats = await fetchChats();
  const dates = new Set<string>();

  chats.forEach((chat) => {
    if (chat.chat_date) {
      const date = chat.chat_date.split('T')[0];
      dates.add(date);
    }
  });

  return dates;
}

/**
 * 날짜로 채팅 찾기
 */
export async function fetchChatByDate(date: string): Promise<Chat | null> {
  const chats = await fetchChats();
  return chats.find((chat) => chat.chat_date.split('T')[0] === date) ?? null;
}

/**
 * 새 채팅 생성 (AI 인사 메시지 반환)
 * POST /api/chat/v1/
 */
export async function createChat(chatDate: string): Promise<Message> {
  return apiFetchJson<Message>('/api/chat/v1/', {
    method: 'POST',
    body: JSON.stringify({ chat_date: chatDate }),
  });
}

/**
 * 채팅의 모든 메시지와 다이어리 가져오기
 * GET /api/chat/v1/get-all-messages-and-diary?chat_id=xxx
 */
export async function fetchMessagesAndDiary(
  chatId: string
): Promise<MessagesAndDiary> {
  return apiFetchJson<MessagesAndDiary>(
    `/api/chat/v1/get-all-messages-and-diary?chat_id=${chatId}`
  );
}
