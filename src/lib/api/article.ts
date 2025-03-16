export async function updateArticleStatus(id: string) {
  const response = await fetch('https://4hdcocafy4.execute-api.ap-northeast-2.amazonaws.com/default/article', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error('게시물 상태 업데이트에 실패했습니다.');
  }

  return response.json();
} 