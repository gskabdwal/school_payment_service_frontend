
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/transactions/status-badge";
import { ArrowDown, ArrowUp, CreditCard, DollarSign, School2, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getTransactions } from "@/lib/api";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { TransactionsTable } from "@/components/transactions/transactions-table";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successfulTransactions: 0,
    successRate: 0,
    schoolCount: 0,
    averageTransaction: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // This is mocked data since the API isn't accessible
        const mockData = {
          data: Array(10).fill(0).map((_, i) => ({
            collect_id: `COL${100000 + i}`,
            school_id: `SCH${Math.floor(Math.random() * 5) + 1}`,
            gateway: ["PhonePe", "Razorpay", "PayTM", "UPI"][Math.floor(Math.random() * 4)],
            order_amount: Math.floor(Math.random() * 5000) + 500,
            transaction_amount: Math.floor(Math.random() * 5000) + 500,
            status: ["Success", "Pending", "Failed"][Math.floor(Math.random() * 3)],
            custom_order_id: `ORD${200000 + i}`,
            payment_time: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          })),
          meta: {
            page: 1,
            limit: 10,
            total: 100,
            totalPages: 10
          }
        };
        
        setTransactions(mockData.data);
        
        // Calculate stats
        const totalAmount = mockData.data.reduce((sum, transaction) => 
          sum + transaction.transaction_amount, 0);
        const successfulTxns = mockData.data.filter(t => 
          t.status.toLowerCase() === 'success');
        const successCount = successfulTxns.length;
        const uniqueSchools = new Set(mockData.data.map(t => t.school_id)).size;
        
        setStats({
          totalTransactions: mockData.meta.total,
          totalAmount,
          successfulTransactions: successCount,
          successRate: (successCount / mockData.data.length) * 100,
          schoolCount: uniqueSchools,
          averageTransaction: totalAmount / mockData.data.length
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your ScholarPay transactions and statistics
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              +18.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Schools
            </CardTitle>
            <School2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.schoolCount}</div>
            <p className="text-xs text-muted-foreground">
              +3 new schools this month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <div className="grid gap-4 grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest payment transactions across all schools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionsTable 
              transactions={transactions}
              isLoading={isLoading}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
