export interface Upload {
  id: string;
  noticeId: string;
  noticeTitle: string;
  uploadedAt: string;
  status: 'success' | 'failed';
  platform: 'instagram' | 'facebook';
  errorMessage?: string;
  url?: string;
}

export interface UploadResponse {
  uploads: Upload[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface UploadFilter {
  page: number;
  limit: number;
  status?: 'success' | 'failed';
  platform?: 'instagram' | 'facebook';
  searchQuery?: string;
} 