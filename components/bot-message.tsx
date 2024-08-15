// import { Bot } from 'lucide-react'
// import { Avatar } from '@/components/ui/avatar'
// import { ReactNode } from "react";

// export function BotMessage({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex items-start gap-4">
//       {/* <Avatar className="w-8 h-8">
//         <Bot width={32} height={32} />
//       </Avatar> */}
//       <div className="bg-muted rounded-lg p-3 max-w-[75%]">{children}</div>
//     </div>
//   );
// }

"use client";

import { MemoizedReactMarkdown } from "./ui/markdown";

// import "katex/dist/katex.min.css";

export function BotMessage({ content }: { content: string }) {
  // Check if the content contains LaTeX patterns
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    content || ""
  );

  // Modify the content to render LaTeX equations if LaTeX patterns are found
  const processedData = preprocessLaTeX(content || "");

  return (
    <MemoizedReactMarkdown className="prose-sm prose-neutral prose-a:text-accent-foreground/50">
      {content}
    </MemoizedReactMarkdown>
  );
}

// Preprocess LaTeX equations to be rendered by KaTeX
// ref: https://github.com/remarkjs/react-markdown/issues/785
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  );
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  );
  return inlineProcessedContent;
};
