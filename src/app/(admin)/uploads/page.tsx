'use client';

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UploadList } from '@/components/uploads/UploadList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUploads, retryUpload } from '@/lib/api/upload';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/common/Pagination';

export default function UploadsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['uploads', page],
    queryFn: () =>
      getUploads({
        page,
        limit: 10,
      }),
  });

  const handleRetry = useCallback(async (uploadId: string) => {
    try {
      await retryUpload(uploadId);
      toast.success('업로드를 다시 시도합니다.');
      refetch();
    } catch (error) {
      toast.error('업로드 재시도 중 오류가 발생했습니다.');
      console.error('Failed to retry upload:', error);
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
          <CardTitle>업로드 내역</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <UploadList
                uploads={data?.uploads ?? []}
                onRetry={handleRetry}
              />
              {data && (
                <Pagination
                  currentPage={data.currentPage}
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