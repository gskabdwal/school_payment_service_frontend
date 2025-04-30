import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactionsBySchool } from '@/lib/api';
import { Transaction } from '@/types';
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

// Column definition type
interface Column {
  id: string;
  title: string;
  sortable: boolean;
  className?: string;
  render?: (transaction: Transaction) => React.ReactNode;
}

const SchoolTransactions = () => {
  const [schoolIdInput, setSchoolIdInput] = useState<string>('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState('payment_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch transactions with pagination and sorting
  const { data, isLoading, isError, refetch } = useQuery<TransactionResponse>({
    queryKey: ['transactions', selectedSchoolId, page, limit, sortField, sortOrder],
    queryFn: () => getTransactionsBySchool(selectedSchoolId, {
      page,
      limit,
      sort: sortField,
      order: sortOrder
    }),
    enabled: !!selectedSchoolId, // Only run query when a school is selected
    staleTime: 0, // Always consider data stale to ensure refetching
  });

  useEffect(() => {
    if (data) {
      setTransactions(data.transactions || []);
      setTotal(data.pagination?.total || 0);
      setIsSearching(false);
    }
  }, [data]);

  // Effect to refetch data when sort or pagination changes
  useEffect(() => {
    if (selectedSchoolId) {
      refetch();
    }
  }, [page, limit, sortField, sortOrder, refetch, selectedSchoolId]);

  const handleSchoolSearch = () => {
    if (!schoolIdInput.trim()) {
      toast.error("Please enter a school ID");
      return;
    }
    
    setSelectedSchoolId(schoolIdInput.trim());
    setIsSearching(true);
    setPage(1); // Reset to first page on new search
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSchoolSearch();
    }
  };

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied({ ...isCopied, [text]: true });
      toast.success('Copied to clipboard');
      
      // Reset the copied state after 2 seconds
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
    setPage(1); // Reset to first page when changing limit
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder('asc');
    }
    
    // Force a refetch when sort changes
    if (selectedSchoolId) {
      setTimeout(() => refetch(), 0);
    }
  };

  const totalPages = Math.ceil(total / limit);

  // Define columns with render functions for consistent display
  const columns: Column[] = [
    { 
      id: 'collect_id', 
      title: 'Collect ID', 
      sortable: false,
      render: (transaction) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{truncateText(transaction.collect_id, 10)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleCopyClick(transaction.collect_id)}
          >
            {isCopied[transaction.collect_id] ? (
              <CopyCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )
    },
    { 
      id: 'school_id', 
      title: 'School ID', 
      sortable: false,
      render: (transaction) => <span>{transaction.school_id}</span>
    },
    { 
      id: 'gateway', 
      title: 'Gateway', 
      sortable: false,
      render: (transaction) => <span>{transaction.gateway}</span>
    },
    { 
      id: 'order_amount', 
      title: 'Order Amount', 
      sortable: true,
      className: "text-right",
      render: (transaction) => <span>{formatCurrency(transaction.order_amount)}</span>
    },
    { 
      id: 'transaction_amount', 
      title: 'Transaction Amount', 
      sortable: true,
      className: "text-right",
      render: (transaction) => <span>{formatCurrency(transaction.transaction_amount)}</span>
    },
    { 
      id: 'status', 
      title: 'Status', 
      sortable: true,
      render: (transaction) => <StatusBadge status={transaction.status} />
    },
    { 
      id: 'custom_order_id', 
      title: 'Custom Order ID', 
      sortable: false,
      render: (transaction) => (
        <div className="flex items-center space-x-2">
          <span>{truncateText(transaction.custom_order_id, 10)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleCopyClick(transaction.custom_order_id)}
          >
            {isCopied[transaction.custom_order_id] ? (
              <CopyCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )
    },
    { 
      id: 'payment_time', 
      title: 'Payment Time', 
      sortable: true,
      render: (transaction) => <span>{formatDate(transaction.payment_time)}</span>
    },
  ];

  // Function to render the sort icon based on current sort state
  const renderSortIcon = (columnId: string) => {
    if (columnId !== sortField) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
    }
    
    return sortOrder === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 text-primary" />
      : <ArrowDown className="ml-1 h-4 w-4 text-primary" />;
  };

  return (
    <div className="container mx-auto py-6 space-y-6 overflow-visible">
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Transaction Details by School</CardTitle>
          <CardDescription>View transactions for a specific school</CardDescription>
        </CardHeader>
        <CardContent className="overflow-visible">
          <div className="mb-6">
            <Label htmlFor="school-id-input" className="mb-2 block">Enter School ID</Label>
            <div className="flex gap-2">
              <Input
                id="school-id-input"
                placeholder="Enter school ID"
                value={schoolIdInput}
                onChange={(e) => setSchoolIdInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleSchoolSearch}
                disabled={isSearching || isLoading}
              >
                {isSearching || isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>
          </div>

          {!selectedSchoolId && (
            <div className="text-center py-12 text-muted-foreground">
              Please enter a school ID to view transactions
            </div>
          )}

          {selectedSchoolId && (
            <>
              <div className="bg-muted p-4 rounded-md mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">School ID</h3>
                    <p className="text-sm">{selectedSchoolId}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedSchoolId('');
                      setSchoolIdInput('');
                      setTransactions([]);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>

              <div className="rounded-md border mt-6 overflow-visible">
                <ScrollArea className="h-[calc(100vh-420px)] overflow-visible">
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
                            Error loading transactions. Please check the school ID and try again.
                          </TableCell>
                        </TableRow>
                      ) : transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="text-center">
                            No transactions found for this school.
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((transaction) => (
                          <TableRow 
                            key={transaction._id || transaction.collect_id} 
                            className="h-16 my-0.5 hover:-translate-y-0.5 hover:-translate-x-2 hover:shadow-md hover:z-10 hover:relative transition-all duration-200"
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

              {transactions.length > 0 && (
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => handlePageChange(1)}
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                      >
                        Previous
                      </Button>
                    </div>
                    <div className="text-sm">
                      Page {page} of {totalPages} ({total} total transactions)
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        Next
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        Last
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="limit-select">Items per page:</Label>
                    <Select
                      value={limit.toString()}
                      onValueChange={handleLimitChange}
                    >
                      <SelectTrigger id="limit-select" className="w-[80px]">
                        <SelectValue placeholder="10" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolTransactions;
