import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AdPlatform } from '@/types/ad.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface BudgetSchedulerProps {
  platform: AdPlatform;
}

export default function BudgetScheduler({ platform }: BudgetSchedulerProps) {
  const [budgetType, setBudgetType] = useState<'daily' | 'lifetime'>('daily');
  const [budget, setBudget] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasEndDate, setHasEndDate] = useState(false);
  const [bidStrategy, setBidStrategy] = useState<'lowest_cost' | 'target_cost'>('lowest_cost');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Budget Configuration</h3>
        <div className="space-y-4">
          <div>
            <Label>Budget Type</Label>
            <Select value={budgetType} onValueChange={(value: 'daily' | 'lifetime') => setBudgetType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Budget</SelectItem>
                <SelectItem value="lifetime">Lifetime Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget Amount</Label>
              <Input
                id="budget"
                type="number"
                min="1"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={`Enter ${budgetType} budget`}
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Schedule</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={hasEndDate}
              onCheckedChange={setHasEndDate}
              id="end-date-switch"
            />
            <Label htmlFor="end-date-switch">Set End Date</Label>
          </div>

          {hasEndDate && (
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Bidding Strategy</h3>
        <div className="space-y-4">
          <div>
            <Label>Optimization Goal</Label>
            <Select value={bidStrategy} onValueChange={(value: 'lowest_cost' | 'target_cost') => setBidStrategy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bidding strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lowest_cost">Lowest Cost</SelectItem>
                <SelectItem value="target_cost">Target Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {bidStrategy === 'target_cost' && (
            <div>
              <Label htmlFor="targetCost">Target Cost</Label>
              <Input
                id="targetCost"
                type="number"
                min="0.01"
                step="0.01"
                placeholder={`Enter target cost per result (${currency})`}
              />
            </div>
          )}

          {platform === 'meta' && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Meta's machine learning will optimize your ad delivery to get the most results at the lowest cost.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 