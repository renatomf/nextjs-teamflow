"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { ThreadReply } from "./ThreadReply";
import { ThreadReplyForm } from "./ThreadReplyForm";
import { useThread } from "@/providers/ThreadProvider";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { ThreadSidebarSkeleton } from "./ThreadSidebarSkeleton";
import { useEffect, useRef, useState } from "react";

interface Props {
  user: KindeUser<Record<string, unknown>>;
}

export function ThreadSidebar({ user }: Props) {
  const { selectedThreadId, closeThread } = useThread();
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastMessageCountRef = useRef(0);

  const { data, isLoading } = useQuery({
    ...orpc.message.thread.list.queryOptions({
      input: {
        messageId: selectedThreadId!,
      },
    }),
    enabled: Boolean(selectedThreadId),
  });

  const messages = data?.messages ?? [];
  const messageCount = messages.length;

  const isNearBottom = (el: HTMLDivElement) =>
    el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setIsAtBottom(isNearBottom(el));
  };

  // 1️⃣ Scroll inicial (quando thread abre)
  useEffect(() => {
    if (!hasInitialScrolled && data) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ block: "end" });
        setHasInitialScrolled(true);
        setIsAtBottom(true);
      });
    }
  }, [data, hasInitialScrolled]);

  // 2️⃣ Scroll automático quando chegam novas mensagens
  useEffect(() => {
    if (messageCount === 0) return;
    const prevMessageCount = lastMessageCountRef.current;
    const el = scrollRef.current;

    if (prevMessageCount > 0 && messageCount !== prevMessageCount) {
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
        });
        setIsAtBottom(true);
      }
    }

    lastMessageCountRef.current = messageCount;
  }, [messageCount]);

  // 3️⃣ Observadores (imagens, mutações, redimensionamento)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom || !hasInitialScrolled) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
        });
      }
    };

    const onImageLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        scrollToBottomIfNeeded();
      }
    };

    el.addEventListener("load", onImageLoad, true);

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfNeeded();
    });
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(() => {
      scrollToBottomIfNeeded();
    });
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      el.removeEventListener("load", onImageLoad, true);
    };
  }, [hasInitialScrolled, isAtBottom]);

  // 4️⃣ Scroll manual via botão
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    setIsAtBottom(true);
  };

  if (isLoading) {
    return <ThreadSidebarSkeleton />;
  }

  if (!data) return null;

  return (
    <div className="w-120 border-l flex flex-col h-full relative">
      {/* Header */}
      <div className="border-b h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4" />
          <span>Thread</span>
        </div>
        <Button variant="outline" size="icon" onClick={closeThread}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Conteúdo principal com scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative"
      >
        {/* Mensagem pai */}
        <div className="p-4 border-b bg-muted/20">
          <div className="flex items-center space-x-3">
            <Image
              src={data.parent.authorAvatar}
              alt="Author Image"
              width={32}
              height={32}
              className="size-8 rounded-full shrink-0"
            />
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {data.parent.authorName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    month: "short",
                    day: "numeric",
                  }).format(data.parent.createdAt)}
                </span>
              </div>
              <SafeContent
                className="text-sm wrap-break-word prose dark:prose-invert"
                content={JSON.parse(data.parent.content)}
              />
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="p-2">
          <p className="text-xs text-muted-foreground mb-3 px-2">
            {messages.length} replies
          </p>
          <div className="space-y-1">
            {messages.map((reply) => (
              <ThreadReply key={reply.id} message={reply} />
            ))}
          </div>
        </div>

        <div ref={bottomRef} className="pb-10" />

        {/* Botão flutuante de scroll */}
        {!isAtBottom && (
          <Button
            type="button"
            size="sm"
            className="absolute bottom-4 right-5 z-20 size-10 rounded-full hover:shadow-xl transition-all duration-200"
            onClick={scrollToBottom}
          >
            <ChevronDown className="size-4" />
          </Button>
        )}
      </div>

      {/* Formulário de reply */}
      <div className="border-t p-4">
        <ThreadReplyForm user={user} threadId={selectedThreadId!} />
      </div>
    </div>
  );
}
