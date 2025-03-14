interface GenerateTextResponse {
  text: string;
}

export async function generateSNSText(noticeId: string): Promise<GenerateTextResponse> {
  const response = await fetch('/api/sns-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ noticeId }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate SNS text');
  }

  return response.json();
} 