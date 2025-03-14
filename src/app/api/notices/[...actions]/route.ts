import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://4hdcocafy4.execute-api.ap-northeast-2.amazonaws.com/default';

export async function POST(
  request: Request,
  { params }: { params: { actions: string[] } }
) {
  try {
    const action = params.actions[0];
    const noticeId = params.actions[1];
    
    console.log('API 요청:', { action, noticeId });
    
    let endpoint = '';
    switch (action) {
      case 'process':
        endpoint = `/process-notice/${noticeId}`;
        break;
      case 'upload':
        endpoint = `/upload-sns/${noticeId}`;
        break;
      default:
        throw new Error('Invalid action');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('API 응답:', data);

    if (!response.ok) {
      throw new Error(`API 에러: ${response.status}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json(
      { error: '요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 