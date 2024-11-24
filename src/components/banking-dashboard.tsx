"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Budget from "./Transactions/Budget";
import { getTransactions, Transaction } from "@/app/api/actions/auth";

export function BankingDashboardComponent() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<Transaction[]>([]);
  const [totalSavingsOrLoss, setTotalSavingsOrLoss] = useState(0);
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await getTransactions();

        // Sort transactions by date
        const sortedData = data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Calculate cumulative balance over time
        let cumulativeBalance = 0;
        const balanceOverTime = sortedData.map((transaction) => {
          cumulativeBalance +=
            transaction.transactionType === "DEPOSIT"
              ? transaction.amount
              : -transaction.amount;

          return {
            date: transaction.date, // Keep the date for the x-axis
            balance: cumulativeBalance, // The computed balance at this point
          };
        });

        setBalance(cumulativeBalance);

        setBudget(
          sortedData.reduce((acc, transaction) => {
            if (transaction.transactionType === "DEPOSIT") {
              return acc + transaction.amount;
            } else {
              return acc;
            }
          }, budget) // Initialize with the existing balance
        );

        setTransactions(sortedData); // Save the sorted transactions
        setChartData(balanceOverTime); // Save the balance-over-time data
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
    fetchTransactions();
  }, []);

  const budgetData = [
    { name: "Housing", amount: 1200 },
    { name: "Food", amount: 400 },
    { name: "Transport", amount: 200 },
    { name: "Utilities", amount: 150 },
    { name: "Entertainment", amount: 100 },
  ];

  const beneficiaries = [
    { id: 1, name: "John Doe", accountNumber: "**** 1234" },
    { id: 2, name: "Jane Smith", accountNumber: "**** 5678" },
    { id: 3, name: "Alice Johnson", accountNumber: "**** 9012" },
  ];

  const handleDeposit = () => {
    setBalance((prevBalance) => prevBalance + 100);
  };

  const handleWithdrawal = () => {
    if (balance >= 100) {
      setBalance((prevBalance) => prevBalance - 100);
    }
  };

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(223, 54%, 34%)",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(223, 54%, 34%);",
    },
  } satisfies ChartConfig;

  return (
    <Tabs defaultValue="overview" className="flex space-x-4">
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balance.toFixed(3)} KWD</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Beneficiaries
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{beneficiaries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deposit</CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button onClick={handleDeposit} className="w-full">
                Deposit $100
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Withdraw</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleWithdrawal}
                className="w-full"
                variant="outline"
              >
                Withdraw $100
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <Budget budget={budget} />
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                You made {transactions.length} transactions this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {transactions
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date}
                        </p>
                      </div>
                      <div
                        className={`ml-auto font-medium ${
                          transaction.transactionType === "DEPOSIT"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.transactionType === "DEPOSIT" ? "+" : "-"}
                        {transaction.amount.toFixed(3)}
                      </div>
                    </div>
                  ))
                  .reverse()
                  .slice(0, 5)}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Balance over time */}
        <Card className="mt-4 p-4">
          <CardHeader>
            <CardTitle>Balance over time</CardTitle>
          </CardHeader>
          <ChartContainer config={chartConfig}>
            <AreaChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toFixed(0)} KWD`}
                domain={["auto", "auto"]}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`; // Formats as DD/MM
                }}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const date = new Date(payload[0].payload.date);
                    return (
                      <ChartTooltipContent>
                        <p>
                          {date.toLocaleDateString()} - Balance: $
                          {payload[0].payload.balance.toFixed(2)}
                        </p>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
              <defs>
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(223, 54%, 34%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(223, 54%, 34%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="balance"
                type="monotone"
                fill="url(#balanceFill)"
                stroke="hsl(223, 54%, 34%)"
              />
            </AreaChart>
          </ChartContainer>
          <CardFooter className="mt-4">
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                {/* <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  January - June 2024
                </div> */}
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
