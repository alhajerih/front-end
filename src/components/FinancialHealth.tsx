"use client";

import { SmileIcon, MehIcon, FrownIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialHealthProps {
  percentage: number; // Value passed in from backend
}

export function FinancialHealth({ percentage }: FinancialHealthProps) {
  // Determine the emoji based on percentage
  const getEmoji = (value: number) => {
    if (value >= 60) return <SmileIcon className="h-8 w-8" />;
    if (value >= 30) return <MehIcon className="h-8 w-8" />;
    return <FrownIcon className="h-8 w-8" />;
  };

  // Determine the color gradient based on percentage
  const getColor = (value: number) => {
    if (value >= 60) return "from-blue-600 to-blue-400"; // Blue
    if (value >= 30) return "from-yellow-500 to-yellow-300"; // Yellow
    return "from-red-600 to-red-400"; // Red
  };

  // Calculate the rotation for the gauge fill
  const rotation = (percentage / 100) * 180;

  return (
    <Card className="relative border-0 text-white bg-transparent z-10">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold pb-0">
          Financial Health
        </CardTitle>
        <div className="relative group inline-block">
          <p className="text-xs text-zinc-400 -mt-1">
            Calculated based off your FHS (Financial Health Score)
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max rounded-md bg-gray-800 text-white text-xs px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
            Financial Health Score is calculated based on savings, expenses, and
            budget.
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center pt-2 pb-0">
        <div className="relative w-40 h-20">
          {/* Background Track */}
          <div
            className="absolute inset-0 overflow-hidden rounded-t-full bg-zinc-800"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            {/* Colored Fill */}
            <div
              className={`absolute top-0 left-0 w-full h-full origin-bottom bg-gradient-to-r ${getColor(
                percentage
              )}`}
              style={{
                transform: `rotate(${rotation - 180}deg)`,
                transition: "transform 1s ease-out",
              }}
            />
          </div>
          {/* Emoji Container */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-3 rounded-full bg-blue-500 text-white">
            {getEmoji(percentage)}
          </div>
        </div>
        <div className="mt-8 text-3xl font-bold">{percentage.toFixed(1)}%</div>
        <div className="absolute bottom-0 p-6 pb-16 w-full flex justify-between text-sm text-zinc-400 mt-2 ">
          <span>0%</span>
          <span>100%</span>
        </div>
      </CardContent>
    </Card>
  );
}
