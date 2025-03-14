import { Notice, NoticeFilter, NoticeResponse } from '../types/notice';

const API_BASE_URL = 'https://4hdcocafy4.execute-api.ap-northeast-2.amazonaws.com/default';

export async function getNotices(filter: NoticeFilter): Promise<NoticeResponse> {
  const queryParams = new URLSearchParams({
    page: filter.page.toString(),
    limit: filter.limit.toString(),
    ...(filter.isProcessed !== undefined && { isProcessed: filter.isProcessed.toString() }),
    ...(filter.isUploaded !== undefined && { isUploaded: filter.isUploaded.toString() }),
    ...(filter.searchQuery && { search: filter.searchQuery }),
    ...(filter.isDeleted !== undefined && { isDeleted: filter.isDeleted.toString() }),
  });

  console.log('공지사항 조회 요청:', Object.fromEntries(queryParams.entries()));
  
  try {
    const response = await fetch(`${API_BASE_URL}/sns-getter-api?${queryParams}`);
    if (!response.ok) {
      throw new Error('공지사항 조회에 실패했습니다.');
    }
    const data = await response.json();
    console.log('공지사항 조회 응답:', data);

    return {
      notices: data.articles.filter((article: Notice) => 
        filter.isDeleted ? article.isDeleted : !article.isDeleted
      ),
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

export async function moveToTrash(noticeIds: string[]): Promise<void> {
  console.log('휴지통 이동 요청:', { noticeIds });
  
  try {
    if (!noticeIds || noticeIds.length === 0) {
      throw new Error('선택된 공지사항이 없습니다.');
    }

    const response = await fetch(`${API_BASE_URL}/sns-getter-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'moveToTrash',
        noticeIds,
        isDeleted: true,
        deletedAt: new Date().toISOString()
      }),
    });

    const data = await response.json();
    console.log('휴지통 이동 응답:', data);

    if (!response.ok) {
      throw new Error(data.error || '공지사항을 휴지통으로 이동하는데 실패했습니다.');
    }
  } catch (error) {
    console.error('휴지통 이동 중 에러:', error);
    throw error;
  }
}

export async function restoreFromTrash(noticeIds: string[]): Promise<void> {
  console.log('휴지통에서 복구 요청:', { noticeIds });
  
  try {
    const response = await fetch(`${API_BASE_URL}/sns-getter-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'restoreFromTrash',
        noticeIds 
      }),
    });

    const data = await response.json();
    console.log('휴지통에서 복구 응답:', data);

    if (!response.ok) {
      throw new Error(data.error || '공지사항 복구에 실패했습니다.');
    }
  } catch (error) {
    console.error('복구 중 에러:', error);
    throw error;
  }
}

export async function deletePermantly(noticeIds: string[]): Promise<void> {
  console.log('영구 삭제 요청:', { noticeIds });
  
  try {
    const response = await fetch(`${API_BASE_URL}/sns-getter-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'deletePermantly',
        noticeIds 
      }),
    });

    const data = await response.json();
    console.log('영구 삭제 응답:', data);

    if (!response.ok) {
      throw new Error(data.error || '공지사항 영구 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('영구 삭제 중 에러:', error);
    throw error;
  }
} 