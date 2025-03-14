'use client';

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { TrashList } from '@/components/notices/TrashList';
import { getNotices, restoreFromTrash, deletePermantly } from '@/lib/api/notice';
import { Pagination } from '@/components/common/Pagination';

export default function TrashPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['trash', page],
    queryFn: () =>
      getNotices({
        page,
        limit: 10,
        isDeleted: true,
      }),
  });

  const handleRestore = useCallback(async (selectedIds: string[]) => {
    try {
      if (selectedIds.length === 0) {
        toast.error('복구할 공지사항을 선택해주세요.');
        return;
      }

      await restoreFromTrash(selectedIds);
      toast.success('선택한 공지사항이 복구되었습니다.');
      refetch();
    } catch (error) {
      toast.error('공지사항 복구 중 오류가 발생했습니다.');
      console.error('Failed to restore notices:', error);
    }
  }, [refetch]);

  const handleDelete = useCallback(async (selectedIds: string[]) => {
    try {
      if (selectedIds.length === 0) {
        toast.error('삭제할 공지사항을 선택해주세요.');
        return;
      }

      if (!window.confirm('선택한 공지사항을 영구적으로 삭제하시겠습니까?')) {
        return;
      }

      await deletePermantly(selectedIds);
      toast.success('선택한 공지사항이 영구적으로 삭제되었습니다.');
      refetch();
    } catch (error) {
      toast.error('공지사항 삭제 중 오류가 발생했습니다.');
      console.error('Failed to delete notices:', error);
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
          <CardTitle>휴지통</CardTitle>
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
              <TrashList
                notices={data?.notices ?? []}
                onRestore={handleRestore}
                onDelete={handleDelete}
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