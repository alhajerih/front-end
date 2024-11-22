import Layout from "@/components/Layout";
import LeftSidebar from "@/components/SideBar";
import Transactions from "@/components/Transactions";
import React from "react";

const page = () => {
  return (
    <Layout>
      <div className="bg-[#23395D] p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white">Transactions</h1>
        <Transactions />
      </div>
    </Layout>
  );
};

export default page;
