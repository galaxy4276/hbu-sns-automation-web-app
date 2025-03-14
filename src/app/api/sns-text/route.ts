import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://4hdcocafy4.execute-api.ap-northeast-2.amazonaws.com/default';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('요청 데이터:', body);
    
    const response = await fetch(`${API_BASE_URL}/sns-text-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();
    console.log('API 응답:', responseData);

    if (!response.ok) {
      throw new Error(`API 에러: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('상세 에러:', error);
    return NextResponse.json(
      { 
        error: '텍스트 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 