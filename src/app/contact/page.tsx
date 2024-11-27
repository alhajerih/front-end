"use client";

import { TeamMember } from "@/components/TeamMember";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
// React
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Mohammad Baqer",
    image: "/Mohammad.png",
  },
  {
    name: "Hamad Alhajeri",
    image: "/IMG-20240929-WA0018.jpg",
  },
  {
    name: "Salem AlMutairi",
    image: "/Salem.png",
  },
  {
    name: "Osama Albader",
    image: "/Osama.png",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function TeamPage() {
  return (
    <Layout>
      <div className="min-h-screen  flex flex-col items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl font-bold text-center text-white mb-12">
            Our Team
          </h1>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teamMembers.map((member) => (
              <motion.div key={member.name} variants={itemVariants}>
                <TeamMember
                  name={member.name}
                  role={member.role}
                  image={member.image}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-white mb-4">
              Any Questions?
            </h2>
            <p className="text-white mb-6">
              We're here to help! Feel free to reach out.
            </p>
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
              Send an email!
            </Button>
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-2">Thank You</h2>
            <p className="text-white text-xl">for visiting our team page!</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
