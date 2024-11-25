import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DollarSign } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Budget from "./Transactions/Budget";
import { getTransactions, Transaction } from "@/app/api/actions/auth";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import SavingsChart from "./Transactions/SavingsChart";

export function BankingDashboardComponent() {
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState(0);
  const [budgetChartData, setBudgetChartData] = useState([]);
  const [totalSavingsOrLoss, setTotalSavingsOrLoss] = useState(0);

  useEffect(() => {
    async function fetchData() {
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

        // Calculate budget (total DEPOSIT transactions)
        const totalBudget = sortedData.reduce((acc, transaction) => {
          if (transaction.transactionType === "DEPOSIT") {
            return acc + transaction.amount;
          }
          return acc;
        }, 0);

        setBudget(totalBudget);

        // Filter transactions for the budget breakdown
        const expenseTransactions = data.filter(
          (transaction) => transaction.transactionType === "WITHDRAW"
        );

        // Aggregate and transform data for the chart
        const aggregated = aggregateTransactions(expenseTransactions);
        setBudgetChartData(aggregated);

        // Calculate total savings or loss
        const totalExpenses = expenseTransactions.reduce(
          (sum, txn) => sum + txn.amount,
          0
        );
        setTotalSavingsOrLoss(totalBudget - totalExpenses);

        setChartData(balanceOverTime); // Save the balance-over-time data
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchData();
  }, []);

  const aggregateTransactions = (transactions: Transaction[]) => {
    const categoryLabels: Record<string, string> = {
      FOOD_GROCERY: "Food & Groceries",
      OTHER_GROCERY: "Other Groceries",
      PERSONAL: "Personal",
      EATING_OUT: "Eating Out",
      ENTERTAINMENT: "Entertainment",
      TRANSPORTATION: "Transportation",
      SUBSCRIPTION: "Subscription",
      FIXED_EXPENSE: "Fixed Expense",
      ONE_TIME_EXPENSE: "One-Time Expense",
      OTHER: "Other",
    };

    const categoryColors: Record<string, string> = {
      "Food & Groceries": "var(--color-food)",
      "Other Groceries": "var(--color-other)",
      Personal: "var(--color-personal)",
      "Eating Out": "var(--color-eating-out)",
      Entertainment: "var(--color-entertainment)",
      Transportation: "var(--color-transport)",
      Subscription: "var(--color-subscriptions)",
      "Fixed Expense": "var(--color-fixed)",
      "One-Time Expense": "var(--color-one-time)",
      Other: "var(--color-other)",
    };

    const aggregated = transactions.reduce((acc, transaction) => {
      const label = categoryLabels[transaction.transactionCategory] || "Other";
      if (!acc[label]) {
        acc[label] = 0;
      }
      acc[label] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(aggregated).map(([category, amount]) => ({
      category,
      amount,
      fill: categoryColors[category] || "gray",
    }));
  };

  return (
    <Tabs defaultValue="overview" className="flex flex-col text-white">
      <TabsContent value="overview" className="space-y-4">
        <p className="mx-3 text-2xl">Dashboard</p>

        <ScrollArea className="w-11/12 whitespace-nowrap rounded-md ">
          <div className="flex w-max space-x-4">
            <Card className="relative border-0 text-white bg-transparent z-0 w-auto ">
              <div className="rounded-lg shadow-lg gradient-opacity-mask w-auto"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-white font-bold">
                  {balance.toFixed(3)} KWD
                </div>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="relative border-0 text-white bg-transparent z-0 flex flex-col">
            <div className="rounded-lg shadow-lg gradient-opacity-mask-flipped w-auto"></div>

            <CardHeader className="flex-none">
              <CardTitle className="text-lg font-bold text-white">
                Budget Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
              <Budget
                budget={budget}
                chartData={budgetChartData}
                totalSavingsOrLoss={totalSavingsOrLoss}
              />
            </CardContent>
          </Card>
          <Card className="relative border-0 text-white bg-transparent z-0">
            <div className="rounded-lg shadow-lg gradient-opacity-mask-flipped"></div>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">
                Savings Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!chartData ? (
                <p>Loading...</p>
              ) : (
                <SavingsChart chartData={chartData} />
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
