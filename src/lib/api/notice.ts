import { Notice, NoticeFilter, NoticeResponse } from '../types/notice';

const API_BASE_URL = 'https://4hdcocafy4.execute-api.ap-northeast-2.amazonaws.com/default';

export async function getNotices(filter: NoticeFilter): Promise<NoticeResponse> {
  const queryParams = new URLSearchParams({
    page: filter.page.toString(),
    limit: filter.limit.toString(),
    ...(filter.isProcessed !== undefined && { isProcessed: filter.isProcessed.toString() }),
    ...(filter.isUploaded !== undefined && { isUploaded: filter.isUploaded.toString() }),
    ...(filter.searchQuery && { search: filter.searchQuery }),
  });

  console.log('공지사항 조회 요청:', Object.fromEntries(queryParams.entries()));
  
  try {
    const response = await fetch(`/api/notices?${queryParams}`);
    const data = await response.json();
    
    console.log('공지사항 조회 응답:', data);

    if (!response.ok) {
      throw new Error(data.error || '공지사항을 불러오는데 실패했습니다.');
    }

    if (!data.notices || !Array.isArray(data.notices)) {
      console.error('잘못된 응답 형식:', data);
      throw new Error('서버에서 잘못된 형식의 데이터를 반환했습니다.');
    }

    return {
      notices: data.notices,
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
    };
  } catch (error) {
    console.error('공지사항 조회 중 에러 발생:', error);
    throw error;
  }
}

export async function processNotice(noticeId: string): Promise<Notice> {
  const response = await fetch(`/api/notices/process/${noticeId}`, {
    method: 'POST',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to process notice');
  }

  return data;
}

export async function uploadToSNS(noticeId: string): Promise<Notice> {
  const response = await fetch(`/api/notices/upload/${noticeId}`, {
    method: 'POST',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload to SNS');
  }

  return data;
} 