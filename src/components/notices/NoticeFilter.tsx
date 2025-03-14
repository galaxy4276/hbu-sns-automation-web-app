import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NoticeFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isProcessed?: boolean;
  onProcessedChange: (value: boolean | undefined) => void;
  isUploaded?: boolean;
  onUploadedChange: (value: boolean | undefined) => void;
}

export function NoticeFilter({
  searchQuery,
  onSearchChange,
  isProcessed,
  onProcessedChange,
  isUploaded,
  onUploadedChange,
}: NoticeFilterProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="search">검색</Label>
          <Input
            id="search"
            placeholder="공지사항 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>처리 상태</Label>
          <Select
            value={isProcessed?.toString() ?? 'all'}
            onValueChange={(value) =>
              onProcessedChange(value === 'all' ? undefined : value === 'true')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="처리 상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="true">처리 완료</SelectItem>
              <SelectItem value="false">미처리</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>업로드 상태</Label>
          <Select
            value={isUploaded?.toString() ?? 'all'}
            onValueChange={(value) =>
              onUploadedChange(value === 'all' ? undefined : value === 'true')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="업로드 상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="true">업로드 완료</SelectItem>
              <SelectItem value="false">미업로드</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 