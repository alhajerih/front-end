import Layout from "@/components/Layout";
import LeftSidebar from "@/components/SideBar";
import Transactions from "@/components/Transactions";
import { getUser } from "@/lib/token";
import React from "react";

const page = async () => {
  const user = await getUser();
  return (
    <Layout>
      <div className=" p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white">Transactions</h1>
        <Transactions />
      </div>
    </Layout>
  );
};

export default page;
