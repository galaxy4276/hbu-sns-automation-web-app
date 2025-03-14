'use client';

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NoticeList } from '@/components/notices/NoticeList';
import { NoticeFilter } from '@/components/notices/NoticeFilter';
import { Pagination } from '@/components/common/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getNotices, processNotice, uploadToSNS } from '@/lib/api/notice';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function NoticesPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessed, setIsProcessed] = useState<boolean | undefined>();
  const [isUploaded, setIsUploaded] = useState<boolean | undefined>();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notices', page, searchQuery, isProcessed, isUploaded],
    queryFn: () =>
      getNotices({
        page,
        limit: 10,
        searchQuery,
        isProcessed,
        isUploaded,
      }),
  });

  const handleProcess = useCallback(async (selectedIds: string[]) => {
    try {
      await Promise.all(selectedIds.map(processNotice));
      toast.success('선택한 공지사항이 처리되었습니다.');
      refetch();
    } catch (error) {
      toast.error('공지사항 처리 중 오류가 발생했습니다.');
      console.error('Failed to process notices:', error);
    }
  }, [refetch]);

  const handleUpload = useCallback(async (selectedIds: string[]) => {
    try {
      await Promise.all(selectedIds.map(uploadToSNS));
      toast.success('선택한 공지사항이 SNS에 업로드되었습니다.');
      refetch();
    } catch (error) {
      toast.error('SNS 업로드 중 오류가 발생했습니다.');
      console.error('Failed to upload to SNS:', error);
    }
  }, [refetch]);

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>공지사항 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <NoticeFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isProcessed={isProcessed}
            onProcessedChange={setIsProcessed}
            isUploaded={isUploaded}
            onUploadedChange={setIsUploaded}
          />
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <NoticeList
                notices={data?.notices ?? []}
                onProcess={handleProcess}
                onUpload={handleUpload}
              />
              {data && (
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
} 