import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Label } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getTransactions, Transaction } from "@/app/api/actions/auth";

interface BudgetProps {
  budget: number; // Define the budget prop type
}

export default function Budget({ budget }: BudgetProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<Transaction[]>([]);
  const [totalSavingsOrLoss, setTotalSavingsOrLoss] = useState(0);

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

  useEffect(() => {
    async function fetchTransactions() {
      try {
        let data = await getTransactions();

        // Filter data to only be of transactionType === "WITHDRAW"
        data = data.filter(
          (transaction: Transaction) =>
            transaction.transactionType === "WITHDRAW"
        );

        setTransactions(data);

        // Aggregate and transform data for the chart
        const aggregated = aggregateTransactions(data);
        setChartData(aggregated);

        // Calculate total savings or loss
        const totalExpenses = data.reduce((sum, txn) => sum + txn.amount, 0);
        setTotalSavingsOrLoss(budget - totalExpenses);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
    fetchTransactions();
  }, [budget]);

  const aggregateTransactions = (transactions: Transaction[]) => {
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
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            innerRadius={60}
            outerRadius={100}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {totalSavingsOrLoss > 0
                          ? `+${totalSavingsOrLoss.toLocaleString()}`
                          : `${totalSavingsOrLoss.toLocaleString()}`}{" "}
                        KWD
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {totalSavingsOrLoss > 0 ? "Savings" : "Loss"}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
          <Tooltip
            formatter={(value: any, name: string) => [`${value} KWD`, name]}
          />
        </PieChart>
      </CardContent>
      <CardFooter className="text-center">
        {totalSavingsOrLoss > 0
          ? `Saving ${totalSavingsOrLoss} KWD this month with a budget of ${budget} KWD`
          : `Losing ${Math.abs(
              totalSavingsOrLoss
            )} KWD this month with a budget of ${budget} KWD`}
      </CardFooter>
    </Card>
  );
}
