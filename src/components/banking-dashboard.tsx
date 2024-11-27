import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import SavingsChart from "./Transactions/SavingsChart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/token";
import { useEffect, useState } from "react";

import { getTransactions, Transaction } from "@/app/api/actions/auth";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Budget from "./BudgetingCard/Budget";
import SavingsGoals from "./SavingsGoals";
import { FinancialHealth } from "./FinancialHealth";
import { FavoriteGoalCard } from "./FavoriteGoalCard";
import BeneficiaryDialog from "./BudgetingCard/BeneficiaryComponent";
import BeneficiaryList from "./BudgetingCard/BeneficiaryList";
import BeneficiaryBreakdownCard from "./BudgetingCard/BeneficiaryBreakdownCard";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 20,
      damping: 10,
    },
  },
};

export function BankingDashboardComponent() {
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState(0);
  const [budgetChartData, setBudgetChartData] = useState([]);
  const [totalSavingsOrLoss, setTotalSavingsOrLoss] = useState(0);
  const [username, setUsername] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [prices, setPrices] = useState(null);
  const [dailyCost, setDailyCost] = useState(0);
  const [financialHealthPercentage, setFinancialHealthPercentage] = useState(0);
  const [favoriteGoal, setFavoriteGoal] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const aggregateTransactions = (transactions: Transaction[]) => {
    const categoryLabels: Record<string, string> = {
      GROCERY: "Food & Groceries",
      ESSENTIALS: "Essentials",
      PERSONAL: "Personal",
      EATING_OUT: "Eating Out",
      ENTERTAINMENT: "Entertainment",
      TRANSPORTATION: "Transportation",
      SUBSCRIPTION: "Subscription",
      FIXED_EXPENSE: "Fixed Expense",
      ONE_TIME_EXPENSE: "One-Time Expense",
      RENT: "Rent",
      UNCATEGORIZED: "Uncategorized",
      OTHER: "Other",
    };

    const categoryColors: Record<string, string> = {
      "Food & Groceries": "var(--color-food)",
      Essentials: "var(--color-other)",
      Personal: "var(--color-personal)",
      "Eating Out": "var(--color-eating-out)",
      Entertainment: "var(--color-entertainment)",
      Transportation: "var(--color-transport)",
      Subscription: "var(--color-subscriptions)",
      "Fixed Expense": "var(--color-fixed)",
      "One-Time Expense": "var(--color-one-time)",
      Rent: "var(--color-other)",
      Uncategorized: "var(--color-other)",
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

  if (!isClient) {
    return null; // or a loading indicator
  }

  return (
    <>
      {chartData !== [] ? (
        <div className="">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Tabs defaultValue="overview" className="flex flex-col text-white">
              <TabsContent value="overview" className="space-y-4">
                {/* Balance and savings cards */}
                <ScrollArea className="w-11/12 whitespace-nowrap rounded-md ">
                  <div className="flex w-max space-x-4 mt-4">
                    <SavingsGoals
                      balance={balance}
                      setFavoriteGoal={setFavoriteGoal}
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* First row */}
                <div className="grid gap-4 lg:grid-cols-20">
                  {/* Greeting card */}

                  <Card className="rounded-3xl overflow-hidden relative border-0 text-white bg-[url('/defaultpfp.png')] bg-cover bg-center z-0 col-span-9 h-64">
                    <div className="rounded-lg shadow-lg gradient-opacity-mask-light w-auto"></div>
                    <p className="text-xs text-gray-400 pt-6 pl-6">
                      Welcome back,
                    </p>
                    <h2 className="capitalize pl-6 text-3xl">{username}</h2>
                    <p className="text-xs text-gray-400 pt-2 pl-6">
                      Glad to see you again!
                    </p>
                  </Card>
                  <Card className="relative border-0 text-white bg-transparent z-0 col-span-5">
                    <div className="rounded-lg shadow-lg gradient-opacity-mask w-auto"></div>
                    <FinancialHealth percentage={financialHealthPercentage} />
                  </Card>
                  <Card className="relative border-0 text-white bg-transparent z-0 col-span-6">
                    <div className="rounded-lg shadow-lg gradient-opacity-mask w-auto"></div>
                    {favoriteGoal ? (
                      <FavoriteGoalCard
                        goal={favoriteGoal.amount}
                        key={favoriteGoal.id}
                        label={favoriteGoal.name}
                        currentAmount={favoriteGoal.currentAmount}
                        amountAllocatedPerMonth={
                          favoriteGoal.amountAllocatedPerMonth
                        }
                        monthsUntilDeadline={favoriteGoal.monthsUntilDeadline}
                      />
                    ) : (
                      <p className="text-xs text-gray-400 pt-6 pl-6">
                        No favorite goal set.
                      </p>
                    )}
                  </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 ">
                  <Card className="relative border-0 text-white bg-transparent z-0 flex flex-col z-20">
                    <div className="rounded-lg shadow-lg gradient-opacity-mask-flipped w-auto"></div>

                    <CardHeader className="flex-none">
                      <CardTitle className="text-lg font-bold text-white flex">
                        Budget Breakdown
                        <BeneficiaryBreakdownCard />
                        <BeneficiaryDialog />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center justify-center">
                      {dailyCost === 0 ? (
                        <p>Loading...</p>
                      ) : (
                        <Budget
                          budget={budget}
                          chartData={budgetChartData}
                          totalSavingsOrLoss={totalSavingsOrLoss}
                          dailyCost={dailyCost}
                        />
                      )}{" "}
                    </CardContent>
                  </Card>
                  <Card className="relative border-0 text-white bg-transparent -z-0">
                    <div className="rounded-lg gradient-opacity-mask-flipped"></div>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-white">
                        Savings Over Time
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
          </motion.div>
        </div>
      ) : (
        <div className="flex items-center justify-center m-auto mt-52">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </>
  );

  async function fetchData() {
    setIsClient(true);
    try {
      const username = await getUser();
      setUsername(username.userName);

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
        (transaction) => transaction.transactionType === "WITHDRAWAL"
      );

      // Aggregate and transform data for the chart
      const aggregated = aggregateTransactions(expenseTransactions);
      setBudgetChartData(aggregated);

      console.log(aggregated);

      // Calculate total savings or loss
      const totalExpenses = expenseTransactions.reduce(
        (sum, txn) => sum + txn.amount,
        0
      );
      setTotalSavingsOrLoss(totalBudget - totalExpenses);

      setFinancialHealthPercentage(
        Math.min(
          100,
          Math.max(
            0,
            (cumulativeBalance / totalExpenses) * 130 + // 40% weight: How well balance supports expenses
              ((totalBudget - totalExpenses) / totalBudget) * 130 // 60% weight: Budget savings rate
          )
        )
      );

      console.log(cumulativeBalance, totalExpenses, totalBudget);
      setChartData(balanceOverTime); // Save the balance-over-time data
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

    try {
      const res = await fetch("/api/numbeo"); // Call the API endpoint
      if (!res.ok) throw new Error("Failed to fetch prices");
      const data = await res.json();

      setPrices(data);

      // Calculate daily cost
      const quantities = {
        milkQty: 0.71, // liters/day
        breadQty: 0.42, // 420g/day
        riceQty: 0.21, // kg/day
        cheeseQty: 0.02, // kg/day
        meatQty: 0.25, // kg/day
        chickenQty: 0.25, // kg/day
        eggQty: 0.024, // dozen/day
        fruitQty: 0.5, // kg/day
        vegetableQty: 0.42, // kg/day
      };

      const totalDailyCost =
        (quantities.milkQty * data.milkPrice +
          quantities.breadQty * data.breadPrice +
          quantities.riceQty * data.ricePrice +
          quantities.cheeseQty * data.cheesePrice +
          quantities.meatQty * data.meatPrice +
          quantities.chickenQty * data.chickenPrice +
          quantities.eggQty * data.eggPrice + // Price per dozen
          quantities.fruitQty *
            ((data.applePrice + data.bananaPrice + data.orangePrice) / 3) + // Average fruit price
          quantities.vegetableQty *
            ((data.tomatoPrice +
              data.potatoPrice +
              data.onionPrice +
              data.lettucePrice) /
              4)) *
        1.5; // Premium constant
      setDailyCost(totalDailyCost);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  }
}
