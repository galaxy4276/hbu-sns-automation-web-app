import { Upload, UploadFilter, UploadResponse } from '../types/upload';

const API_BASE_URL = 'https://4hdcocafy4.execute-api.ap-northeast-2.amazonaws.com/default';

export async function getUploads(filter: UploadFilter): Promise<UploadResponse> {
  const queryParams = new URLSearchParams({
    page: filter.page.toString(),
    limit: filter.limit.toString(),
    ...(filter.status && { status: filter.status }),
    ...(filter.platform && { platform: filter.platform }),
    ...(filter.searchQuery && { search: filter.searchQuery }),
  });

  const response = await fetch(`${API_BASE_URL}/uploads?${queryParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch uploads');
  }

  return response.json();
}

export async function retryUpload(uploadId: string): Promise<Upload> {
  const response = await fetch(`${API_BASE_URL}/uploads/${uploadId}/retry`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to retry upload');
  }

  return response.json();
} 