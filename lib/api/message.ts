import { apiFetchJson } from './client';
import type { Message } from './chat';

/**
 * 메시지 보내기 (AI 응답 반환)
 * POST /api/message/v1/
 */
export async function sendMessage(params: {
  chatId: string;
  parentMessageId: string;
  content: string;
}): Promise<Message> {
  return apiFetchJson<Message>('/api/message/v1/', {
    method: 'POST',
    body: JSON.stringify({
      chat_id: params.chatId,
      parent_message_id: params.parentMessageId,
      content: params.content,
    }),
  });
}
