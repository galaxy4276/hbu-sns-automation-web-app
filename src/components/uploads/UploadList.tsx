'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Upload } from '@/lib/types/upload';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, RotateCw } from 'lucide-react';

interface UploadListProps {
  uploads: Upload[];
  onRetry: (uploadId: string) => void;
}

export function UploadList({ uploads, onRetry }: UploadListProps) {
  const columns: ColumnDef<Upload>[] = [
    {
      accessorKey: 'noticeTitle',
      header: '공지사항 제목',
    },
    {
      accessorKey: 'platform',
      header: '플랫폼',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.platform}</span>
      ),
    },
    {
      accessorKey: 'uploadedAt',
      header: '업로드 시간',
      cell: ({ row }) => format(new Date(row.original.uploadedAt), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'success' ? 'default' : 'destructive'}
        >
          {row.original.status === 'success' ? '성공' : '실패'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.url && (
            <a
              href={row.original.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {row.original.status === 'failed' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRetry(row.original.id)}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: uploads,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                표시할 업로드 내역이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 