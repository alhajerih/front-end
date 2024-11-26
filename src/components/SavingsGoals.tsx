"use client";

import { useState } from "react";
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

export default function SavingsGoals({ balance }) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [newGoal, setNewGoal] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [newIcon, setNewIcon] = useState<string>("");
  const [completedGoal, setCompletedGoal] = useState<string | null>(null);

  const addGoal = () => {
    const goalAmount = parseFloat(newGoal);
    if (goalAmount > 0 && newLabel) {
      setGoals([
        ...goals,
        {
          id: Date.now(),
          goal: goalAmount,
          label: newLabel,
          currentAmount: 0,
          icon: newIcon,
        },
      ]);
      setNewGoal("");
      setNewLabel("");
      setNewIcon("");
    }
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const saveAmount = (id: number, amount: number) => {
    setGoals(
      goals
        .map((goal) => {
          if (goal.id === id) {
            const newAmount = Math.min(goal.currentAmount + amount, goal.goal);
            if (newAmount === goal.goal) {
              setCompletedGoal(goal.label);
              return null;
            }
            return { ...goal, currentAmount: newAmount };
          }
          return goal;
        })
        .filter(Boolean) as SavingsGoal[]
    );
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
                {/* Integer part */}
                <span className="text-gray-400 text-lg">
                  .{balance.toFixed(3).split(".")[1]} {/* Decimal part */}
                </span>{" "}
                KWD
              </div>
            </CardContent>
          </Card>

          {goals.map((goal) => (
            <ProgressCard
              key={goal.id}
              goal={goal}
              onDelete={() => deleteGoal(goal.id)}
              onSave={(amount) => saveAmount(goal.id, amount)}
            />
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-blue-500 my-auto">
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
                    onValueChange={setNewIcon}
                    className="flex flex-wrap gap-2"
                  >
                    {iconOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
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
