import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

interface ImageViewerModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
}

export function ImageViewerModal({ isOpen, onClose, imageUrl }: ImageViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <div className="relative w-full h-full min-h-[50vh]">
          <Image
            src={imageUrl}
            alt="공지사항 이미지"
            fill
            className="object-contain"
            sizes="(max-width: 90vw) 100vw, 90vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 