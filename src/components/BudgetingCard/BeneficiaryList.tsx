"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { getHeaders } from "@/app/api/actions/config";

interface FixedPayment {
  id: string;
  name: string;
  amount: number;
}

interface Beneficiary {
  id: string;
  name: string;
  doesNeedGroceries: boolean;
  groceriesMultiplier: number;
  fixedPaymentList: FixedPayment[];
}

export default function BeneficiaryList() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBeneficiaries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8081/api/v1/user/beneficiaries",
        {
          method: "GET",
          headers: await getHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch beneficiaries");
      }
      const data = await response.json();
      setBeneficiaries(data);
    } catch (err) {
      setError("An error occurred while fetching beneficiaries");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Beneficiaries</h2>
        <Button
          onClick={fetchBeneficiaries}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>
      {error && (
        <div
          className="bg-red-600 text-white px-4 py-3 rounded-lg"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}
      {beneficiaries.length === 0 && !loading && !error ? (
        <p className="text-zinc-400">No beneficiaries found.</p>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="space-y-4 bg-[#050c29] p-4 rounded-lg"
        >
          {beneficiaries.map((beneficiary) => (
            <AccordionItem key={beneficiary.id} value={beneficiary.id}>
              <Card className="bg-slate-600 text-white shadow-lg rounded-lg">
                <CardHeader className="py-0">
                  <CardTitle className="p-0">
                    <AccordionTrigger className="text-white ">
                      {beneficiary.name}
                    </AccordionTrigger>
                  </CardTitle>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <p className="text-zinc-400">
                      Needs Groceries:{" "}
                      <span className="text-white">
                        {beneficiary.doesNeedGroceries ? "Yes" : "No"}
                      </span>
                    </p>
                    {beneficiary.doesNeedGroceries && (
                      <p className="text-zinc-400">
                        Groceries Multiplier:{" "}
                        <span className="text-white">
                          {beneficiary.groceriesMultiplier}
                        </span>
                      </p>
                    )}
                    <h3 className="font-semibold mt-4 mb-2 text-white">
                      Fixed Payments:
                    </h3>
                    {beneficiary.fixedPaymentList.length > 0 ? (
                      <ul className="list-disc pl-5 text-zinc-400">
                        {beneficiary.fixedPaymentList.map((payment) => (
                          <li key={payment.id} className="text-white">
                            {payment.name}: {payment.amount} KWD
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-zinc-400">No fixed payments.</p>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
