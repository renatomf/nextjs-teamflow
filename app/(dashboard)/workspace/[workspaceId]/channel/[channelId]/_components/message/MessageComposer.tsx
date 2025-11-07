import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { ImageUploadModal } from "@/components/rich-text-editor/ImageUploadModal";
import { Button } from "@/components/ui/button";
import { useAttachmentUploadType } from "@/hooks/use-attachment-upload";
import { ImageIcon, Send } from "lucide-react";

interface Props {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  upload: useAttachmentUploadType;
}

export function MessageComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  upload,
}: Props) {
  return (
    <>
      <RichTextEditor
        field={{ value, onChange }}
        sendButton={
          <Button
            type="button"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            <Send className="size-4 mr-1" />
            Send
          </Button>
        }
        footerLeft={
          <Button
            onClick={() => upload.setIsOpen(true)}
            type="button"
            size="sm"
            variant="outline"
          >
            <ImageIcon className="size-4 mr-1" />
            Attach
          </Button>
        }
      />

      <ImageUploadModal open={upload.isOpen} onOpenChange={upload.setIsOpen} />
    </>
  );
}
