"use client";

import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Users } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Budget from "./Budget";

export function BankingDashboardComponent() {
  const [balance, setBalance] = useState(5824.76);

  const transactions = [
    {
      id: 1,
      description: "Grocery Shopping",
      amount: -75.5,
      date: "2023-06-15",
    },
    { id: 2, description: "Salary Deposit", amount: 3000, date: "2023-06-01" },
    { id: 3, description: "Electric Bill", amount: -120, date: "2023-06-10" },
    {
      id: 4,
      description: "Online Purchase",
      amount: -49.99,
      date: "2023-06-12",
    },
  ];

  const beneficiaries = [
    { id: 1, name: "John Doe", accountNumber: "**** 1234" },
    { id: 2, name: "Jane Smith", accountNumber: "**** 5678" },
    { id: 3, name: "Alice Johnson", accountNumber: "**** 9012" },
  ];

  const handleDeposit = () => setBalance((prev) => prev + 100);

  const handleWithdrawal = () => {
    if (balance >= 100) setBalance((prev) => prev - 100);
  };

  return (
    <Tabs defaultValue="overview" className="flex flex-col m-5 space-y-6">
      <div className="relative"></div>

      {/* Tabs Content */}
      <TabsContent value="overview" className="space-y-4">
        {/* scrollable area for the balance and secondary goals */}
        <ScrollArea className="ml-9 w-11/12 whitespace-nowrap rounded-md ">
          <div className="flex w-max space-x-4 p-4">
            {/* Total Balance Card */}
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
                  ${balance.toFixed(2)}
                  <p>/90,000 saved</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Beneficiaries Card */}
          <Card className="relative border-0 text-white bg-transparent z-0">
            <div className=" rounded-lg shadow-lg gradient-opacity-mask"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Beneficiaries
              </CardTitle>
              <Users className="h-4 w-4 text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-white font-bold">
                {beneficiaries.length}
              </div>
            </CardContent>
          </Card>

          {/* Deposit Card */}
          <Card className="relative border-0 text-white bg-transparent z-0">
            <div className="rounded-lg shadow-lg gradient-opacity-mask"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Deposit
              </CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-gray-300" />
            </CardHeader>
            <CardContent>
              <Button onClick={handleDeposit} className="w-full">
                Deposit $100
              </Button>
            </CardContent>
          </Card>

          {/* Withdraw Card */}
          <Card className="relative border-0 text-white bg-transparent z-0">
            <div className="rounded-lg shadow-lg gradient-opacity-mask"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Withdraw
              </CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-gray-300" />
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

        {/* Budget Breakdown and Transactions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 relative border-0 text-white bg-transparent z-0">
            <div className="rounded-lg shadow-lg gradient-opacity-mask"></div>

            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">
                Budget Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Budget />
            </CardContent>
          </Card>
          <Card className="col-span-3 relative border-0 text-white bg-transparent z-0">
            <div className="rounded-lg shadow-lg gradient-opacity-mask"></div>

            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">
                Recent Transactions
              </CardTitle>
              <CardDescription className="text-sm text-gray-300">
                You made {transactions.length} transactions this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium text-gray-300">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.date}
                      </p>
                    </div>
                    <div
                      className={`ml-auto font-medium ${
                        transaction.amount > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
