"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Statistic } from "@/components/ui/statistic";
import { ArrowUpCircle, ArrowDownCircle, RefreshCcw, Hash } from "lucide-react";

interface TransactionSummaryProps {
  data: {
    totalReceived: string;
    totalSent: string;
    netBalance: string;
    transactionCount: number;
  };
  address: string;
}

const truncateAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const TransactionsSummary: React.FC<TransactionSummaryProps> = ({
  data,
  address,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          Transaction Summary for {truncateAddress(address)}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Statistic
          title="Total Received"
          value={`${parseFloat(data.totalReceived).toFixed(4)} ETH`}
          icon={<ArrowDownCircle className="h-4 w-4 text-green-500" />}
        />
        <Statistic
          title="Total Sent"
          value={`${parseFloat(data.totalSent).toFixed(4)} ETH`}
          icon={<ArrowUpCircle className="h-4 w-4 text-red-500" />}
        />
        <Statistic
          title="Net Balance"
          value={`${parseFloat(data.netBalance).toFixed(4)} ETH`}
          icon={<RefreshCcw className="h-4 w-4 text-blue-500" />}
        />
        <Statistic
          title="Trx Count"
          value={data.transactionCount.toString()}
          icon={<Hash className="h-4 w-4 text-purple-500" />}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionsSummary;
