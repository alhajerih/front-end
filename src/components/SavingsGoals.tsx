"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Car, Plane, Home, Gem, Hospital, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProgressCard } from "@/components/ProgressCard";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  getSavings,
  addSaving,
  deleteSaving,
  setFavoriteSaving,
} from "@/app/api/actions/auth";

type SavingsGoal = {
  id: number;
  goal: number;
  label: string;
  currentAmount: number;
  icon?: string;
};

const iconOptions = [
  { value: "car", icon: Car },
  { value: "plane", icon: Plane },
  { value: "house", icon: Home },
  { value: "ring", icon: Gem },
  { value: "hospital", icon: Hospital },
  { value: "wallet", icon: Wallet },
];

export default function SavingsGoals({ balance }: { balance: number }) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [newGoal, setNewGoal] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [newIcon, setNewIcon] = useState<string>("");
  const [completedGoal, setCompletedGoal] = useState<string | null>(null);
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [favoriteSavingId, setFavoriteSavingId] = useState<number | null>(null);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0); // Sum of currentAmount
  const remainingBalance = balance - totalSaved; // Subtract totalSaved from balance

  // Fetch existing savings goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const savings = await getSavings();
        console.log("Fetched savings:", savings);
        setGoals(savings);
      } catch (error) {
        console.error("Failed to fetch savings goals:", error);
      }
    };

    fetchGoals();
  }, []);

  // Add new goal
  const addGoal = async () => {
    const goalAmount = parseFloat(newGoal); // Ensure this is a valid number
    if (goalAmount > 0 && newLabel) {
      try {
        const payload = {
          amount: goalAmount, // Backend expects "amount" instead of "goal"
          name: newLabel, // Backend expects "name" instead of "label"
          icon: newIcon || "", // Optional icon, default to empty string
        };

        console.log("Payload being sent to the backend:", payload);

        const newSaving = await addSaving(payload);

        setGoals([...goals, newSaving]);
        setNewGoal("");
        setNewLabel("");
        setNewIcon("");
        setIsAddGoalDialogOpen(false); // Close the modal
      } catch (error) {
        console.error("Failed to add savings goal:", error);
      }
    } else {
      console.error("Invalid goal amount or label");
    }
  };

  // Delete a goal
  const deleteGoal = async (id: number) => {
    try {
      await deleteSaving(id);
      setGoals(goals.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error("Failed to delete savings goal:", error);
    }
  };

  // Save amount to a goal
  const saveAmount = (id: number, amount: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    );
  };

  // Mark a goal as favorite
  const handleSetFavorite = async (savingId: number) => {
    try {
      await setFavoriteSaving(savingId); // Call the backend API
      setFavoriteSavingId(savingId); // Update the favorite saving ID in state
      console.log(`Saving ID ${savingId} marked as favorite`);
    } catch (error) {
      console.error("Failed to set favorite saving:", error);
    }
  };

  return (
    <div className="p-auto">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 ">
          <Card className="relative border-0 text-white bg-transparent z-0 w-auto flex flex-col justify-center">
            <div className="rounded-lg shadow-lg gradient-opacity-mask w-auto"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-3">
              <CardTitle className="text-xs font-medium text-gray-300">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <div className="text-xl text-white font-bold">
                {Math.floor(balance)}
                <span className="text-gray-400 text-lg">
                  .{balance.toFixed(3).split(".")[1]} {/* Decimal part */}
                </span>{" "}
                KWD
              </div>
              <div className="text-sm text-gray-300 font-medium">
                Remaining Balance:{" "}
                <span className="text-white font-bold">
                  {remainingBalance.toFixed(2)} KWD
                </span>
              </div>
            </CardContent>
          </Card>

          {goals.map((goal) => (
            <ProgressCard
              key={goal.id}
              goal={goal}
              isFavorite={goal.id === favoriteSavingId} // Highlight the favorite
              onDelete={() => deleteGoal(goal.id)}
              onSave={(amount) => saveAmount(goal.id, amount)}
              onSetFavorite={() => handleSetFavorite(goal.id)} // Mark as favorite
            />
          ))}
          <Dialog
            open={isAddGoalDialogOpen}
            onOpenChange={setIsAddGoalDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                className="rounded-full bg-blue-500 my-auto"
                onClick={() => setIsAddGoalDialogOpen(true)}
              >
                <Plus className="h-2 w-2 text-white font-bold" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#050c29] border-[#050c29] rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-zinc-100">
                  Add New Savings Goal
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="goal" className="text-zinc-400">
                    Saving Goal (KWD)
                  </label>
                  <Input
                    id="goal"
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-slate-600 border-slate-600 text-white shadow-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="label" className="text-zinc-400">
                    What are you saving for?
                  </label>
                  <Input
                    id="label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="bg-slate-600 border-slate-600 text-white shadow-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Add icon (optional)</Label>
                  <RadioGroup
                    onValueChange={setNewIcon} // Updates the `newIcon` state when an icon is selected
                    className="flex flex-wrap gap-2"
                  >
                    {iconOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value} // Icon value (e.g., "car", "plane")
                          id={option.value}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={option.value}
                          className={`p-2 rounded-full cursor-pointer ${
                            newIcon === option.value
                              ? "bg-blue-500"
                              : "bg-slate-600"
                          }`}
                        >
                          <option.icon className="h-6 w-6 text-white" />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={addGoal}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add Goal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollBar orientation="horizontal" className="bg-zinc-800" />
      </ScrollArea>
      <Dialog
        open={!!completedGoal}
        onOpenChange={() => setCompletedGoal(null)}
      >
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">
              Congratulations!
            </DialogTitle>
          </DialogHeader>
          <p className="text-zinc-300">You can now afford a {completedGoal}!</p>
          <DialogFooter>
            <Button
              onClick={() => setCompletedGoal(null)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
