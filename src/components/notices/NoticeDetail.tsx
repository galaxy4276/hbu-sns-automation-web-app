'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Notice } from '@/lib/types/notice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { generateSNSText } from '@/lib/api/gpt';
import { toast } from 'sonner';
import { Loader2, Wand2 } from 'lucide-react';

interface NoticeDetailProps {
  notice: Notice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoticeDetail({ notice, open, onOpenChange }: NoticeDetailProps) {
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  console.log('현재 공지사항:', notice);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      console.log('API 호출 시작:', notice.id);
      const response = await generateSNSText(notice.id);
      console.log('API 응답:', response);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setGeneratedText(response.text);
      toast.success('SNS 텍스트가 생성되었습니다.');
    } catch (error) {
      console.error('API 에러 상세:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      toast.error(`텍스트 생성 실패: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{notice.title}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>작성일: {format(new Date(notice.createdAt), 'yyyy-MM-dd')}</span>
            <Badge variant={notice.isProcessed ? 'default' : 'secondary'}>
              {notice.isProcessed ? '처리 완료' : '미처리'}
            </Badge>
            <Badge variant={notice.isUploaded ? 'default' : 'secondary'}>
              {notice.isUploaded ? '업로드 완료' : '미업로드'}
            </Badge>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          {notice.summary && (
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">요약</h3>
              <p className="whitespace-pre-wrap">{notice.summary}</p>
            </div>
          )}
          <div>
            <h3 className="mb-2 font-semibold">원문</h3>
            <div className="rounded-lg border p-4">
              <p className="whitespace-pre-wrap">{notice.content}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">SNS 텍스트</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                텍스트 생성
              </Button>
            </div>
            <Textarea
              value={generatedText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGeneratedText(e.target.value)}
              placeholder="SNS에 게시할 텍스트를 생성하거나 직접 입력하세요."
              className="min-h-[200px]"
            />
          </div>
          {notice.url && (
            <div>
              <h3 className="mb-2 font-semibold">원문 링크</h3>
              <a
                href={notice.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {notice.url}
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 