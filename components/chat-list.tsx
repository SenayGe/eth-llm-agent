"use client";

import { StreamableValue } from "ai/rsc";
import type { UIState } from "@/app/action";
import { Separator } from "@/components/ui/separator";

interface ChatMessagesProps {
  messages: UIState;
}

export function ChatList({ messages }: ChatMessagesProps) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index} className="pb-4">
          {message.component}
          {index < messages.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  );
}
