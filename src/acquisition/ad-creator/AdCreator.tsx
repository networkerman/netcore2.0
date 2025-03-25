import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdCreative, AdFormat, AdPlatform } from '@/types/ad.types';
import CreativeEditor from './CreativeEditor';
import TargetingEditor from './TargetingEditor';
import BudgetScheduler from './BudgetScheduler';
import PreviewPane from './PreviewPane';

export default function AdCreator() {
  const [activeStep, setActiveStep] = useState<'creative' | 'targeting' | 'budget'>('creative');
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform>('meta');
  const [adFormat, setAdFormat] = useState<AdFormat>('image');
  const [creative, setCreative] = useState<Partial<AdCreative>>({
    title: '',
    description: '',
    format: 'image',
    assets: { primary: '' }
  });

  const handleSaveCreative = (updatedCreative: Partial<AdCreative>) => {
    setCreative({ ...creative, ...updatedCreative });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Ad</h1>
        <div className="space-x-4">
          <Button variant="outline">Save Draft</Button>
          <Button>Publish</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6">
            <Tabs value={activeStep} onValueChange={(v) => setActiveStep(v as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="creative">Creative</TabsTrigger>
                <TabsTrigger value="targeting">Targeting</TabsTrigger>
                <TabsTrigger value="budget">Budget & Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="creative">
                <CreativeEditor
                  platform={selectedPlatform}
                  format={adFormat}
                  creative={creative}
                  onSave={handleSaveCreative}
                  onFormatChange={setAdFormat}
                />
              </TabsContent>

              <TabsContent value="targeting">
                <TargetingEditor
                  platform={selectedPlatform}
                />
              </TabsContent>

              <TabsContent value="budget">
                <BudgetScheduler
                  platform={selectedPlatform}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ad Preview</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                {Object.values(['meta', 'google-ads', 'linkedin', 'twitter']).map((platform) => (
                  <Button
                    key={platform}
                    variant={selectedPlatform === platform ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPlatform(platform as AdPlatform)}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Button>
                ))}
              </div>
              
              <PreviewPane
                platform={selectedPlatform}
                creative={creative}
                format={adFormat}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 