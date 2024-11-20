import Budget from "../components/Budget";
import { BankingDashboardComponent } from "@/components/banking-dashboard";

export default function Home() {
  return (
    <div>
      <div className="m-10">
        <BankingDashboardComponent />
      </div>
      {/* <Budget /> */}
    </div>
  );
}
