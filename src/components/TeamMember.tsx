"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { motion } from "framer-motion";
interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

export function TeamMember({ name, role, image }: TeamMemberProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card className="bg-[#1E3A8A]/20 border-[#3B82F6]/20 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
        <CardContent className="p-8 flex flex-col items-center">
          <Avatar className="w-22 h-22 mb-4 ring-2 ring-[#3B82F6] ring-offset-2 ring-offset-[#0A1A2F]">
            <AvatarImage
              src={image}
              alt={name}
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-[#3B82F6] ">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-white text-center mb-1">
            {name}
          </h2>
          <p className="text-[#3B82F6] text-sm">{role}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
