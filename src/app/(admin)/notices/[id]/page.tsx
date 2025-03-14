"use client"

import { useEffect, useState } from "react"
import { getNoticeById } from "@/lib/api/notice"
import { Notice } from "@/lib/types/notice"
import Image from "next/image"
import { ImageViewerModal } from "@/components/ImageViewerModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NoticePage({ params }: { params: { id: string } }) {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)

  useEffect(() => {
    const fetchNotice = async () => {
      const data = await getNoticeById(params.id)
      setNotice(data)
    }
    fetchNotice()
  }, [params.id])

  if (!notice) return <div>로딩중...</div>

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{notice.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p>{notice.content}</p>
            </div>
            
            {notice.imageUrl && (
              <div className="space-y-2">
                <div className="relative w-48 h-48">
                  <Image
                    src={notice.imageUrl}
                    alt="공지사항 썸네일"
                    fill
                    className="object-cover rounded-lg cursor-pointer"
                    onClick={() => setIsImageViewerOpen(true)}
                  />
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setIsImageViewerOpen(true)}
                >
                  이미지 크게 보기
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {notice.imageUrl && (
        <ImageViewerModal
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
          imageUrl={notice.imageUrl}
        />
      )}
    </div>
  )
} 