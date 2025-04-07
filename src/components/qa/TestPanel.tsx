import React, { useState, useEffect } from 'react';
import { LoggingService } from '@/lib/services/logging.service';
import { LogEntry, LogLevel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash, Download, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const TestPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const loggingService = LoggingService.getInstance();

  useEffect(() => {
    loadLogs();
  }, [selectedLevel]);

  const loadLogs = () => {
    if (selectedLevel === 'all') {
      setLogs(loggingService.getLogs());
    } else {
      setLogs(loggingService.getLogs(selectedLevel));
    }
  };

  const handleClearLogs = () => {
    loggingService.clearLogs();
    setLogs([]);
    toast({
      title: "Logs cleared",
      description: "All logs have been cleared successfully.",
    });
  };

  const handleDownloadLogs = () => {
    const logText = logs
      .map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return 'bg-red-500';
      case 'warn':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      case 'debug':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>QA Testing Panel</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearLogs}
            >
              <Trash className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadLogs}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Logs
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadLogs}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedLevel}
              onValueChange={(value) => setSelectedLevel(value as LogLevel | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
                <SelectItem value="warn">Warnings</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Badge variant="destructive">
                {loggingService.getErrorCount()} Errors
              </Badge>
              <Badge variant="secondary">
                {loggingService.getWarningCount()} Warnings
              </Badge>
            </div>
          </div>

          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2 p-2 rounded hover:bg-gray-100"
                >
                  <Badge className={getLevelColor(log.level)}>
                    {log.level}
                  </Badge>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{log.message}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    {log.details && (
                      <pre className="mt-1 text-xs bg-gray-50 p-2 rounded">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No logs found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}; 