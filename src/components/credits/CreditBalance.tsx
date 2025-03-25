import { useAuth } from '@/contexts/AuthContext';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CreditBalance() {
  const { creditBalance } = useAuth();

  const formatAmount = (amount: number) => {
    const inRupees = amount / 100; // Convert paise to rupees
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(inRupees);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Credit Balance</h3>
          <p className="text-3xl font-bold mt-2">
            {creditBalance ? formatAmount(creditBalance.balance) : '---'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Available credits for services
          </p>
        </div>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Credits
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">WhatsApp</p>
          <p className="text-lg font-semibold mt-1">
            {creditBalance ? Math.floor(creditBalance.balance / 100) : '0'} msgs
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-lg font-semibold mt-1">
            {creditBalance ? Math.floor(creditBalance.balance / 25) : '0'} emails
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">SMS</p>
          <p className="text-lg font-semibold mt-1">
            {creditBalance ? Math.floor(creditBalance.balance / 50) : '0'} msgs
          </p>
        </div>
      </div>
    </Card>
  );
} 