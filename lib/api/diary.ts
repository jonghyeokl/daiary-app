import { apiFetch, apiFetchJson } from './client';
import type { Diary } from './chat';

/**
 * 다이어리 생성
 * POST /api/diary/v1/
 */
export async function createDiary(chatId: string): Promise<Diary> {
  return apiFetchJson<Diary>(`/api/diary/v1/?chat_id=${chatId}`, {
    method: 'POST',
  });
}

/**
 * 다이어리 업데이트
 * PATCH /api/diary/v1/
 */
export async function updateDiary(params: {
  diaryId: string;
  title: string;
  body: string;
}): Promise<void> {
  const res = await apiFetch('/api/diary/v1/', {
    method: 'PATCH',
    body: JSON.stringify({
      diary_id: params.diaryId,
      title: params.title,
      body: params.body,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Diary update failed: ${res.status} ${text}`);
  }
}
