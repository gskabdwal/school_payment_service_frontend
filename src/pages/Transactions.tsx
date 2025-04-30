import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllTransactions } from "@/lib/api";
import { Transaction } from "@/types";
import { Copy, CopyCheck, RefreshCw, Search, X, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { formatCurrency, truncateText, formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";
import { StatusBadge } from '@/components/transactions/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  sorting: {
    field: string;
    order: string;
  };
}

interface Column {
  id: string;
  title: string;
  sortable: boolean;
  className?: string;
  render?: (transaction: Transaction) => React.ReactNode;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState('payment_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, isError, refetch } = useQuery<TransactionResponse>({
    queryKey: ['all-transactions', page, limit, sortField, sortOrder],
    queryFn: () => getAllTransactions({
      page,
      limit,
      sort: sortField,
      order: sortOrder
    }),
    staleTime: 0,
  });

  useEffect(() => {
    if (data) {
      setTransactions(data.transactions || []);
      setTotal(data.pagination?.total || 0);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [page, limit, sortField, sortOrder, refetch]);

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied({ ...isCopied, [text]: true });
      toast.success('Copied to clipboard');
      setTimeout(() => {
        setIsCopied(prev => ({ ...prev, [text]: false }));
      }, 2000);
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setTimeout(() => refetch(), 0);
  };

  const totalPages = Math.ceil(total / limit);

  const columns: Column[] = [
    { id: 'collect_id', title: 'Collect ID', sortable: false, render: (transaction) => (
      <div className="flex items-center space-x-2">
        <span className="font-medium">{truncateText(transaction.collect_id, 10)}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyClick(transaction.collect_id)}>
          {isCopied[transaction.collect_id] ? <CopyCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    )},
    { id: 'school_id', title: 'School ID', sortable: false, render: (transaction) => <span>{transaction.school_id}</span> },
    { id: 'gateway', title: 'Gateway', sortable: false, render: (transaction) => <span>{transaction.gateway}</span> },
    { id: 'order_amount', title: 'Order Amount', sortable: true, className: "text-right", render: (transaction) => <span>{formatCurrency(transaction.order_amount)}</span> },
    { id: 'transaction_amount', title: 'Transaction Amount', sortable: true, className: "text-right", render: (transaction) => <span>{formatCurrency(transaction.transaction_amount)}</span> },
    { id: 'status', title: 'Status', sortable: true, render: (transaction) => <StatusBadge status={transaction.status} /> },
    { id: 'custom_order_id', title: 'Custom Order ID', sortable: false, render: (transaction) => (
      <div className="flex items-center space-x-2">
        <span>{truncateText(transaction.custom_order_id, 10)}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyClick(transaction.custom_order_id)}>
          {isCopied[transaction.custom_order_id] ? <CopyCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    )},
    { id: 'payment_time', title: 'Payment Time', sortable: true, render: (transaction) => <span>{formatDate(transaction.payment_time)}</span> },
  ];

  const renderSortIcon = (columnId: string) => {
    if (columnId !== sortField) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
    }
    return sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 text-primary" /> : <ArrowDown className="ml-1 h-4 w-4 text-primary" />;
  };

  return (
    <div className="container mx-auto py-6 space-y-6 overflow-visible">
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>View all transactions in the system</CardDescription>
        </CardHeader>
        <CardContent className="overflow-visible">
          <div className="rounded-md border mt-6 overflow-visible">
            <ScrollArea className="h-[calc(100vh-320px)] overflow-visible">
              <Table className="overflow-visible">
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead 
                        key={column.id}
                        className={cn(
                          "h-10 px-4 text-left align-middle font-medium text-muted-foreground",
                          column.sortable ? "cursor-pointer hover:text-foreground" : "",
                          column.className
                        )}
                        onClick={column.sortable ? () => handleSort(column.id) : undefined}
                      >
                        <div className="flex items-center">
                          <span>{column.title}</span>
                          {column.sortable && renderSortIcon(column.id)}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center">
                        <div className="flex items-center justify-center py-4">
                          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                          <span className="ml-2">Loading transactions...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center text-destructive">
                        Error loading transactions. Please try again.
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow 
                        key={transaction._id || transaction.collect_id} 
                        className="h-16 my-0.5 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:-translate-x-1 hover:shadow-md hover:z-10 hover:relative"
                        style={{ transformOrigin: 'top left' }}
                      >
                        {columns.map((column) => (
                          <TableCell 
                            key={`${transaction._id || transaction.collect_id}-${column.id}`}
                            className={cn("px-4 py-2", column.className)}
                          >
                            {column.render ? column.render(transaction) : (transaction as any)[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
