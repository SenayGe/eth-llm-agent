// import "server-only";

// import {
//   StreamableValue,
//   createAI,
//   createStreamableUI,
//   createStreamableValue,
//   getAIState,
//   getMutableAIState,
// } from "ai/rsc";
// import { CoreMessage, generateId, ToolResultPart } from "ai";
// import OpenAI from "openai";

// import {
//   spinner,
//   BotCard,
//   BotMessage,
//   SystemMessage,
//   Stock,
//   Purchase,
//   Stocks,
//   Events,
// } from "@/components/llm-stocks";
// import { Pacman } from "@/components/pacman";
// import { Confetti } from "@/components/confetti";

// import { runAsyncFnWithoutBlocking, sleep, formatNumber } from "@/lib/utils";
// import { z } from "zod";
// import { StockSkeleton } from "@/components/llm-stocks/stock-skeleton";
// import { EventsSkeleton } from "@/components/llm-stocks/events-skeleton";
// import { StocksSkeleton } from "@/components/llm-stocks/stocks-skeleton";
// // import { messageRateLimit } from "@/lib/rate-limit";
// import { headers } from "next/headers";
// import { tools } from "../lib/tools";
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || "",
// });

// async function submitUserMessage(content: string) {
//   "use server";

//   // const reply = createStreamableUI(
//   //   <BotMessage className="items-center">{spinner}</BotMessage>
//   // );
//   const aiState = getMutableAIState<typeof AI>();
//   const uiStream = createStreamableUI();

//   // const messages: CoreMessage[] = aiMessages
//   //   .filter(
//   //     (message) =>
//   //       message.role !== "tool" &&
//   //       message.type !== "followup" &&
//   //       message.type !== "related" &&
//   //       message.type !== "end"
//   //   )
//   //   .map((message) => {
//   //     const { role, content } = message;
//   //     return { role, content } as CoreMessage;
//   //   });

//   aiState.update([
//     ...aiState.get(),
//     {
//       role: "user",
//       content,
//     },
//   ]);

//   const initialResponse = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: `\
//       You are a stock trading conversation bot and you can help users buy stocks, step by step.
//       You and the user can discuss stock prices and the user can adjust the amount of stocks they want to buy, or place an order, in the UI.

//       Messages inside [] means that it's a UI element or a user event. For example:
//       - "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
//       - "[User has changed the amount of AAPL to 10]" means that the user has changed the amount of AAPL to 10 in the UI.

//       If the user requests purchasing a stock, call \`show_stock_purchase_ui\` to show the purchase UI.
//       If the user just wants the price, call \`show_stock_price\` to show the price.
//       If you want to show trending stocks, call \`list_stocks\`.
//       If you want to show events, call \`get_events\`.
//       If the user wants to sell stock, or complete another impossible task, respond that you are a demo and cannot do that.

//       Besides that, you can also chat with users and do some calculations if needed.`,
//       },
//       ...aiState.get().messages.map((message: any) => ({
//         role: message.role,
//         content: message.content,
//         name: message.name,
//       })),
//     ],
//     tools: tools,
//   });
//   console.log(
//     `initialResponseeeeeeeee: ${initialResponse.choices[0].message.content}`
//   );

//   consumeStream(
//     OpenAIStream(initialResponse as any, {
//       experimental_onToolCall: async (
//         call: ToolCall,
//         appendToolCallMessage
//       ) => {
//         console.log(`openaistreeeaaammm`);
//         let handledTools = false;
//         console.log(`toolsssss: ${call.tools}`);
//         for (const tool of call.tools) {
//           console.log(`Tool called: ${tool}`);
//           if (tool.func.name === "show_stock_price") {
//             // Call a weather API here
//             // data.append({
//             //   text: 'Some custom data'
//             // })

//             console.log(`Tool argumentsss: ${tool.func.arguments}`);

//             const symbol = tool.func.arguments[0] as string;
//             const price = parseFloat(tool.func.arguments[1] as string);
//             const delta = parseFloat(tool.func.arguments[2] as string);

//             reply.append(
//               <BotCard>
//                 <StockSkeleton />
//               </BotCard>
//             );

//             reply.done(
//               <BotCard>
//                 <Stock name={symbol} price={price} delta={delta} />
//               </BotCard>
//             );

//             // aiState.done([
//             //   ...aiState.get(),
//             //   {
//             //     role: 'function',
//             //     name: 'show_stock_price',
//             //     content: `[Price of ${symbol} = ${price}]`
//             //   }
//             // ])

//             aiState.done([
//               ...aiState.get(),

//               {
//                 id: tool.id,
//                 role: "function",
//                 name: "show_stock_price",
//                 content: `[Price of ${symbol} = ${price}]`,
//               },
//             ]);
//             // return {
//             //   role: "function",
//             //   name: "show_stock_price",
//             //   content: `[Price of ${symbol} = ${20}]`,
//             // };
//           }
//           handledTools = true;
//           // appendToolCallMessage({
//           //   tool_call_id: tool.id,
//           //   function_name: tool.func.name,
//           //   tool_call_result: weatherData
//           // })
//         }
//         if (handledTools) {
//           // const newMessages = appendToolCallMessage()
//           // return openai.chat.completions.create({
//           //   messages: [...messages, ...newMessages],
//           //   model,
//           //   stream: true,
//           //   tools,
//           //   tool_choice: 'auto'
//           // })
//           console.log(`Tool handled`);
//         }
//       },
//       onCompletion(completion) {
//         console.log(`completionnnnn: ${completion}`);
//       },
//     })
//   );
//   return {
//     id: Date.now(),
//     display: reply.value,
//   };
// }

// // Define necessary types and create the AI.

// const initialAIState: {
//   role: "user" | "assistant" | "system" | "function";
//   content: string;
//   id?: string;
//   name?: string;
// }[] = [];

// const initialUIState: {
//   id: number;
//   display: React.ReactNode;
// }[] = [];

// export const AI = createAI({
//   actions: {
//     submitUserMessage,
//     // confirmPurchase,
//   },
//   initialUIState,
//   initialAIState,
// });

// /*From MORPIC */
// // export type AIState = {
// //   messages: AIMessage[];
// //   chatId: string;
// //   isSharePage?: boolean;
// // };

// // export type UIState = {
// //   id: string;
// //   component: React.ReactNode;
// //   isGenerating?: StreamableValue<boolean>;
// //   isCollapsed?: StreamableValue<boolean>;
// // }[];
// // const initialAIState: AIState = {
// //   chatId: generateId(),
// //   messages: [],
// // };

// // const initialUIState: UIState = [];

// // export const AI = createAI({
// //   actions: {
// //     submitUserMessage,
// //     // confirmPurchase,
// //   },
// //   initialUIState,
// //   initialAIState,
// // });

import {
  StreamableValue,
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
} from "ai/rsc";
import { CoreMessage, generateId, ToolResultPart } from "ai";
import { Spinner } from "@/components/ui/spinner";
import { researcher } from "@/lib/agents/chain-explorer";
import { Chat } from "@/lib/types";
import { AIMessage } from "@/lib/types";
import { UserMessage } from "@/components/user-message";
import { AnswerSection } from "@/components/answer-section";
import { AccountBalanace } from "@/components/account-balance";
import { ErrorCard } from "@/components/error-card";
import RecentTransactions from "@/components/transactions-list";
import TransactionsSummary from "@/components/transaction-summary";
import TransactionDetails from "@/components/tx-details";

async function submit(
  userQuery: string,
  formData?: FormData,
  // skip?: boolean,
  retryMessages?: AIMessage[]
) {
  "use server";

  // const isGenerating = createStreamableValue(true);
  // const isCollapsed = createStreamableValue(false);

  const aiState = getMutableAIState<typeof AI>();
  const uiStream = createStreamableUI();
  const aiMessages = [...aiState.get().messages];
  // Get the messages from the state, filter out the tool messages
  const messages: CoreMessage[] = aiMessages
    .filter(
      (message) =>
        message.role !== "tool" &&
        message.type !== "followup" &&
        message.type !== "related" &&
        message.type !== "end"
    )
    .map((message) => {
      const { role, content } = message;
      return { role, content } as CoreMessage;
    });

  const groupId = generateId();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: generateId(),
        role: "user",
        content: userQuery,
        type: "input",
      },
    ],
  });

  messages.push({
    role: "user",
    content: userQuery,
  });

  async function processEvents() {
    // Show the spinner
    uiStream.append(<Spinner />);

    // If the user skips the task, we proceed to the search

    // Set the collapsed state to true
    // isCollapsed.done(true);

    //  Generate the answer
    let answer = "";
    let stopReason = "";
    let toolOutputs: ToolResultPart[] = [];
    let errorOccurred = false;

    const streamText = createStreamableValue<string>();

    // If ANTHROPIC_API_KEY is set, update the UI with the answer
    // If not, update the UI with a div
    uiStream.update(<div />);

    // If useSpecificAPI is enabled, only function calls will be made
    // If not using a tool, this model generates the answer
    const useSpecificAPI = false;
    while (
      useSpecificAPI
        ? toolOutputs.length === 0 && answer.length === 0 && !errorOccurred
        : (stopReason !== "stop" || answer.length === 0) && !errorOccurred
    ) {
      // Search the web and generate the answer
      const { fullResponse, hasError, toolResponses, finishReason } =
        await researcher(uiStream, streamText, messages);
      stopReason = finishReason || "";
      answer = fullResponse;
      toolOutputs = toolResponses;
      errorOccurred = hasError;

      if (toolOutputs.length > 0) {
        toolOutputs.map((output) => {
          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: groupId,
                role: "tool",
                content: JSON.stringify(output.result),
                name: output.toolName,
                type: "tool",
              },
            ],
          });
        });
      }
    }

    if (!errorOccurred) {
      let processedMessages = messages;

      streamText.done();
      aiState.update({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: groupId,
            role: "assistant",
            content: answer,
            type: "answer",
          },
        ],
      });

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: groupId,
            role: "assistant",
            content: "followup",
            type: "followup",
          },
        ],
      });
    } else {
      aiState.done(aiState.get());
      streamText.done();
      uiStream.append(<ErrorCard errorMessage="An error occurred" />);
    }

    // isGenerating.done(false);
    uiStream.done();
  }

  processEvents();

  return {
    id: generateId(),
    component: uiStream.value,
  };
}

export type AIState = {
  messages: AIMessage[];
  chatId: string;
};

export type UIState = {
  id: string;
  component: React.ReactNode;
  // isGenerating?: StreamableValue<boolean>;
  // isCollapsed?: StreamableValue<boolean>;
}[];

const initialAIState: AIState = {
  chatId: generateId(),
  messages: [],
};

const initialUIState: UIState = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI<AIState, UIState>({
  actions: {
    submit,
  },
  initialUIState,
  initialAIState,
  onGetUIState: async () => {
    "use server";

    const aiState = getAIState();
    if (aiState) {
      const uiState = getUIStateFromAIState(aiState as Chat);
      return uiState;
    } else {
      return;
    }
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    // Check if there is any message of type 'answer' in the state messages
    if (!state.messages.some((e) => e.type === "answer")) {
      return;
    }

    const { chatId, messages } = state;
    // const createdAt = new Date();
    // const userId = "anonymous";
    // const path = `/search/${chatId}`;
    // const title =
    //   messages.length > 0
    //     ? JSON.parse(messages[0].content)?.input?.substring(0, 100) ||
    //       "Untitled"
    //     : "Untitled";
    // Add an 'end' message at the end to determine if the history needs to be reloaded
    const updatedMessages: AIMessage[] = [
      ...messages,
      {
        id: generateId(),
        role: "assistant",
        content: `end`,
        type: "end",
      },
    ];

    // const chat: Chat = {
    //   id: chatId,
    //   createdAt,
    //   userId,
    //   path,
    //   title,
    //   messages: updatedMessages,
    // };
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  const chatId = aiState.chatId;
  const isSharePage = aiState.isSharePage;
  return aiState.messages
    .map((message, index) => {
      const { role, content, id, type, name } = message;

      if (
        !type ||
        type === "end" ||
        (isSharePage && type === "related") ||
        (isSharePage && type === "followup")
      )
        return null;

      switch (role) {
        case "user":
          switch (type) {
            case "input":
            case "input_related":
              const json = JSON.parse(content);
              const value = type === "input" ? json.input : json.related_query;
              return {
                id,
                component: (
                  <UserMessage
                    message={value}
                    chatId={chatId}
                    showShare={index === 0 && !isSharePage}
                  />
                ),
              };
          }
        case "assistant":
          const answer = createStreamableValue();
          answer.done(content);
          switch (type) {
            case "answer":
              return {
                id,
                component: <AnswerSection result={answer.value} />,
              };
          }
        case "tool":
          try {
            const toolOutput = JSON.parse(content);
            const isCollapsed = createStreamableValue();
            isCollapsed.done(true);
            const searchResults = createStreamableValue();
            searchResults.done(JSON.stringify(toolOutput));
            switch (name) {
              // case "search":
              //   return {
              //     id,
              //     component: <SearchSection result={searchResults.value} />,
              //     isCollapsed: isCollapsed.value,
              //   };
              case "getBalance":
                return {
                  id,
                  component: <AccountBalanace result={toolOutput} />,
                  isCollapsed: isCollapsed.value,
                };

              case "getRecentTransactions":
                return {
                  id,
                  component: (
                    <RecentTransactions
                      address={toolOutput.address}
                      transactions={toolOutput.transactions}
                    />
                  ),
                  isCollapsed: isCollapsed.value,
                };
              case "getTransactionSummary":
                return {
                  id,
                  component: (
                    <TransactionsSummary
                      address={toolOutput.address}
                      data={toolOutput.result}
                    />
                  ),
                  isCollapsed: isCollapsed.value,
                };
              case "getTransactionByHash":
                return {
                  id,
                  component: <TransactionDetails data={toolOutput} />,
                  isCollapsed: isCollapsed.value,
                };
            }
          } catch (error) {
            return {
              id,
              component: null,
            };
          }
        default:
          return {
            id,
            component: null,
          };
      }
    })
    .filter((message) => message !== null) as UIState;
};
