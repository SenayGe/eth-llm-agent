import { createStreamableUI, createStreamableValue } from "ai/rsc";
import {
  CoreMessage,
  ToolCallPart,
  ToolResultPart,
  streamText,
  streamObject,
} from "ai";
import { getTools } from "./tools";
import { getModel, transformToolMessages } from "../utils";
// import { AnswerSection } from "@/components/answer-section";
import { openai } from "@ai-sdk/openai";
import { BotMessage } from "@/components/bot-message";
import { AnswerSection } from "@/components/answer-section";

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  streamableText: ReturnType<typeof createStreamableValue<string>>,
  messages: CoreMessage[]
) {
  let fullResponse = "";
  let hasError = false;
  let finishReason = "";

  console.log("researcher at workkkkkkkkk");

  // Transform the messages if using Ollama provider
  let processedMessages = messages;
  const includeToolResponses = messages.some(
    (message) => message.role === "tool"
  );

  const streamableAnswer = createStreamableValue<string>("");
  const answerSection = <AnswerSection result={streamableAnswer.value} />;
  // const answerSection = (
  //   <BotMessage>this is supposed to be an asnwer sectionnnn</BotMessage>
  // );

  console.log("before resullttt");
  const currentDate = new Date().toLocaleString();
  const result = await streamText({
    model: getModel(),
    maxTokens: 2500,
    system: `You are an advanced AI agent designed to perform blockchain exploration tasks. Your primary function is to interact with blockchain networks, retrieve and analyze on-chain data, and provide users with detailed information about accounts, transactions, smart contracts, and network statistics.
    Always use the provided functions to interact with the blockchain. Do not attempt to access blockchain data through other means.
    Verify the network and address format before executing queries.
    Provide clear, concise responses with the option to expand on details if requested.
    If user querries are unlear or are missing information, ask for clarification and for any missing information.
    `,
    messages: processedMessages,
    tools: getTools({
      uiStream,
      fullResponse,
    }),
    onFinish: async (event) => {
      finishReason = event.finishReason;
      fullResponse = event.text;
      streamableAnswer.done();
    },
  }).catch((err) => {
    hasError = true;
    fullResponse = "Error: " + err.message;
    console.log(fullResponse); //TODO: remove this console.log
    streamableText.update(fullResponse);
  });

  // If the result is not available, return an error response
  if (!result) {
    return { result, fullResponse, hasError, toolResponses: [] };
  }

  const hasToolResult = messages.some((message) => message.role === "tool");
  if (hasToolResult) {
    console.log("hasToolResult indeeeeeeeeeeed");
    uiStream.append(answerSection);
  }

  // Process the response
  const toolCalls: ToolCallPart[] = [];
  const toolResponses: ToolResultPart[] = [];
  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case "text-delta":
        if (delta.textDelta) {
          fullResponse += delta.textDelta;
          streamableAnswer.update(fullResponse);
        }
        break;
      case "tool-call":
        toolCalls.push(delta);
        break;
      case "tool-result":
        if (!delta.result) {
          hasError = true;
          console.log("Error: Tool result is undefined", delta);
        }
        toolResponses.push(delta);
        break;
      case "error":
        console.log("Error: " + delta.error);
        hasError = true;
        fullResponse += `\nError occurred while executing the tool`;
        break;
    }
  }

  console.log("afterr resullttt");
  console.log("fullResponse", fullResponse);
  messages.push({
    role: "assistant",
    content: [{ type: "text", text: fullResponse }, ...toolCalls],
  });

  if (toolResponses.length > 0) {
    // Add tool responses to the messages
    messages.push({ role: "tool", content: toolResponses });
  }

  return { result, fullResponse, hasError, toolResponses, finishReason };
}
