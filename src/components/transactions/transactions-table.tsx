
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ExternalLink,
  Copy
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TransactionsTable({
  transactions,
  isLoading,
  currentPage,
  totalPages,
  onPageChange
}: TransactionsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  // Generate loading skeletons
  const loadingRows = Array(10).fill(0).map((_, i) => (
    <TableRow key={`loading-row-${i}`}>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  ));

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copied to clipboard");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Collect ID</TableHead>
            <TableHead>School ID</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead className="text-right">Order Amount</TableHead>
            <TableHead className="text-right">Transaction Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Custom Order ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            loadingRows
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow 
                key={transaction.collect_id}
                onMouseEnter={() => setHoveredRow(transaction.collect_id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`transition-colors ${
                  hoveredRow === transaction.collect_id 
                  ? 'bg-muted/80' 
                  : 'hover:bg-muted/50'
                }`}
              >
                <TableCell className="font-medium relative">
                  <div className="flex items-center">
                    <Link 
                      to={`/status-check?id=${transaction.custom_order_id}`}
                      className="hover:text-scholar-600 hover:underline transition-colors"
                    >
                      {transaction.collect_id}
                    </Link>
                    {hoveredRow === transaction.collect_id && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 ml-2"
                        onClick={() => handleCopyId(transaction.collect_id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell>{transaction.school_id}</TableCell>
                <TableCell>{transaction.gateway}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.order_amount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.transaction_amount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status} />
                </TableCell>
                <TableCell className="relative">
                  <div className="flex items-center">
                    <span>{transaction.custom_order_id}</span>
                    {hoveredRow === transaction.collect_id && (
                      <div className="absolute right-4 flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyId(transaction.custom_order_id)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Link to={`/status-check?id=${transaction.custom_order_id}`}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      {!isLoading && totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(1)}
              disabled={currentPage <= 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
