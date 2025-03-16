import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/utils/s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as string;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // S3에 이미지 업로드
    const imageUrl = await uploadToS3(image);

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 