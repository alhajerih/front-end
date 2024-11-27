import { FavoriteGoalCard } from "@/components/FirstRow/FavoriteGoalCard/FavoriteGoalCard";
import { Card } from "@/components/ui/card";
import React from "react";

// Declare input types
type FavoriteGoalCardProps = {
  favoriteGoal: SavingGoal;
};

type SavingGoal = {
  id: number;
  name: string;
  amount: number;
  currentAmount: number;
  amountAllocatedPerMonth: number;
  monthsUntilDeadline: number;
  icon: string;
};

function FavoriteGoalCardWrapper({ favoriteGoal }: FavoriteGoalCardProps) {
  return (
    <Card className="relative border-0 text-white bg-transparent z-0 col-span-6">
      <div className="rounded-lg shadow-lg gradient-opacity-mask w-auto"></div>
      {favoriteGoal ? (
        <FavoriteGoalCard
          goal={favoriteGoal.amount}
          key={favoriteGoal.id}
          label={favoriteGoal.name}
          currentAmount={favoriteGoal.currentAmount}
          amountAllocatedPerMonth={favoriteGoal.amountAllocatedPerMonth}
          monthsUntilDeadline={favoriteGoal.monthsUntilDeadline}
        />
      ) : (
        <p className="text-xs text-gray-400 pt-6 pl-6">No favorite goal set.</p>
      )}
    </Card>
  );
}

export default FavoriteGoalCardWrapper;
