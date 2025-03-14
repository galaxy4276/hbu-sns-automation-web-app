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
  isDeleted: boolean;
  deletedAt?: string;
}

export interface NoticeFilter {
  page: number;
  limit: number;
  isProcessed?: boolean;
  isUploaded?: boolean;
  searchQuery?: string;
  isDeleted?: boolean;
}

export interface NoticeResponse {
  notices: Notice[];
  total: number;
  page: number;
  totalPages: number;
} 