import React from "react";
import { User } from "lucide-react";
import { IconUser } from "@/components/ui/icons";

type UserMessageProps = {
  message: string;
  chatId?: string;
  showShare?: boolean;
};

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  chatId,
  showShare = false,
}) => {
  const enableShare = process.env.ENABLE_SHARE === "true";

  return (
    <div className="flex items-start w-full space-x-3 mt-2 min-h-10">
      <div className="flex-shrink-0">
        <IconUser className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="text-xl break-words w-full">{message}</div>
      </div>
    </div>
  );
};
/// WITHout USER ICON
// export const UserMessage: React.FC<UserMessageProps> = ({
//   message,
//   chatId,
//   showShare = false,
// }) => {
//   const enableShare = process.env.ENABLE_SHARE === "true";
//   return (
//     <div className="flex items-center w-full space-x-1 mt-2 min-h-10">
//       <div className="text-xl flex-1 break-words w-full">{message}</div>
//     </div>
//   );
// };
