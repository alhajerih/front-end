import { BankingDashboardComponent } from "@/components/banking-dashboard";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="bg-[#23395D] p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white">Home Page</h1>
        <p className="mt-4 text-gray-300">Welcome to the home page.</p>
        <BankingDashboardComponent />
      </div>
    </Layout>
  );
}
