"use client";

import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Budget from "./Budget";

export function BankingDashboardComponent() {
  const [balance, setBalance] = useState(5824.76);

  const budgetData = [
    { name: "Housing", amount: 1200 },
    { name: "Food", amount: 400 },
    { name: "Transport", amount: 200 },
    { name: "Utilities", amount: 150 },
    { name: "Entertainment", amount: 100 },
  ];

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

  const handleDeposit = () => {
    setBalance((prevBalance) => prevBalance + 100);
  };

  const handleWithdrawal = () => {
    if (balance >= 100) {
      setBalance((prevBalance) => prevBalance - 100);
    }
  };

  return (
    <Tabs defaultValue="overview" className="flex space-x-4">
      {/* Tabs List positioned on the left */}
      <TabsList className="flex flex-col space-y-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
      </TabsList>
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
              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
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
                {/* <BarChart data={budgetData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Bar dataKey="amount" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                </BarChart> */}
                <Budget />
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
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
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
      <TabsContent value="transactions">
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>A list of all your transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                  <div
                    className={`ml-auto font-medium ${
                      transaction.amount > 0 ? "text-green-500" : "text-red-500"
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
      </TabsContent>
      <TabsContent value="beneficiaries">
        <Card>
          <CardHeader>
            <CardTitle>Beneficiaries</CardTitle>
            <CardDescription>
              You have {beneficiaries.length} saved beneficiaries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {beneficiaries.map((beneficiary) => (
                <div key={beneficiary.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {beneficiary.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {beneficiary.accountNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
