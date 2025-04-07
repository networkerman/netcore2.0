import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { KeywordConfigManager } from "@/components/KeywordConfigManager";
import { AutoReplyService } from "@/lib/services/auto-reply.service";

const Settings = () => {
  const { toast } = useToast();
  const [metaIntegration, setMetaIntegration] = useState(true);
  const [googleIntegration, setGoogleIntegration] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize Auto Reply service
    const initializeService = async () => {
      try {
        await AutoReplyService.getInstance().initialize();
        setIsInitialized(true);
      } catch (error) {
        toast({
          title: "Error initializing settings",
          description: error instanceof Error ? error.message : "Failed to initialize settings.",
          variant: "destructive",
        });
      }
    };
    
    initializeService();
  }, [toast]);
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleConfigUpdate = async (configs: any[]) => {
    try {
      // Save the updated configurations
      await Promise.all(configs.map(config => AutoReplyService.getInstance().updateKeywordConfig(config)));
      toast({
        title: "Auto Reply settings updated",
        description: "Your auto reply configurations have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error updating settings",
        description: error instanceof Error ? error.message : "Failed to update auto reply configurations.",
        variant: "destructive",
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="auto-reply">Auto Reply</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your general application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" placeholder="Enter company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">EST</SelectItem>
                      <SelectItem value="PST">PST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Integrations</CardTitle>
              <CardDescription>
                Connect your advertising and marketing platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Meta (Facebook & Instagram)</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect your Meta Business account
                  </p>
                </div>
                <Switch
                  checked={metaIntegration}
                  onCheckedChange={setMetaIntegration}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Google Ads</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect your Google Ads account
                  </p>
                </div>
                <Switch
                  checked={googleIntegration}
                  onCheckedChange={setGoogleIntegration}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-reply" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto Reply Settings</CardTitle>
              <CardDescription>
                Configure automated responses for your WhatsApp chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeywordConfigManager onConfigUpdate={handleConfigUpdate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
