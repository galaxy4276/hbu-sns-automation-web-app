export interface Notice {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  uploaded: boolean;
}

export interface NoticeFilter {
  page: number;
  limit: number;
  isProcessed?: boolean;
  isUploaded?: boolean;
  searchQuery?: string;
}

export interface NoticeResponse {
  notices: Notice[];
  total: number;
  page: number;
  totalPages: number;
} 