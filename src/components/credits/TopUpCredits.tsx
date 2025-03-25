import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const CREDIT_PACKAGES = [
  { id: 1, amount: 500000, description: '₹5,000 - 5,000 messages' },
  { id: 2, amount: 1000000, description: '₹10,000 - 11,000 messages' },
  { id: 3, amount: 2000000, description: '₹20,000 - 24,000 messages' },
  { id: 4, amount: 5000000, description: '₹50,000 - 65,000 messages' },
];

export default function TopUpCredits() {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const amount = selectedPackage === 'custom' 
        ? parseInt(customAmount) * 100 // Convert to paise
        : parseInt(selectedPackage);

      // TODO: Integrate with your payment gateway
      // For now, we'll just log the amount
      console.log('Processing payment for amount:', amount);
      
      // After successful payment, create a credit transaction
      // await createCreditTransaction({
      //   userId: user.id,
      //   amount,
      //   type: 'credit',
      //   status: 'completed',
      //   description: 'Credit top-up'
      // });

    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Up Credits</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Select Package</Label>
          <Select
            value={selectedPackage}
            onValueChange={setSelectedPackage}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a package" />
            </SelectTrigger>
            <SelectContent>
              {CREDIT_PACKAGES.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.amount.toString()}>
                  {pkg.description}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedPackage === 'custom' && (
          <div>
            <Label>Custom Amount (₹)</Label>
            <Input
              type="number"
              min="1000"
              step="100"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount in rupees"
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum amount: ₹1,000
            </p>
          </div>
        )}

        <Button
          onClick={handleTopUp}
          disabled={loading || !selectedPackage || (selectedPackage === 'custom' && !customAmount)}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Proceed to Payment'
          )}
        </Button>

        <div className="text-sm text-gray-500 mt-4">
          <p>Note:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Credits will be added to your account immediately after payment</li>
            <li>Bulk packages offer better value with bonus messages</li>
            <li>GST will be added to the final amount</li>
          </ul>
        </div>
      </div>
    </Card>
  );
} 