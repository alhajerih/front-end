import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Label } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BudgetProps {
  budget: number;
  chartData: any[];
  totalSavingsOrLoss: number;
  dailyCost: number; // Pass dailyCost as a prop
}

export default function Budget({
  budget,
  chartData,
  totalSavingsOrLoss,
  dailyCost,
}: BudgetProps) {
  // Calculation for tips
  // Calculate the threshold for "Eating Out"
  const eatingOutThreshold = dailyCost * 31;
  // Find the "Eating Out" spending from chartData
  const eatingOutData = chartData.find(
    (item) => item.category === "Eating Out"
  );
  const eatingOutAmount = eatingOutData ? eatingOutData.amount : 0;
  // Check if spending on "Eating Out" exceeds the threshold
  const isOverspendingEatingOut = eatingOutAmount > eatingOutThreshold;
  // Find "Subscription spending"
  const subscriptionData = chartData.find(
    (item) => item.category === "Subscription"
  );
  const subscriptionAmount = subscriptionData ? subscriptionData.amount : 0;
  // Find "entertainment" spending
  const entertainmentData = chartData.find(
    (item) => item.category === "Entertainment"
  );
  const entertainmentAmount = entertainmentData ? entertainmentData.amount : 0;
  // Find "rent" spending
  const rentData = chartData.find((item) => item.category === "Rent");
  const rentAmount = rentData ? rentData.amount : 0;
  // Rent threshold (30% of budget)
  const rentThreshold = budget * 0.3;
  // Find "fixed expense" spending
  const fixedExpenseData = chartData.find(
    (item) => item.category === "Fixed Expense"
  );
  const fixedExpenseAmount = fixedExpenseData ? fixedExpenseData.amount : 0;
  // Fixed expense threshold (20% of budget)
  const fixedExpenseThreshold = budget * 0.2;

  return (
    <Card className="flex items-center content-center m-auto">
      <CardContent className="flex-1 pb-0">
        <PieChart width={300} height={200}>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            innerRadius={60}
            outerRadius={100}
            stroke="none"
            paddingAngle={5}
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
                        className="fill-white text-xl font-bold"
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
                        {totalSavingsOrLoss >= 0 ? "Saved" : "Loss"}
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
      <div className="text-center p-0 flex flex-col ">
        {/* Eating out tip */}
        {isOverspendingEatingOut && (
          <div className="mt-4 text-warning text-sm">
            <span className="relative group">
              You could save up to{" "}
              {(eatingOutAmount - eatingOutThreshold).toFixed(0)} KWD by dining
              in!
              <span className="z-50 absolute left-1/2 transform -translate-x-1/2 mt-2 hidden w-max bg-gray-700 text-white text-xs rounded p-1 group-hover:block">
                You are spending {eatingOutAmount.toFixed(3)} KWD on eating out
                this month, which is above your recommended limit of{" "}
                {eatingOutThreshold.toFixed(3)} KWD. Consider dining in more
                often to save money!
              </span>
            </span>
          </div>
        )}
        {/* Subscription tip */}
        {subscriptionAmount > 0 && (
          <div className="mt-4 text-warning text-sm">
            <span className="relative group">
              You could save up to {subscriptionAmount.toFixed(0)} KWD by
              getting rid of unnecessary subscriptions!
              <span className="z-50 absolute left-1/2 transform -translate-x-1/2 mt-2 hidden w-max bg-gray-700 text-white text-xs rounded p-1 group-hover:block">
                You are spending {subscriptionAmount.toFixed(3)} KWD on
                subscriptions this month. Consider using a budgeting app to
                manage your expenses and save money!
              </span>
            </span>
          </div>
        )}{" "}
        {/* Entertainment tip */}
        {entertainmentAmount > 0 && (
          <div className="mt-4 text-warning text-sm">
            <span className="relative group">
              You could save up to {entertainmentAmount.toFixed(0)} KWD by
              trying new things!
              <span className="z-50 absolute left-1/2 transform -translate-x-1/2 mt-2 hidden w-max bg-gray-700 text-white text-xs rounded p-1 group-hover:block">
                You are spending {entertainmentAmount.toFixed(3)} KWD on
                entertainment this month. Consider free or low-cost
                entertainment options like local events, streaming services, or
                outdoor activities!
              </span>
            </span>
          </div>
        )}
        {/* Rent tip */}
        {rentAmount > rentThreshold && (
          <div className="mt-4 text-warning text-sm">
            <span className="relative group">
              Your rent seems quite high!
              <span className="z-50 absolute left-1/2 transform -translate-x-1/2 mt-2 hidden w-max bg-gray-700 text-white text-xs rounded p-1 group-hover:block">
                You are spending {rentAmount.toFixed(3)} KWD on rent this month,
                which is more than 30% of your budget. Consider downsizing or
                negotiating with your landlord.
              </span>
            </span>
          </div>
        )}{" "}
        {/* Fixed expense tip */}
        {fixedExpenseAmount > fixedExpenseThreshold && (
          <div className="mt-4 text-warning text-sm">
            <span className="relative group">
              You're spending quite a bit on fixed expenses!
              <span className="z-50 absolute left-1/2 transform -translate-x-1/2 mt-2 hidden w-max bg-gray-700 text-white text-xs rounded p-1 group-hover:block">
                You are spending {fixedExpenseAmount.toFixed(3)} KWD on fixed
                expenses this month. Consider reviewing your spendings on your
                beneficiaries!
              </span>
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
