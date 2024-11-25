import React, { useEffect } from "react";
import { PieChart, Pie, Tooltip, Label } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BudgetProps {
  budget: number;
  chartData: any[];
  totalSavingsOrLoss: number;
}

export default function Budget({
  budget,
  chartData,
  totalSavingsOrLoss,
}: BudgetProps) {
  // Get numbeo GET data
  useEffect(() => {}, []);

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
      <CardFooter className="text-center p-0">
        {totalSavingsOrLoss > 0
          ? `Saving ${totalSavingsOrLoss} KWD this month with a budget of ${budget} KWD`
          : `Losing ${Math.abs(
              totalSavingsOrLoss
            )} KWD this month with a budget of ${budget} KWD`}
      </CardFooter>
    </Card>
  );
}
