////////////////////////    eth_agent Tools    ////////////////////////
import { tool } from "ai";
import { createStreamableUI } from "ai/rsc";
import {
  createPublicClient,
  http,
  PublicClient,
  Transaction,
  formatEther,
  parseEther,
} from "viem";
import { mainnet } from "viem/chains";
import axios from "axios";
import { bigint, z } from "zod";
import { BalanceSkeleton } from "@/components/balance-skeleton";
import AccountBalanace from "@/components/account-balance";
import RecentTransactionsSkeleton from "@/components/transactions-skeleton";
import RecentTransactions from "@/components/transactions-list";
import TransactionsSummary from "@/components/transaction-summary";
import TransactionDetails from "@/components/tx-details";
import { get } from "http";

// Create a client instance
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export interface ToolProps {
  uiStream: ReturnType<typeof createStreamableUI>;
  fullResponse: string;
}

export const getAccountBalanceTool = ({ uiStream, fullResponse }: ToolProps) =>
  tool({
    description: "Get the balance of an Ethereum account",
    parameters: z.object({
      address: z.string().describe("The Ethereum address to check"),
    }),
    execute: async ({ address }) => {
      console.log("balance tool in use");
      console.log("address", address);

      let hasError = false;
      // Append the search section
      uiStream.append(<BalanceSkeleton />);

      let accountDetails: any = null;

      try {
        const balance = await client.getBalance({ address });
        // return balance.toString();
        console.log("balance", balance);
        accountDetails = {
          account: address,
          balance: formatEther(balance),
        };
      } catch (error) {
        hasError = true;
        console.error("Error fetching balance:", error);
      }
      if (hasError || !accountDetails) {
        fullResponse = `An error occurred".`;
        uiStream.update(null);
        return accountDetails;
      }

      uiStream.update(<AccountBalanace data={accountDetails} />);

      return accountDetails;
    },
  });

interface TransactionEtherScan {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
}

export const getRecentTransactionsTool = ({
  uiStream,
  fullResponse,
}: ToolProps) =>
  tool({
    description: "Get recent transactions of an Ethereum account",
    parameters: z.object({
      address: z.string().describe("The Ethereum address to check"),
      count: z.number().describe("The number of transactions to retrieve"),
      // apiKey: z.string().describe("The Etherscan API key"),
    }),
    execute: async ({ address, count }) => {
      console.log("recent transactions tool in use");
      console.log("address", address, "count", count);
      const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
      let hasError = false;

      // Append the search section
      uiStream.append(<RecentTransactionsSkeleton />);

      let transactions: TransactionEtherScan[] = [];
      try {
        const baseUrl = "https://api.etherscan.io/api";
        const endpoint = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${count}&sort=desc&apikey=${etherscanApiKey}`;

        const response = await axios.get(endpoint);
        if (response.data.status === "1" && response.data.message === "OK") {
          transactions = response.data.result.slice(0, count);
        } else {
          throw new Error(`API Error: ${response.data.message}`);
        }
      } catch (error) {
        hasError = true;
        console.error("Error fetching transactions:", error);
      }

      if (hasError || transactions.length === 0) {
        fullResponse = "An error occurred while fetching transactions.";
        uiStream.update(null);
        return transactions;
      }

      uiStream.update(
        <RecentTransactions address={address} transactions={transactions} />
      );
      return { address, transactions };
    },
  });

interface TransactionFullDetails {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  confirmations: string;
}

export const getTransactionDetailsTool = ({
  uiStream,
  fullResponse,
}: ToolProps) =>
  tool({
    description: "Get details of a specific Ethereum transaction by its hash",
    parameters: z.object({
      txHash: z.string().describe("The transaction hash to look up"),
      // apiKey: z.string().describe("The Etherscan API key"),
    }),
    execute: async ({ txHash }) => {
      console.log("transaction details tool in use");
      console.log("txHash", txHash);
      let hasError = false;

      // Append the search section
      // uiStream.append(<TransactionDetailsSkeleton />);
      const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

      let transactionDetails: TransactionFullDetails | null = null;
      try {
        const baseUrl = "https://api.etherscan.io/api";
        const endpoint = `${baseUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${etherscanApiKey}`;

        const response = await axios.get(endpoint);
        if (response.data.result) {
          const txData = response.data.result;

          // Fetch additional details like status and timestamp
          const txReceiptEndpoint = `${baseUrl}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${etherscanApiKey}`;
          const receiptResponse = await axios.get(txReceiptEndpoint);
          const receiptData = receiptResponse.data.result;

          transactionDetails = {
            blockNumber: parseInt(txData.blockNumber, 16).toString(),
            timeStamp: "", // We'll need to fetch this separately
            hash: txData.hash,
            from: txData.from,
            to: txData.to,
            value: formatEther(BigInt(txData.value)),
            gasPrice: formatEther(BigInt(txData.gasPrice)),
            gasUsed: receiptData
              ? parseInt(receiptData.gasUsed, 16).toString()
              : "",
            isError: receiptData && receiptData.status === "0x1" ? "0" : "1",
            txreceipt_status: receiptData ? receiptData.status : "",
            input: txData.input,
            contractAddress: receiptData ? receiptData.contractAddress : "",
            cumulativeGasUsed: receiptData
              ? parseInt(receiptData.cumulativeGasUsed, 16).toString()
              : "",
            confirmations: "", // We'll calculate this after getting the latest block number
          };

          // Fetch the block details to get the timestamp
          const blockEndpoint = `${baseUrl}?module=proxy&action=eth_getBlockByNumber&tag=${txData.blockNumber}&boolean=false&apikey=${etherscanApiKey}`;
          const blockResponse = await axios.get(blockEndpoint);
          if (blockResponse.data.result) {
            transactionDetails.timeStamp = parseInt(
              blockResponse.data.result.timestamp,
              16
            ).toString();
          }

          // Fetch the latest block number to calculate confirmations
          const latestBlockEndpoint = `${baseUrl}?module=proxy&action=eth_blockNumber&apikey=${etherscanApiKey}`;
          const latestBlockResponse = await axios.get(latestBlockEndpoint);
          if (latestBlockResponse.data.result) {
            const latestBlockNumber = parseInt(
              latestBlockResponse.data.result,
              16
            );
            const txBlockNumber = parseInt(txData.blockNumber, 16);
            transactionDetails.confirmations = (
              latestBlockNumber -
              txBlockNumber +
              1
            ).toString();
          }
        } else {
          throw new Error(
            `API Error: ${response.data.message || "Failed to fetch transaction details"}`
          );
        }
      } catch (error) {
        hasError = true;
        console.error("Error fetching transaction details:", error);
      }

      if (hasError || !transactionDetails) {
        fullResponse = "An error occurred while fetching transaction details.";
        uiStream.update(null);
        return null;
      }

      uiStream.update(<TransactionDetails data={transactionDetails} />);
      return transactionDetails;
    },
  });
export const getTools = ({ uiStream, fullResponse }: ToolProps) => {
  const tools: any = {
    getBalance: getAccountBalanceTool({
      uiStream,
      fullResponse,
    }),
    getRecentTransactions: getRecentTransactionsTool({
      uiStream,
      fullResponse,
    }),
    getTransactionSummary: getTransactionSummaryTool({
      uiStream,
      fullResponse,
    }),
    getTransactionByHash: getTransactionDetailsTool({
      uiStream,
      fullResponse,
    }),
  };
  return tools;
};

interface TransactionSummary {
  totalReceived: string;
  totalSent: string;
  netBalance: string;
  transactionCount: number;
}

export const getTransactionSummaryTool = ({
  uiStream,
  fullResponse,
}: ToolProps) =>
  tool({
    description:
      "Gives a summary of a given number of transactions for an Ethereum account",
    parameters: z.object({
      address: z.string().describe("The Ethereum address to check"),
      count: z
        .number()
        .describe("The number of transactions to retrieve and analyze"),
      // apiKey: z.string().describe("The Etherscan API key"),
    }),
    execute: async ({ address, count }) => {
      console.log("transaction summary tool in use");
      console.log("address", address, "count", count);
      let hasError = false;

      const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
      // Append the search section
      // uiStream.append(<TransactionSummarySkeleton />);
      // uiStream.append(<RecentTransactionsSkeleton />);

      let transactions: TransactionEtherScan[] = [];
      try {
        const baseUrl = "https://api.etherscan.io/api";
        const endpoint = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${count}&sort=desc&apikey=${etherscanApiKey}`;

        const response = await axios.get(endpoint);
        if (response.data.status === "1" && response.data.message === "OK") {
          transactions = response.data.result.slice(0, count);
        } else {
          throw new Error(`API Error: ${response.data.message}`);
        }
      } catch (error) {
        hasError = true;
        console.error("Error fetching transactions:", error);
      }

      if (hasError || transactions.length === 0) {
        fullResponse = "An error occurred while fetching transactions.";
        uiStream.update(null);
        return null;
      }

      const summary = transactions.reduce(
        (acc, tx) => {
          const value = parseEther(tx.value);
          if (tx.from.toLowerCase() === address.toLowerCase()) {
            acc.totalSent += value;
          } else if (tx.to.toLowerCase() === address.toLowerCase()) {
            acc.totalReceived += value;
          }
          acc.transactionCount++;
          return acc;
        },
        {
          totalReceived: 0n,
          totalSent: 0n,
          transactionCount: 0,
        }
      );

      const netBalance = summary.totalReceived - summary.totalSent;

      const result: TransactionSummary = {
        totalReceived: formatEther(summary.totalReceived),
        totalSent: formatEther(summary.totalSent),
        netBalance: formatEther(netBalance),
        transactionCount: count,
      };

      // Assuming uiStream.update is a function to update the UI
      uiStream.update(<TransactionsSummary data={result} address={address} />);

      return { result, address };
    },
  });

// getRecentTransactions (Etherscan) Usage example:
// const apiKey = 'YOUR_ETHERSCAN_API_KEY';
// const address = '0x123456789...'; // The Ethereum address you want to check
// const numberOfTransactions = 10;

// getRecentTransactions(address, numberOfTransactions, apiKey)
//   .then(transactions => console.log(transactions))
//   .catch(error => console.error(error));

// Get recent transactions using ETHERSCAN API
async function getRecentTransactions(
  address: string,
  count: number,
  apiKey: string
): Promise<TransactionEtherScan[]> {
  const baseUrl = "https://api.etherscan.io/api";
  const endpoint = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${count}&sort=desc&apikey=${apiKey}`;

  try {
    const response = await axios.get(endpoint);
    if (response.data.status === "1" && response.data.message === "OK") {
      return response.data.result.slice(0, count);
    } else {
      throw new Error(`API Error: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
// export async function getLatestBlockNumber() {
//   try {
//     const blockNumber = await client.getBlockNumber();
//     return blockNumber.toString();
//   } catch (error) {
//     console.error("Error fetching latest block number:", error);
//     return "Error fetching latest block number";
//   }
// }

// export async function getTransactionCount(address: string) {
//   try {
//     const count = await client.getTransactionCount({ address });
//     return count.toString();
//   } catch (error) {
//     console.error("Error fetching transaction count:", error);
//     return "Error fetching transaction count";
//   }
// }

// export interface ToolProps {
//   uiStream: ReturnType<typeof createStreamableUI>;
//   fullResponse: string;
// }

//   if (process.env.SERPER_API_KEY) {
//     tools.videoSearch = videoSearchTool({
//       uiStream,
//       fullResponse,
//     });
//   }

//   return tools;
// };

// // interface SimplifiedTransaction {
// //   hash: string;
// //   from: string;
// //   to: string | null;
// //   value: string;
// //   blockNumber: string;
// // }

// // export async function getRecentTransactions(
// //   address: string,
// //   n: number
// // ): Promise<SimplifiedTransaction[]> {
// //   try {
// //     const transactions: SimplifiedTransaction[] = [];
// //     let blockNumber = await client.getBlockNumber();

// //     while (transactions.length < n) {
// //       const block = await client.getBlock({
// //         blockNumber,
// //         includeTransactions: true,
// //       });

// //       if ("transactions" in block) {
// //         const blockTransactions = block.transactions as Transaction[];
// //         const relevantTransactions = blockTransactions.filter(
// //           (tx) =>
// //             tx.from.toLowerCase() === address.toLowerCase() ||
// //             tx.to?.toLowerCase() === address.toLowerCase()
// //         );

// //         for (const tx of relevantTransactions) {
// //           if (transactions.length < n) {
// //             transactions.push({
// //               hash: tx.hash,
// //               from: tx.from,
// //               to: tx.to,
// //               value: formatEther(tx.value),
// //               blockNumber: tx.blockNumber.toString(),
// //             });
// //           } else {
// //             break;
// //           }
// //         }
// //       }

// //       if (blockNumber <= 0n) break;
// //       blockNumber--;
// //     }

// //     return transactions;
// //   } catch (error) {
// //     console.error("Error fetching recent transactions:", error);
// //     throw new Error("Failed to fetch recent transactions");
// //   }
// // }
