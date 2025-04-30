import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { checkTransactionStatus } from "@/lib/api";
import { StatusBadge } from "@/components/transactions/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { ApiResponse, Transaction } from "@/types";

// Type guard to check if the response is a direct transaction object
const isDirectTransaction = (data: any): data is Transaction => {
  return data && 
    typeof data === 'object' && 
    'status' in data && 
    'transaction_amount' in data && 
    'payment_time' in data;
};

const StatusCheck = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrderId = searchParams.get("id") || "";
  
  const [customOrderId, setCustomOrderId] = useState(initialOrderId);
  const [hasSearched, setHasSearched] = useState(!!initialOrderId);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["transaction-status", customOrderId],
    queryFn: () => checkTransactionStatus(customOrderId),
    enabled: !!customOrderId && hasSearched,
    meta: {
      onError: (error: any) => {
        toast.error(`Error: ${error?.message || 'Could not retrieve transaction status'}`);
      }
    }
  });

  // Log the response data for debugging
  useEffect(() => {
    if (data) {
      console.error("Response data structure:", data);
    }
  }, [data]);

  // Update URL when searching for an order ID
  useEffect(() => {
    if (hasSearched && customOrderId) {
      setSearchParams({ id: customOrderId });
    }
  }, [hasSearched, customOrderId, setSearchParams]);

  const handleSearch = () => {
    if (!customOrderId) {
      toast.error("Please enter an Order ID");
      return;
    }
    setHasSearched(true);
    refetch();
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CardTitle className="text-2xl font-bold">Check Transaction Status</CardTitle>
          <CardDescription>Enter your Order ID to check the status of your transaction</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter Order ID"
              value={customOrderId}
              onChange={(e) => setCustomOrderId(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading || !customOrderId}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" /> Search
                </>
              )}
            </Button>
          </div>

          {isLoading && <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Retrieving transaction status...</p>
          </div>}

          {isError && (
            <div className="flex items-center space-x-2 bg-destructive/10 p-4 rounded-md text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to retrieve transaction status. Please check the Order ID and try again.</p>
            </div>
          )}

          {data && ((data as ApiResponse<Transaction>).data || isDirectTransaction(data)) && (
            <div className="space-y-5 bg-muted/30 p-6 rounded-lg">
              <div className="flex items-center space-x-2 text-green-500 mb-4">
                <CheckCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Transaction Found</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-md shadow-sm">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="font-semibold">Status:</div>
                    <StatusBadge status={
                      isDirectTransaction(data) 
                        ? data.status 
                        : (data as ApiResponse<Transaction>).data?.status || ''
                    } />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <div className="font-semibold">Order ID:</div>
                    <div >{
                      isDirectTransaction(data) 
                        ? <p className="text-xs font-bold">{data.custom_order_id || data.collect_id}</p> 
                        : <p className="text-xs font-bold">{(data as ApiResponse<Transaction>).data?.custom_order_id}</p>
                    }</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <div className="font-semibold">Amount:</div>
                    <div>{formatCurrency(
                      isDirectTransaction(data) 
                        ? data.transaction_amount 
                        : (data as ApiResponse<Transaction>).data?.transaction_amount || 0
                    )}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <div className="font-semibold">Payment Method:</div>
                    <div>{
                      isDirectTransaction(data) 
                        ? (data.payment_mode || data.gateway || 'N/A') 
                        : (data as ApiResponse<Transaction>).data?.gateway || 'N/A'
                    }</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <div className="font-semibold">Payment Time:</div>
                    <div>{formatDate(
                      isDirectTransaction(data) 
                        ? data.payment_time 
                        : (data as ApiResponse<Transaction>).data?.payment_time || ''
                    )}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Back to Transactions
                </Button>
              </div>
            </div>
          )}
          
          {hasSearched && !isLoading && (!data || (data && !(isDirectTransaction(data) || (data as ApiResponse<Transaction>).data))) && !isError && (
            <div className="flex items-center space-x-2 bg-amber-50 p-4 rounded-md text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              <p>No transaction found with the specified Order ID. Please check and try again.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusCheck;
