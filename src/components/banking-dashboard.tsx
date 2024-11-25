"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid } from "recharts";
import ProfileImage from "../../public/defaultpfp.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import Link from "next/link";

export function BankingDashboardComponent() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(207, 83%, 34%);",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(223, 54%, 34%);",
    },
  } satisfies ChartConfig;

  if (!isClient) {
    return null; // or a loading indicator
  }

  return (
    <Tabs defaultValue="overview" className="flex flex-col space-y-6">
      <div className="relative"></div>

      {/* Tabs Content */}
      <TabsContent value="overview" className="space-y-4">
        {/* scrollable area for the balance and secondary goals */}
        <ScrollArea className="w-11/12 whitespace-nowrap rounded-md ">
          <div className="flex w-max space-x-4">
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
                  {balance.toFixed(3)} KWD{" "}
                </div>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/*Profile card*/}
        <div className="relative w-full max-w-[700px] h-96 overflow-hidden rounded-3xl">
          <div className="relative z-10  p-9">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-200">Welcome back,</p>
                <h1 className="text-3xl font-bold text-white">
                  Hamad Alhajeri
                </h1>
                <p className="text-gray-400">Glad to see you again!</p>
              </div>
              {/* <Link
                href="/profile"
                className="inline-block text-sm text-blue-200 hover:text-blue-100"
              >
                Go to profile
              </Link> */}
            </div>
          </div>
          <Image
            src="/defaultpfp.png"
            alt="background"
            width={600}
            height={400}
            className="absolute inset-0 h-full w-full object-cover"
            priority
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2"></div>

        {/* Budget Breakdown and Savings Chart */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card className="relative border-0 text-white bg-transparent z-0">
            <div className="rounded-lg shadow-lg gradient-opacity-mask-flipped"></div>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">
                Budget Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Budget budget={budget} />
            </CardContent>
          </Card>

          {/* Savings over time  */}
          <Card className="relative border-0 text-white bg-transparent z-0">
            <div className="rounded-lg shadow-lg gradient-opacity-mask-flipped"></div>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">
                Savings Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                    axisLine={true}
                    tick={({ x, y, payload }) => (
                      <text
                        x={x}
                        y={y}
                        fill="#FFFFFF"
                        fontSize="12"
                        textAnchor="end"
                        dy={5}
                      >
                        {`${payload.value.toFixed(0)} KWD`}
                      </text>
                    )}
                    domain={["auto", "auto"]}
                  />

                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
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
                    <linearGradient
                      id="balanceFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(200, 100%, 50%)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(200, 100%, 80%)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="balance"
                    type="monotone"
                    fill="url(#balanceFill)"
                    stroke="hsl(200, 100%, 70%)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
