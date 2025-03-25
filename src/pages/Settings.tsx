import { useState } from "react";
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
  const autoReplyService = new AutoReplyService();
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleConfigUpdate = (configs: any[]) => {
    // Save the updated configurations
    configs.forEach(config => {
      autoReplyService.updateKeywordConfig(config);
    });
    toast({
      title: "Auto Reply settings updated",
      description: "Your auto reply configurations have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your CTWA integration and dashboard preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Ad Integrations</TabsTrigger>
          <TabsTrigger value="tracking">Conversion Tracking</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="auto-reply">Auto Reply</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Netcore Solutions" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="whatsapp-number">WhatsApp Business Number</Label>
                    <Input id="whatsapp-number" defaultValue="+1234567890" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc+0">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                        <SelectItem value="utc+5.5">Indian Standard Time (UTC+5:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="inr">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="date-format" className="flex flex-col space-y-1">
                    <span>Date Format</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Choose how dates are displayed in the dashboard
                    </span>
                  </Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit">Save Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ad Platform Integrations</CardTitle>
              <CardDescription>
                Connect your ad accounts to track CTWA performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">Meta Ads</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to Facebook and Instagram ads
                    </p>
                  </div>
                  <Switch checked={metaIntegration} onCheckedChange={setMetaIntegration} />
                </div>
                
                {metaIntegration && (
                  <div className="rounded-md border p-4 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="meta-app-id">Meta App ID</Label>
                      <Input id="meta-app-id" defaultValue="123456789012345" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="meta-app-secret">App Secret</Label>
                      <Input id="meta-app-secret" type="password" defaultValue="••••••••••••••••" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="meta-access-token">Access Token</Label>
                      <Input id="meta-access-token" defaultValue="EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                    </div>
                    <Button size="sm">Verify Connection</Button>
                  </div>
                )}
                
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Google Ads</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect to Google Ads for CTWA tracking
                      </p>
                    </div>
                    <Switch checked={googleIntegration} onCheckedChange={setGoogleIntegration} />
                  </div>
                </div>
                
                {googleIntegration && (
                  <div className="rounded-md border p-4 space-y-4 mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="google-client-id">Client ID</Label>
                      <Input id="google-client-id" defaultValue="" placeholder="Enter Google Ads client ID" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="google-client-secret">Client Secret</Label>
                      <Input id="google-client-secret" type="password" placeholder="Enter client secret" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="google-refresh-token">Refresh Token</Label>
                      <Input id="google-refresh-token" placeholder="Enter refresh token" />
                    </div>
                    <Button size="sm">Connect Google Ads</Button>
                  </div>
                )}
                
                <Button type="button">Save Integration Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tracking" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Tracking</CardTitle>
              <CardDescription>
                Configure how conversions are tracked and reported back to ad platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Conversion Events</h3>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Purchase</h4>
                        <p className="text-sm text-muted-foreground">
                          Track completed purchases
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="grid gap-2 mt-4">
                      <Label htmlFor="purchase-keywords">Trigger Keywords</Label>
                      <Textarea 
                        id="purchase-keywords" 
                        className="min-h-[80px]"
                        defaultValue="purchase, buy, order confirmed, payment received"
                        placeholder="Enter keywords that indicate a purchase event"
                      />
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Lead</h4>
                        <p className="text-sm text-muted-foreground">
                          Track lead generation events
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="grid gap-2 mt-4">
                      <Label htmlFor="lead-keywords">Trigger Keywords</Label>
                      <Textarea 
                        id="lead-keywords" 
                        className="min-h-[80px]"
                        defaultValue="interested, more info, contact me, sign up"
                        placeholder="Enter keywords that indicate a lead event"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Conversions API (CAPI)</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="enable-capi" defaultChecked={true} />
                    <Label htmlFor="enable-capi">Enable Meta Conversions API</Label>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="pixel-id">Pixel ID</Label>
                    <Input id="pixel-id" defaultValue="987654321098765" />
                  </div>
                </div>
                
                <Button type="button">Save Tracking Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure alerts and reports for your CTWA campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="daily-reports" className="flex flex-col space-y-1">
                    <span>Daily Reports</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive daily performance summaries via email
                    </span>
                  </Label>
                  <Switch id="daily-reports" defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="conversion-alerts" className="flex flex-col space-y-1">
                    <span>Conversion Alerts</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Get notified when conversions occur
                    </span>
                  </Label>
                  <Switch id="conversion-alerts" defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="campaign-alerts" className="flex flex-col space-y-1">
                    <span>Campaign Alerts</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Get notified about campaign status changes
                    </span>
                  </Label>
                  <Switch id="campaign-alerts" defaultChecked={true} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notification-email">Notification Email</Label>
                  <Input id="notification-email" type="email" defaultValue="admin@netcore.com" />
                </div>
                
                <Button type="button">Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-reply" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto Reply Settings</CardTitle>
              <CardDescription>
                Configure automatic responses for incoming messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-auto-reply" className="flex flex-col space-y-1">
                    <span>Enable Auto Reply</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically respond to messages based on keywords
                    </span>
                  </Label>
                  <Switch id="enable-auto-reply" defaultChecked={true} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Keyword Configurations</h3>
                  <KeywordConfigManager onConfigUpdate={handleConfigUpdate} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
