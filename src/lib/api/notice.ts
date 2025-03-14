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

  const response = await fetch(`${API_BASE_URL}/sns-getter-api?${queryParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch notices');
  }

  return response.json();
}

export async function processNotice(noticeId: string): Promise<Notice> {
  const response = await fetch(`${API_BASE_URL}/process-notice/${noticeId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to process notice');
  }

  return response.json();
}

export async function uploadToSNS(noticeId: string): Promise<Notice> {
  const response = await fetch(`${API_BASE_URL}/upload-sns/${noticeId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to upload to SNS');
  }

  return response.json();
} 