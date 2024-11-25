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

type SavingsGoal = {
  id: number;
  goal: number;
  label: string;
  currentAmount: number;
  icon?: string;
};

type ProgressCardProps = {
  goal: SavingsGoal;
  onDelete: () => void;
  onSave: (amount: number) => void;
};

const iconMap = {
  car: Car,
  plane: Plane,
  house: Home,
  ring: Gem,
  hospital: Hospital,
  wallet: Wallet,
};

export function ProgressCard({ goal, onDelete, onSave }: ProgressCardProps) {
  const [saveAmount, setSaveAmount] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const progress = (goal.currentAmount / goal.goal) * 100;

  const handleSave = () => {
    const amount = parseFloat(saveAmount);
    if (amount > 0) {
      onSave(amount);
      setSaveAmount("");
      setIsDialogOpen(false);
    }
  };

  const IconComponent = goal.icon
    ? iconMap[goal.icon as keyof typeof iconMap]
    : null;

  return (
    <Card className="w-[290px] h-[120px] p-4 relative border-0 text-white bg-transparent z-0 w-auto h-auto">
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
        <div className="flex items-center space-x-2">
          {IconComponent && <IconComponent className="h-6 w-6 text-blue-500" />}
          <div>
            <h3 className="text-sm font-medium text-zinc-400">
              Your goal towards:
              <p className="text-white font-bold">{goal.label}</p>
            </h3>
            <p className="text-xl font-semibold text-zinc-100">
              {goal.currentAmount.toFixed(2)} KWD / {goal.goal.toFixed(2)} KWD
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Custom Progress Bar */}
          <div className="relative flex-grow h-2 bg-zinc-800 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

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
                    type="number"
                    value={saveAmount}
                    onChange={(e) => setSaveAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-slate-600 border-slate-600 text-white shadow-lg"
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
        </div>
      </div>
    </Card>
  );
}
