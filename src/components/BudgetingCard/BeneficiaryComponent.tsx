"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Minus } from "lucide-react";
import { getHeaders } from "@/app/api/actions/config";

interface FixedPayment {
  name: string;
  amount: number;
}

export default function BeneficiaryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [doesNeedGroceries, setDoesNeedGroceries] = useState(false);
  const [groceriesMultiplier, setGroceriesMultiplier] = useState(1);
  const [fixedPayments, setFixedPayments] = useState<FixedPayment[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const beneficiaryResponse = await fetch(
        "http://localhost:8081/api/v1/user/beneficiaries",
        {
          method: "POST",
          headers: await getHeaders(),
          body: JSON.stringify({
            name,
            doesNeedGroceries,
            groceriesMultiplier,
          }),
        }
      );

      if (!beneficiaryResponse.ok)
        throw new Error("Failed to create beneficiary");

      const beneficiary = await beneficiaryResponse.json();

      for (const payment of fixedPayments) {
        const paymentResponse = await fetch(
          `http://localhost:8081/api/v1/user/savings/fixed-payments/${beneficiary.id}`,
          {
            method: "POST",
            headers: await getHeaders(),
            body: JSON.stringify(payment),
          }
        );

        if (!paymentResponse.ok)
          throw new Error("Failed to create fixed payment");
      }

      setOpen(false);
      // Reset form
      setName("");
      setDoesNeedGroceries(false);
      setGroceriesMultiplier(1);
      setFixedPayments([]);
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const addFixedPayment = () => {
    setFixedPayments([...fixedPayments, { name: "", amount: 0 }]);
  };

  const removeFixedPayment = (index: number) => {
    setFixedPayments(fixedPayments.filter((_, i) => i !== index));
  };

  const updateFixedPayment = (
    index: number,
    field: keyof FixedPayment,
    value: string | number
  ) => {
    const updatedPayments = [...fixedPayments];
    updatedPayments[index] = { ...updatedPayments[index], [field]: value };
    setFixedPayments(updatedPayments);
  };

  return (
    <div className="self-end ml-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="rounded-full bg-blue-500 my-auto"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-2 w-2 text-white font-bold" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#050c29] border-[#050c29] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Add Beneficiary</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-400">
                Name
              </Label>
              <Input
                id="name"
                className="bg-slate-600 border-slate-600 text-white shadow-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="groceries"
                checked={doesNeedGroceries}
                onCheckedChange={setDoesNeedGroceries}
                className="bg-blue-500"
              />
              <Label htmlFor="groceries" className="text-zinc-400">
                Needs Groceries
              </Label>
            </div>
            {doesNeedGroceries && (
              <div className="space-y-2">
                <Label htmlFor="multiplier" className="text-zinc-400">
                  Groceries Multiplier
                </Label>
                <Input
                  id="multiplier"
                  type="number"
                  step="0.1"
                  value={groceriesMultiplier}
                  onChange={(e) =>
                    setGroceriesMultiplier(parseFloat(e.target.value))
                  }
                  placeholder="Enter multiplier"
                  className="bg-slate-600 border-slate-600 text-white shadow-lg"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-zinc-400">Fixed Payments</Label>
              <br />
              {fixedPayments.map((payment, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    placeholder="Payment Name"
                    className="bg-slate-600 border-slate-600 text-white shadow-lg"
                    value={payment.name}
                    onChange={(e) =>
                      updateFixedPayment(index, "name", e.target.value)
                    }
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    className="bg-slate-600 border-slate-600 text-white shadow-lg"
                    value={payment.amount}
                    onChange={(e) =>
                      updateFixedPayment(
                        index,
                        "amount",
                        parseInt(e.target.value)
                      )
                    }
                    required
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => removeFixedPayment(index)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={addFixedPayment}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Fixed Payment
              </Button>
            </div>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            >
              Create Beneficiary
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
