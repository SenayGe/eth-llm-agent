"use client";

import React from "react";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EtherReceivedDisplayProps {
  weiAmount: bigint;
  address: string;
  lastUpdated?: Date;
}

const EtherReceivedDisplay: React.FC<EtherReceivedDisplayProps> = ({
  weiAmount,
  address,
  lastUpdated,
}) => {
  const etherAmount = parseFloat(formatEther(weiAmount));
  const formattedEther = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(etherAmount);

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Ether Received</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-bold">{formattedEther} ETH</div>
          <Badge variant="secondary" className="text-sm">
            Received by {truncateAddress(address)}
          </Badge>
          {lastUpdated && (
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EtherReceivedDisplay;
