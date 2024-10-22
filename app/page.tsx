import { Chat } from "@/components/chat";
import { generateId } from "ai";
import { AI } from "./action";

export const maxDuration = 60;

export default function Page() {
  const id = generateId();
  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat />
    </AI>
  );
}
