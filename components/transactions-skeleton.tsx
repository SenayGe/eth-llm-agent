"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RecentTransactionsSkeleton: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="w-full min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(5)].map((_, index) => (
                  <TableHead key={index} className="w-1/5">
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="w-1/5">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="w-1/5">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="w-1/5">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="w-1/5">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="w-1/5">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsSkeleton;

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

// const SimpleTableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
//   rows = 5,
//   columns = 4,
// }) => {
//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>
//           <Skeleton className="h-8 w-1/2" />
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {/* Table Header */}
//           <div className="flex space-x-4">
//             {[...Array(columns)].map((_, index) => (
//               <Skeleton key={`header-${index}`} className="h-6 flex-1" />
//             ))}
//           </div>

//           {/* Table Rows */}
//           {[...Array(rows)].map((_, rowIndex) => (
//             <div key={`row-${rowIndex}`} className="flex space-x-4">
//               {[...Array(columns)].map((_, colIndex) => (
//                 <Skeleton
//                   key={`cell-${rowIndex}-${colIndex}`}
//                   className="h-4 flex-1"
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default SimpleTableSkeleton;
