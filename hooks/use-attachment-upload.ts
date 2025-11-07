"use client";

import { useCallback, useMemo, useState } from "react";

export function useAttachmentUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stageUrl, setStageUrl] = useState<null | string>(null);

  const onUploaded = useCallback((url: string) => {
    setStageUrl(url);
    setIsUploading(false);
    setIsOpen(false)
  }, []);

  const clear = useCallback(() => {
    setStageUrl(null);
    setIsUploading(false);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      onUploaded,
      stageUrl,
      isUploading,
      clear,
    }),
    [isOpen, setIsOpen, onUploaded, stageUrl, isUploading, clear]
  );
}

export type useAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
