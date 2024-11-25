"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DollarSign } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getTransactions, Transaction } from "@/app/api/actions/auth";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function SavingsChart({ chartData }) {
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

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        key={JSON.stringify(chartData)} // Ensure a new key is generated when chartData changes
        // ^ Ensures that the animation happens even if data takes a moment to load
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
              dy={5} // Adjust position if needed
            >
              {`${payload.value.toFixed(0)} KWD`} {/* Format the value */}
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
              stopColor="hsl(200, 100%, 50%)" // Light blue at 5% offset
              stopOpacity={0.8} // High opacity for contrast
            />
            <stop
              offset="95%"
              stopColor="hsl(200, 100%, 80%)" // Even lighter blue at 95% offset
              stopOpacity={0.1} // Low opacity for smooth gradient fade
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="balance"
          type="monotone"
          fill="url(#balanceFill)"
          stroke="hsl(200, 100%, 70%)" // Strong contrasting light blue
          strokeWidth={2} // Optional: Adjust stroke width for visibili
          animationDuration={800} // Animation duration in milliseconds
          animationEasing="ease-in-out" // Easing function for smoother animation
        />
      </AreaChart>
    </ChartContainer>
  );
}

export default SavingsChart;
