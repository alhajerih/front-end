import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BeneficiaryList from "./BeneficiaryList";

function BeneficiaryBreakdownCard() {
  return (
    <div className="ml-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Button>View Beneficiaries</Button>
        </DialogTrigger>

        <DialogContent className="bg-slate-600 text-white shadow-lg rounded-lg">
          <DialogHeader></DialogHeader>
          <DialogTitle></DialogTitle>
          <BeneficiaryList />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BeneficiaryBreakdownCard;
