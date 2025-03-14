"use client"

import { useCallback, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Notice } from '@/lib/types/notice';
import { format } from 'date-fns';
import { NoticeDetail } from './NoticeDetail';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { ImageViewerModal } from '@/components/ImageViewerModal';

interface NoticeListProps {
  notices: Notice[];
  onProcess: (selectedIds: string[]) => void;
  onUpload: (selectedIds: string[]) => void;
}

export function NoticeList({ notices, onProcess, onUpload }: NoticeListProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const columns: ColumnDef<Notice>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="모두 선택"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="행 선택"
        />
      ),
    },
    {
      accessorKey: 'imageUrl',
      header: '이미지',
      cell: ({ row }) => (
        <div className="relative h-16 w-16 cursor-pointer" onClick={() => setSelectedImageUrl(row.original.imageUrl)}>
          <Image
            src={row.original.imageUrl}
            alt={row.original.title}
            fill
            className="object-cover rounded"
          />
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: '제목',
    },
    {
      accessorKey: 'createdAt',
      header: '작성일',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'yyyy-MM-dd'),
    },
    {
      accessorKey: 'isProcessed',
      header: '처리 상태',
      cell: ({ row }) => (
        <span className={row.original.isProcessed ? 'text-green-600' : 'text-yellow-600'}>
          {row.original.isProcessed ? '처리 완료' : '미처리'}
        </span>
      ),
    },
    {
      accessorKey: 'isUploaded',
      header: '업로드 상태',
      cell: ({ row }) => (
        <span className={row.original.isUploaded ? 'text-green-600' : 'text-gray-600'}>
          {row.original.isUploaded ? '업로드 완료' : '미업로드'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedNotice(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: notices,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleProcess = useCallback(() => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => notices[parseInt(index)].id
    );
    onProcess(selectedIds);
  }, [rowSelection, notices, onProcess]);

  const handleUpload = useCallback(() => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => notices[parseInt(index)].id
    );
    onUpload(selectedIds);
  }, [rowSelection, notices, onUpload]);

  const handleSelectAll = () => {
    if (Object.keys(rowSelection).length === notices.length) {
      setRowSelection({});
    } else {
      const newSelection = notices.map((notice) => notice.id);
      setRowSelection({ ...newSelection.reduce((acc, id) => ({ ...acc, [id]: true }), {}) });
    }
  };

  const handleSelect = (id: string) => {
    if (rowSelection[id]) {
      const newSelection = { ...rowSelection };
      delete newSelection[id];
      setRowSelection(newSelection);
    } else {
      setRowSelection({ ...rowSelection, [id]: true });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleProcess}>선택 항목 처리</Button>
        <Button onClick={handleUpload} variant="secondary">
          선택 항목 업로드
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  표시할 공지사항이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedNotice && (
        <NoticeDetail
          notice={selectedNotice}
          open={!!selectedNotice}
          onOpenChange={(open) => !open && setSelectedNotice(null)}
        />
      )}
      <ImageViewerModal
        isOpen={!!selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
        imageUrl={selectedImageUrl ?? ''}
      />
    </div>
  );
} 