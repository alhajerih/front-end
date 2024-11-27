import { Card } from "@/components/ui/card";
import React from "react";

// Declare input types
type GreetingCardProps = {
  username: string;
};

function GreetingCard({ username }: GreetingCardProps) {
  return (
    <Card className="rounded-3xl overflow-hidden relative border-0 text-white bg-[url('/defaultpfp.png')] bg-cover bg-center z-0 col-span-9 h-64">
      <div className="rounded-lg shadow-lg gradient-opacity-mask-light w-auto"></div>
      <p className="text-xs text-gray-400 pt-6 pl-6">Welcome back,</p>
      <h2 className="capitalize pl-6 text-3xl">{username}</h2>
      <p className="text-xs text-gray-400 pt-2 pl-6">Glad to see you again!</p>
    </Card>
  );
}

export default GreetingCard;
