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
import { useState, useRef, useEffect } from 'react';
import { generateSNSText } from '@/lib/api/gpt';
import { toast } from 'sonner';
import { Loader2, Wand2, ImageIcon, Download, Copy, Check } from 'lucide-react';
import Image from 'next/image';

interface NoticeDetailProps {
  notice: Notice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoticeDetail({ notice, open, onOpenChange }: NoticeDetailProps) {
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  console.log('현재 공지사항:', notice);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      console.log('API 호출 시작:', notice.id);
      const generatedText = await generateSNSText(notice.content);
      console.log('API 응답:', generatedText);
      
      setGeneratedText(generatedText);
      toast.success('SNS 텍스트가 생성되었습니다.');
    } catch (error) {
      console.error('API 에러 상세:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      toast.error(`텍스트 생성 실패: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 텍스트 전처리 함수 추가
  const preprocessText = (text: string, maxCharsPerLine: number = 30): string[] => {
    const rawLines = text.replaceAll('*', '').split('\n');
    const processedLines: string[] = [];
    
    rawLines.forEach(line => {
      if (line.trim() === '') {
        processedLines.push(line);
        return;
      }

      const words = line.split(' ');
      let currentLine = '';

      words.forEach(word => {
        // 현재 줄 + 새 단어의 길이가 maxCharsPerLine을 초과하는지 확인
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        
        if (testLine.replace(/\(#[a-zA-Z0-9]{5,7}\)/g, '').length <= maxCharsPerLine) {
          // 현재 줄에 단어 추가
          currentLine = testLine;
        } else {
          // 현재 줄이 있으면 추가하고 새 줄 시작
          if (currentLine) {
            processedLines.push(currentLine);
          }
          currentLine = word;
        }
      });

      // 마지막 줄 추가
      if (currentLine) {
        processedLines.push(currentLine);
      }
    });

    return processedLines;
  };

  const generateStoryImage = () => {
    if (!canvasRef.current || !generatedText) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = 1080;
    canvas.height = 1350;

    // 배경 설정
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 기본 텍스트 스타일 설정
    ctx.font = 'bold 40px Recipekorea';
    ctx.textAlign = 'center';
    
    // 텍스트 전처리
    const lines = preprocessText(generatedText);
    const lineHeight = 60;
    const startY = (canvas.height - (lines.length * lineHeight)) / 2;

    // 각 줄 처리
    lines.forEach((line: string, index: number) => {
      const words = line.split(' ');
      let currentX = canvas.width / 2;

      // 전체 라인의 너비 계산 (컬러 태그 제외)
      const cleanLine = words.map(word => word.replace(/\(#[A-Fa-f0-9]{6}\)/, '')).join(' ');
      const lineWidth = ctx.measureText(cleanLine).width;
      let xOffset = -lineWidth / 2;

      words.forEach((word) => {
        // 색상 코드 매칭 패턴 수정 (5-7자리 허용)
        const colorMatch = word.match(/\(#[a-zA-Z0-9]{5,7}\)/);
        const cleanWord = word.replace(/\(#[a-zA-Z0-9]{5,7}\)/, '');
        
        // 단어 너비 계산 (컬러 태그 제외)
        const wordWidth = ctx.measureText(cleanWord).width;
        const spaceWidth = ctx.measureText(' ').width;

        // 색상 코드 처리 개선
        let color = 'black';
        if (colorMatch) {
          const colorCode = colorMatch[0].replace('(', '').replace(')', '');
          // 색상 코드 정규화 (6자리로 만들기)
          if (colorCode.length === 7) {
            color = colorCode.slice(0, 7); // 7자리면 그대로 사용
          } else if (colorCode.length === 5) {
            color = `${colorCode}${colorCode.slice(-1)}`; // 5자리면 마지막 숫자 반복
          } else {
            color = colorCode; // 6자리는 그대로 사용
          }
        }
        // console.log({ color, colorMatch, cleanWord, wordWidth, spaceWidth });

        // 색상 적용
        ctx.fillStyle = color;
        ctx.fillText(cleanWord, currentX + xOffset + (wordWidth / 2), startY + (index * lineHeight));

        // 다음 단어의 위치로 이동
        xOffset += wordWidth + spaceWidth;
      });
    });

    // 캔버스를 이미지로 변환
    const imageUrl = canvas.toDataURL('image/png');
    setStoryImage(imageUrl);
  };

  // 링크 복사 함수 추가
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(notice.originUrl);
      setCopied(true);
      toast.success('링크가 복사되었습니다.');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('링크 복사에 실패했습니다.');
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
          {/* 원본 링크 섹션 추가 */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">원본 링크</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? '복사됨' : '복사'}
              </Button>
            </div>
            <a
              href={notice.originUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 block truncate"
            >
              {'원본 공지사항 가기' || '링크를 찾지 못함'}
            </a>
          </div>

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
              <div className="flex gap-2">
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
                {generatedText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateStoryImage}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    스토리 이미지 생성
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
              placeholder="SNS에 게시할 텍스트를 생성하거나 직접 입력하세요."
              className="min-h-[200px]"
            />
            
            {/* 숨겨진 캔버스 */}
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />

            {/* 생성된 이미지 미리보기 */}
            {storyImage && (
              <div className="space-y-2">
                <h3 className="font-semibold">생성된 스토리 이미지</h3>
                <div className="relative w-full max-w-md mx-auto border rounded-lg overflow-hidden">
                  <Image
                    src={storyImage}
                    alt="생성된 스토리 이미지"
                    width={1080}
                    height={1350}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = storyImage;
                      link.download = 'story-image.png';
                      link.click();
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    이미지 다운로드
                  </Button>
                </div>
              </div>
            )}
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