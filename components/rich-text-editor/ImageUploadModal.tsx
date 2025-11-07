import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImageUploadModal({
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
