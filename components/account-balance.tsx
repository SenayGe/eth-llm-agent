import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CreditCard } from "lucide-react";

interface AccountDetails {
  account: string; // eth address
  balance: string;
}

interface AccountBalanceProps {
  data: AccountDetails;
}
const AccountBalanace: React.FC<AccountBalanceProps> = ({ data }) => {
  const { account, balance } = data;

  return (
    <Card className="w-full max-w-md mx-auto bg-[#262626] text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-2">
          <Wallet className="w-6 h-6" />
          <span>Ethereum Account Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-gray-300 break-all">
              <span className="font-semibold">Address:</span> {account}
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">Balance:</p>
            <p className="text-2xl font-bold">{balance} ETH</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountBalanace;

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

// interface AccountDetails {
//   account: string;
//   balance: string;
// }

// interface EthereumBalanceDisplayProps {
//   data: AccountDetails;
// }

// const EthereumBalanceDisplay: React.FC<EthereumBalanceDisplayProps> = ({
//   data,
// }) => {
//   const { account, balance } = data;
//   const balanceNum = parseFloat(balance);

//   const getBalanceColor = (balance: number): string => {
//     if (balance > 10) return "text-green-500";
//     if (balance > 1) return "text-blue-500";
//     return "text-yellow-500";
//   };

//   const BalanceIcon = balanceNum > 5 ? TrendingUp : TrendingDown;

//   return (
//     <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-800 to-gray-900 text-white">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">
//           Ethereum Account Details
//         </CardTitle>
//         <Wallet className="h-4 w-4 text-gray-400" />
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <p className="text-xs text-gray-400 break-all">
//             <span className="font-semibold">Address:</span> {account}
//           </p>
//           <div className="flex items-center justify-between">
//             <p className="text-2xl font-bold">Balance</p>
//             <div className={`flex items-center ${getBalanceColor(balanceNum)}`}>
//               <BalanceIcon className="h-4 w-4 mr-2" />
//               <span className="text-2xl font-bold">{balance} ETH</span>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default EthereumBalanceDisplay;

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar } from "@/components/ui/avatar";
// import { Wallet, Coins } from "lucide-react";

// interface AccountDetails {
//   address: string;
//   balance: string;
// }

// interface AccountBalanceProps {
//   data: AccountDetails;
// }

// const AccountBalance: React.FC<AccountBalanceProps> = ({ data }) => {
//   const formatAddress = (addr: string): string => {
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
//   };

//   const formatBalance = (bal: string): string => {
//     return parseFloat(bal).toFixed(4);
//   };

//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">Ethereum Account</CardTitle>
//         <Avatar className="h-8 w-8">
//           <Wallet className="h-4 w-4" />
//         </Avatar>
//       </CardHeader>
//       <CardContent>
//         <div className="text-xs text-muted-foreground">Address</div>
//         <div className="text-lg font-semibold">{data.address}</div>
//         <div className="mt-4 flex items-center">
//           <Coins className="h-4 w-4 mr-2 text-muted-foreground" />
//           <div className="text-sm font-medium">
//             {formatBalance(data.balance)} ETH
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default AccountBalance;
