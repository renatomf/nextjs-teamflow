"use client";

import { useMemo, useState } from "react";

export function useAttachmentUpload() {
  const [isOpen, setIsOpen] = useState(false);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
    }),
    [isOpen, setIsOpen]
  );
}

export type useAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
