
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";

const Analytics = () => {
  // Mock data for the charts
  const transactionsByDay = [
    { name: "Mon", count: 24, amount: 12000 },
    { name: "Tue", count: 18, amount: 9000 },
    { name: "Wed", count: 32, amount: 16000 },
    { name: "Thu", count: 26, amount: 13000 },
    { name: "Fri", count: 42, amount: 21000 },
    { name: "Sat", count: 16, amount: 8000 },
    { name: "Sun", count: 8, amount: 4000 },
  ];
  
  const statusData = [
    { name: "Success", value: 73, color: "#10b981" },
    { name: "Pending", value: 18, color: "#f97316" },
    { name: "Failed", value: 9, color: "#ef4444" },
  ];
  
  const paymentMethodData = [
    { name: "UPI", value: 45, color: "#3b82f6" },
    { name: "Card", value: 25, color: "#8b5cf6" },
    { name: "NetBanking", value: 20, color: "#0ea5e9" },
    { name: "Wallet", value: 10, color: "#6366f1" },
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Visual representation of transaction data
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Transaction Volume by Day */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <CardDescription>
              Number of transactions by day of week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Transactions" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Transaction Amount by Day */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transaction Amount</CardTitle>
            <CardDescription>
              Total transaction amount by day of week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                    formatter={(value) => [`₹${value}`, 'Amount']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Amount (₹)" 
                    fill="#0d84e3" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Status Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
            <CardDescription>
              Distribution of transaction statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={500}
                  >
                    {statusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className={cn(
                          "transition-opacity duration-200",
                          activeIndex === index ? "opacity-100" : "opacity-80"
                        )}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend 
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(0)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Method Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Distribution of payment methods used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={500}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className={cn(
                          "transition-opacity duration-200",
                          activeIndex === index ? "opacity-100" : "opacity-80"
                        )}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend 
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(0)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
