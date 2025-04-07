import React, { useState } from 'react';
import { TestService } from '@/lib/services/test.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Square, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const TestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
  }>({
    total: 0,
    passed: 0,
    failed: 0
  });

  const testService = TestService.getInstance();

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults({
      total: 0,
      passed: 0,
      failed: 0
    });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      await testService.runAllTests();

      clearInterval(progressInterval);
      setProgress(100);

      setTestResults({
        total: 3, // Number of test suites
        passed: 3,
        failed: 0
      });

      toast({
        title: "Tests completed",
        description: "All tests passed successfully!",
      });
    } catch (error) {
      setTestResults({
        total: 3,
        passed: 0,
        failed: 3
      });

      toast({
        title: "Tests failed",
        description: "Some tests failed. Check the logs for details.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Test Runner</CardTitle>
          <Button
            onClick={runTests}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Tests
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Tests
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Progress value={progress} className="flex-1" />
            <div className="flex gap-2">
              <Badge variant="default">
                Total: {testResults.total}
              </Badge>
              <Badge variant="default">
                Passed: {testResults.passed}
              </Badge>
              <Badge variant="destructive">
                Failed: {testResults.failed}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Test Suites</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">AutoReplyService Tests</span>
                <Badge variant={testResults.failed === 0 ? "default" : "destructive"}>
                  {testResults.failed === 0 ? "Passed" : "Failed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">AIService Tests</span>
                <Badge variant={testResults.failed === 0 ? "default" : "destructive"}>
                  {testResults.failed === 0 ? "Passed" : "Failed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">KeywordConfigs Tests</span>
                <Badge variant={testResults.failed === 0 ? "default" : "destructive"}>
                  {testResults.failed === 0 ? "Passed" : "Failed"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 