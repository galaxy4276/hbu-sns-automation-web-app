'use client';

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
import { format, parseISO } from 'date-fns';
import { Trash2, RefreshCw } from 'lucide-react';

interface TrashListProps {
  notices: Notice[];
  onRestore: (selectedIds: string[]) => void;
  onDelete: (selectedIds: string[]) => void;
}

export function TrashList({ notices, onRestore, onDelete }: TrashListProps) {
  const [rowSelection, setRowSelection] = useState({});

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
      accessorKey: 'title',
      header: '제목',
    },
    {
      accessorKey: 'deletedAt',
      header: '삭제일',
      cell: ({ row }) => {
        const deletedAt = row.original.deletedAt;
        if (!deletedAt) return '-';
        try {
          return format(parseISO(deletedAt), 'yyyy-MM-dd HH:mm');
        } catch (error) {
          console.error('날짜 형식 오류:', error);
          return '-';
        }
      },
    },
    {
      accessorKey: 'daysUntilPermanentDelete',
      header: '영구 삭제까지',
      cell: ({ row }) => {
        const deletedAt = row.original.deletedAt;
        if (!deletedAt) return '-';
        try {
          const date = parseISO(deletedAt);
          const daysLeft = 14 - Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
          return daysLeft > 0 ? `${daysLeft}일` : '오늘 삭제';
        } catch (error) {
          console.error('날짜 계산 오류:', error);
          return '-';
        }
      },
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

  const getSelectedIds = useCallback(() => {
    return Object.keys(rowSelection).map(
      (index) => notices[parseInt(index)].id
    );
  }, [rowSelection, notices]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={() => onRestore(getSelectedIds())}
          variant="secondary"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          선택 항목 복구
        </Button>
        <Button
          onClick={() => onDelete(getSelectedIds())}
          variant="destructive"
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          영구 삭제
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
                  휴지통이 비어있습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 