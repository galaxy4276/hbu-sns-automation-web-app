'use client';

import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NoticeList } from '@/components/notices/NoticeList';
import { NoticeFilter } from '@/components/notices/NoticeFilter';
import { Pagination } from '@/components/common/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNotices, restoreNotice, deleteNoticePermanently } from '@/lib/api/notice';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Notice, NoticeResponse } from '@/lib/types/notice';

export default function TrashPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const queryKey = ['notices', { 
    page, 
    searchQuery,
    type: 'trash'
  }];

  const { data, isLoading, error } = useQuery<NoticeResponse>({
    queryKey,
    queryFn: () =>
      getNotices({
        page,
        limit: 10,
        searchQuery,
        isDeleted: true,
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const updateLocalCache = (updatedNotices: Notice[]) => {
    queryClient.setQueryData<NoticeResponse>(queryKey, old => {
      if (!old) return old;
      return {
        ...old,
        notices: updatedNotices,
      };
    });
  };

  const handleRestore = useCallback(async (selectedIds: string[]) => {
    if (!data) return;

    try {
      // 즉시 UI 업데이트
      const updatedNotices = data.notices.filter(
        notice => !selectedIds.includes(notice.id)
      );
      updateLocalCache(updatedNotices);

      // API 호출
      await Promise.all(selectedIds.map(restoreNotice));
      toast.success('선택한 공지사항이 복원되었습니다.');

      // 메인 목록 쿼리 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['notices'],
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          const queryParams = query.queryKey[1] as { type: string };
          return queryKey === 'notices' && queryParams.type === 'main';
        }
      });
    } catch (error) {
      // 에러 발생 시 쿼리 무효화
      queryClient.invalidateQueries({ queryKey });
      toast.error('공지사항 복원 중 오류가 발생했습니다.');
      console.error('Failed to restore notices:', error);
    }
  }, [data, queryClient, queryKey]);

  const handleDelete = useCallback(async (selectedIds: string[]) => {
    if (!data) return;

    try {
      // 즉시 UI 업데이트
      const updatedNotices = data.notices.filter(
        notice => !selectedIds.includes(notice.id)
      );
      updateLocalCache(updatedNotices);

      // API 호출
      await Promise.all(selectedIds.map(deleteNoticePermanently));
      toast.success('선택한 공지사항이 영구 삭제되었습니다.');
    } catch (error) {
      // 에러 발생 시 쿼리 무효화
      queryClient.invalidateQueries({ queryKey });
      toast.error('공지사항 영구 삭제 중 오류가 발생했습니다.');
      console.error('Failed to permanently delete notices:', error);
    }
  }, [data, queryClient, queryKey]);

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
          <NoticeFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            hideProcessedFilter
            hideUploadedFilter
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
                onProcess={() => {}}
                onUpload={() => {}}
                onDelete={handleDelete}
                onRestore={handleRestore}
                isTrashPage
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