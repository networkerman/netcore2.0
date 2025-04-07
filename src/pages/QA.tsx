import React from 'react';
import { TestPanel } from '@/components/qa/TestPanel';
import { TestRunner } from '@/components/qa/TestRunner';

export const QAPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">QA Testing</h1>
        <p className="text-gray-500">
          Run automated tests and monitor logs to ensure platform stability.
        </p>
      </div>

      <div className="grid gap-8">
        <TestRunner />
        <TestPanel />
      </div>
    </div>
  );
}; 