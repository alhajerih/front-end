"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import FoodPrices from "./FoodPrices/FoodPrices";

// Example data for savings/loss per budget category (KWD)
const chartData = [
  { category: "Food & Groceries", amount: 300, fill: "var(--color-food)" },
  {
    category: "Entertainment",
    amount: 20,
    fill: "var(--color-entertainment)",
  },
  { category: "Transportation", amount: 50, fill: "var(--color-transport)" },
  {
    category: "Subscriptions",
    amount: 10,
    fill: "var(--color-subscriptions)",
  },
  { category: "Other", amount: 30, fill: "var(--color-other)" },
];

export default function Budget() {
  const [totalSavingsOrLoss, setTotalSavingsOrLoss] = React.useState(0);
  const [budget, setBudget] = React.useState(800);
  const [prices, setPrices] = React.useState(0);
  const [dailyCost, setDailyCost] = React.useState(0);

  React.useEffect(() => {
    // Total savings/loss
    setTotalSavingsOrLoss(
      chartData.reduce((acc, curr) => acc - curr.amount, budget)
    );
  });

  return (
    <Card className="flex flex-col">
      <div className="hidden">
        <FoodPrices
          prices={prices}
          setPrices={setPrices}
          dailyCost={dailyCost}
          setDailyCost={setDailyCost}
        />
      </div>

      {/* <CardHeader className="items-center pb-0">
        <CardTitle>Budget Savings & Loss</CardTitle>
        <CardDescription>Monthly Overview</CardDescription>
      </CardHeader> */}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}} // Fallback to an empty object if undefined
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
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
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {totalSavingsOrLoss > 0
            ? `Saving ${totalSavingsOrLoss} KWD this month with a budget of ${budget} KWD`
            : `Losing ${Math.abs(
                totalSavingsOrLoss
              )} KWD this month with a budget of ${budget} KWD`}{" "}
        </div>
        <div className="leading-none text-muted-foreground">
          Savings/Loss based on current month's budget and expenses.
        </div>
        <div>
          {/* If dailyCost*31 is 20% less than food and groceries, suggest to pay less on food */}
          {dailyCost * 31 < 0.8 * chartData[0].amount
            ? `You are spending ${Math.abs(
                dailyCost * 31 - chartData[0].amount
              ).toFixed(
                2
              )} KWD more on food and groceries compared to the average cost`
            : null}{" "}
        </div>
      </CardFooter>
    </Card>
  );
}
