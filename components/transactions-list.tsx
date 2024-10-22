"use client";

import React from "react";
import { formatEther } from "viem";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  address: string;
}

const truncateAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  address,
}) => {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>
          Recent Transactions for {truncateAddress(address)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>From/To</TableHead>
              <TableHead>Value (ETH)</TableHead>
              <TableHead>Gas Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.hash}>
                <TableCell className="font-mono">
                  {truncateAddress(tx.hash)}
                </TableCell>
                <TableCell>
                  {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      tx.from.toLowerCase() === address.toLowerCase()
                        ? "destructive"
                        : "default"
                    }
                  >
                    {tx.from.toLowerCase() === address.toLowerCase()
                      ? "Sent to"
                      : "Received from"}
                  </Badge>
                  <span className="ml-2 font-mono">
                    {truncateAddress(
                      tx.from.toLowerCase() === address.toLowerCase()
                        ? tx.to
                        : tx.from
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  {parseFloat(formatEther(BigInt(tx.value))).toFixed(4)}
                </TableCell>
                <TableCell>{parseInt(tx.gasUsed).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
