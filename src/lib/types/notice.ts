export interface Notice {
  id: string;
  title: string;
  content: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  isProcessed: boolean;
  isUploaded: boolean;
  uploadStatus?: 'pending' | 'success' | 'failed';
  uploadedAt?: string;
  url: string;
}

export interface NoticeResponse {
  notices: Notice[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface NoticeFilter {
  page: number;
  limit: number;
  isProcessed?: boolean;
  isUploaded?: boolean;
  searchQuery?: string;
} 