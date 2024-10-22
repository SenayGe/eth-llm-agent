"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TransactionDetailsProps {
  data: {
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
  };
}

const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ data }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transaction Details</span>
          <Badge variant={data.isError === "0" ? "default" : "destructive"}>
            {data.isError === "0" ? "Success" : "Failed"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="font-medium">Transaction Hash</TableHead>
              <TableCell className="font-mono">
                {truncateString(data.hash, 20)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Block</TableHead>
              <TableCell>{data.blockNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Timestamp</TableHead>
              <TableCell>
                {new Date(parseInt(data.timeStamp) * 1000).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">From</TableHead>
              <TableCell className="font-mono">
                {truncateString(data.from, 20)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">To</TableHead>
              <TableCell className="font-mono">
                {truncateString(data.to, 20)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Value</TableHead>
              <TableCell>{data.value} ETH</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Gas Price</TableHead>
              <TableCell>{data.gasPrice} ETH</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Gas Used</TableHead>
              <TableCell>{data.gasUsed}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Confirmations</TableHead>
              <TableCell>{data.confirmations}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
