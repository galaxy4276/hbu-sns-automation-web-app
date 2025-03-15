interface GenerateTextResponse {
  text?: string;
  error?: string;
  details?: string;
}

export async function generateSNSText(message: string): Promise<string> {
  try {
    const response = await fetch('https://4hdcocafy4.execute-api.ap-northeast-2.amazonaws.com/default/sns-text-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('Failed to generate SNS text');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error generating SNS text:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 