import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://4hdcocafy4.execute-api.ap-northeast-2.amazonaws.com/default';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = Array.from(searchParams.entries())
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    console.log('API 요청 URL:', `${API_BASE_URL}/sns-getter-api?${queryString}`);
    console.log('요청 파라미터:', Object.fromEntries(searchParams.entries()));
    
    const response = await fetch(
      `${API_BASE_URL}/sns-getter-api?${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const data = await response.json();
    console.log('원본 API 응답:', data);

    if (!response.ok) {
      console.error('API 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      throw new Error(`API 에러: ${response.status} - ${JSON.stringify(data)}`);
    }

    // 응답 데이터 검증
    if (!data.notices || !Array.isArray(data.notices)) {
      console.error('잘못된 API 응답 형식:', data);
      throw new Error('서버에서 잘못된 형식의 데이터를 반환했습니다.');
    }

    return NextResponse.json({
      notices: data.notices,
      total: data.total || data.totalCount || 0,
      page: data.page || data.currentPage || 1,
      totalPages: data.totalPages || Math.ceil((data.total || data.totalCount || 0) / 10),
    });
  } catch (error) {
    console.error('공지사항 조회 에러:', error);
    return NextResponse.json(
      { 
        error: '공지사항을 불러오는 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 