import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Car, Plane, Home, Gem, Hospital, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateSavingAmount } from "@/app/api/actions/auth";

type SavingsGoal = {
  id: number;
  name: string;
  amount: number;
  goal: number;
  label: string;
  currentAmount: number;
  icon?: string;
};

type ProgressCardProps = {
  goal: SavingsGoal;
  isFavorite: boolean; // Flag to indicate if this is the favorite saving
  onDelete: () => void;
  onSave: (amount: number) => void;
  onSetFavorite: () => void; // Function to set this saving as the favorite
};

const iconMap = {
  car: Car,
  plane: Plane,
  house: Home,
  ring: Gem,
  hospital: Hospital,
  wallet: Wallet,
};

import { Star } from "lucide-react";

export function ProgressCard({
  goal,
  isFavorite,
  onDelete,
  onSave,
  onSetFavorite,
}: ProgressCardProps) {
  const [saveAmount, setSaveAmount] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = async () => {
    const amount = parseFloat(saveAmount);
    const remainingAmount = goal.amount - goal.currentAmount;

    if (amount > 0) {
      if (amount > remainingAmount) {
        alert(
          `You can only add up to ${remainingAmount.toFixed(
            2
          )} KWD to this goal.`
        );
        return; // Prevent further execution if the amount exceeds the limit
      }
      try {
        await updateSavingAmount(goal.id, amount); // Call backend API to update the savings goal
        onSave(amount); // Update the local UI state
        setSaveAmount(""); // Clear input field
        setIsDialogOpen(false); // Close modal
      } catch (error) {
        console.error("Failed to save amount:", error);
      }
    } else {
      alert("Please enter a valid amount greater than 0.");
    }
  };

  const progress = (goal.currentAmount / goal.amount) * 100;
  const IconComponent = goal.icon
    ? iconMap[goal.icon as keyof typeof iconMap]
    : null;

  return (
    <Card
      className={`p-4 relative border-0 text-white bg-transparent z-0 w-auto h-auto pr-10 ${
        isFavorite ? "border-yellow-500" : ""
      }`}
    >
      <div className="rounded-lg shadow-lg gradient-opacity-mask w-auto"></div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-zinc-500 hover:bg-red-600"
        onClick={onDelete}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          {IconComponent && <IconComponent className="h-6 w-9 text-blue-500" />}
          <div>
            <p className="text-xs font-semibold text-zinc-100">{goal.name} </p>
            <p className="text-xs font-semibold text-zinc-100">
              {goal.currentAmount !== undefined && goal.currentAmount !== null
                ? goal.currentAmount.toFixed(0)
                : "0.00"}{" "}
              KWD /{" "}
              {goal.amount !== undefined && goal.amount !== null
                ? goal.amount.toFixed(0)
                : "0.00"}{" "}
              KWD
            </p>
          </div>
        </div>
        <div className="relative flex-grow h-2 bg-zinc-800 rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex space-x-2 justify-between">
          {/* Custom Progress Bar */}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-800 bg-zinc-900 hover:bg-blue-500 text-white"
              >
                Save
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#050c29] border-[#050c29] rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-zinc-100">Save Amount</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="saveAmount" className="text-zinc-400">
                    Amount to Save (KWD)
                  </label>
                  <Input
                    id="saveAmount"
                    type="text" // Use text to have complete control over input handling
                    value={saveAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numeric values, optionally including a single decimal point
                      if (/^\d*\.?\d*$/.test(value)) {
                        setSaveAmount(value);
                      }
                    }}
                    placeholder="Enter amount"
                    className="bg-slate-600 border-slate-600 text-white shadow-lg"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Amount
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            className={`border-zinc-800 bg-zinc-900 hover:bg-yellow-500 text-white ml-auto ${
              isFavorite ? "bg-yellow-500" : ""
            }`}
            onClick={onSetFavorite} // Trigger favorite action
          >
            <Star
              className={`h-4 w-4 ${
                isFavorite ? "text-yellow-400" : "text-white"
              }`}
            />
          </Button>
        </div>
      </div>
    </Card>
  );
}
