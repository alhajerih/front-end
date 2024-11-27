import { MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FavoriteGoalCardProps = {
  label: string;
  currentAmount: number;
  goal: number;
};

export function FavoriteGoalCard({
  label,
  currentAmount,
  goal,
  amountAllocatedPerMonth,
  monthsUntilDeadline,
}: FavoriteGoalCardProps) {
  const progress = (currentAmount / goal) * 100;
  const remaining = goal - currentAmount;

  console.log(label, currentAmount, goal);

  return (
    <Card className="relative border-0 text-white bg- p-6 w-auto bg-transparent">
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-xl font-semibold">Main Saving Goal: {label}</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div>
            <div className="bg-[#0D1333] rounded-xl p-4 mb-1">
              <p className="text-xs text-gray-400">Allocating</p>
              <p className="text-base font-semibold">
                {amountAllocatedPerMonth.toFixed(0)} KWD per month
              </p>
            </div>
          </div>
          <div>
            <div className="bg-[#0D1333] rounded-xl p-4">
              <p className="text-xs text-gray-400">Time To Goal</p>
              <p className="text-base font-semibold">
                {Math.ceil((goal - currentAmount) / amountAllocatedPerMonth)}{" "}
                Months
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg
              className="transform -rotate-90 w-full h-full"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
              <circle
                className="text-gray-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="transition-all duration-1000 ease-in-out"
                strokeWidth="10"
                strokeDasharray={264}
                strokeDashoffset={264 - (progress * 264) / 100}
                strokeLinecap="round"
                stroke="url(#progressGradient)"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                transform="scale(-1, -1) translate(-100, -100)"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-bold">{Math.round(progress)}%</p>
              <p className="text-xs text-gray-400">Towards {label}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
