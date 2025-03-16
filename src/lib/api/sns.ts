async function uploadImageToS3(imageData: string): Promise<string> {
  const formData = new FormData();
  formData.append('image', imageData);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.url;
}

export async function publishToSNS(imageData: string, link: string) {
  try {
    // 먼저 이미지를 S3에 업로드
    const imageUrl = await uploadImageToS3(imageData);
    // SNS 게시 API 호출
    const payload = {
      image: imageUrl, // S3 URL 전달
      link: link,
    };

    const response = await fetch('https://4hdcocafy4.execute-api.ap-northeast-2.amazonaws.com/default/publish', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to publish to SNS');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('SNS 배포 중 오류 발생:', error);
    throw error;
  }
} 