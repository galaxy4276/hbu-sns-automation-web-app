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
  console.log('공지사항 처리 요청:', { noticeId });
  
  try {
    const response = await fetch(`${API_BASE_URL}/process-notice/${noticeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('공지사항 처리 응답:', data);

    if (!response.ok) {
      throw new Error(data.error || '공지사항 처리에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('공지사항 처리 중 에러 발생:', error);
    throw new Error('공지사항 처리 중 오류가 발생했습니다.');
  }
}

export async function uploadToSNS(noticeId: string): Promise<Notice> {
  console.log('SNS 업로드 요청:', { noticeId });
  
  try {
    const response = await fetch(`${API_BASE_URL}/upload-sns/${noticeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('SNS 업로드 응답:', data);

    if (!response.ok) {
      throw new Error(data.error || 'SNS 업로드에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('SNS 업로드 중 에러 발생:', error);
    throw new Error('SNS 업로드 중 오류가 발생했습니다.');
  }
} 