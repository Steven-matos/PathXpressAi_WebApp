import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { useTranslation } from '@/context/TranslationContext';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  type: 'terms' | 'privacy';
  content: string;
  closeOnOutsideClick?: boolean;
}

export function PolicyModal({
  isOpen,
  onClose,
  onAccept,
  type,
  content,
  closeOnOutsideClick = false,
}: PolicyModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !closeOnOutsideClick) {
        return;
      }
      onClose();
    }}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {type === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button onClick={onAccept}>
            I Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 