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
    const data = await fetch(`${API_BASE_URL}/sns-getter-api`).then(res => res.json());
    console.log('공지사항 조회 응답:', data);

    return {
      notices: data.articles,
      total: data?.total || 0,
      page: data?.page || 1,
      totalPages: data?.totalPages || 1,
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