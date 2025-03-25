import { useAuth } from '@/contexts/AuthContext';
import CreditBalance from '@/components/credits/CreditBalance';
import TransactionHistory from '@/components/credits/TransactionHistory';
import TopUpCredits from '@/components/credits/TopUpCredits';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreditsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please sign in to view your credits</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Credits & Billing</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <CreditBalance />
          
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="history">Transaction History</TabsTrigger>
              <TabsTrigger value="topup">Top Up Credits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <TransactionHistory />
            </TabsContent>
            
            <TabsContent value="topup">
              <TopUpCredits />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-700">How credits work</h4>
                <p className="text-sm text-gray-500">
                  Credits are used to send messages across different channels. Each message type has a different credit cost.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Credit costs</h4>
                <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                  <li>WhatsApp: 1 credit per message</li>
                  <li>SMS: 0.5 credits per message</li>
                  <li>Email: 0.1 credits per message</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Bulk discounts</h4>
                <p className="text-sm text-gray-500">
                  Purchase larger credit packages to receive bonus messages and better rates.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need help?</h3>
            <p className="text-sm text-blue-700">
              Contact our support team for assistance with credits, billing, or any other questions.
            </p>
            <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500">
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 