interface GenerateTextResponse {
  text?: string;
  error?: string;
  details?: string;
}

export async function generateSNSText(noticeId: string): Promise<GenerateTextResponse> {
  const response = await fetch('/api/sns-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ noticeId }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate SNS text');
  }

  return data;
} 