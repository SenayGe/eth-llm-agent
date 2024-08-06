////////////////////////    eth_agent Tools    ////////////////////////
import { tool } from "ai";
import { createStreamableUI } from "ai/rsc";
import {
  createPublicClient,
  http,
  PublicClient,
  Transaction,
  formatEther,
} from "viem";
import { mainnet } from "viem/chains";
import axios from "axios";
import { z } from "zod";
import { BalanceSkeleton } from "@/components/balance-skeleton";
import AccountBalanace from "@/components/account-balance";

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
      let hasError = false;
      // Append the search section
      uiStream.append(<BalanceSkeleton />);

      let accountDetails: any = null;

      try {
        const balance = await client.getBalance({ address });
        // return balance.toString();
        let accountDetails = {
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

export const getTools = ({ uiStream, fullResponse }: ToolProps) => {
  const tools: any = {
    getBalance: getAccountBalanceTool({
      uiStream,
      fullResponse,
    }),
  };
  return tools;
};

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

// interface TransactionEtherScan {
//   blockNumber: string;
//   timeStamp: string;
//   hash: string;
//   from: string;
//   to: string;
//   value: string;
//   gasPrice: string;
//   gasUsed: string;
// }

// // getRecentTransactions (Etherscan) Usage example:
// // const apiKey = 'YOUR_ETHERSCAN_API_KEY';
// // const address = '0x123456789...'; // The Ethereum address you want to check
// // const numberOfTransactions = 10;

// // getRecentTransactions(address, numberOfTransactions, apiKey)
// //   .then(transactions => console.log(transactions))
// //   .catch(error => console.error(error));

// // Get recent transactions using ETHERSCAN API
// async function getRecentTransactions(
//   address: string,
//   count: number,
//   apiKey: string
// ): Promise<TransactionEtherScan[]> {
//   const baseUrl = "https://api.etherscan.io/api";
//   const endpoint = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${count}&sort=desc&apikey=${apiKey}`;

//   try {
//     const response = await axios.get(endpoint);
//     if (response.data.status === "1" && response.data.message === "OK") {
//       return response.data.result.slice(0, count);
//     } else {
//       throw new Error(`API Error: ${response.data.message}`);
//     }
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     throw error;
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
