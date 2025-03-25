import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AdCreative, AdFormat, AdPlatform, WhatsAppAdConfig } from '@/types/ad.types';
import { Card } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import WhatsAppTemplateSelector from './WhatsAppTemplateSelector';

interface CreativeEditorProps {
  platform: AdPlatform;
  format: AdFormat;
  creative: Partial<AdCreative>;
  onSave: (creative: Partial<AdCreative>) => void;
  onFormatChange: (format: AdFormat) => void;
}

export default function CreativeEditor({
  platform,
  format,
  creative,
  onSave,
  onFormatChange,
}: CreativeEditorProps) {
  const [localCreative, setLocalCreative] = useState<Partial<AdCreative>>(creative);
  const [isWhatsAppAd, setIsWhatsAppAd] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real implementation, you would upload these files to your storage
    const file = acceptedFiles[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLocalCreative(prev => ({
        ...prev,
        assets: { ...prev.assets, primary: objectUrl }
      }));
      handleSave({
        ...localCreative,
        assets: { ...localCreative.assets, primary: objectUrl }
      });
    }
  }, [localCreative]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': format === 'image' ? [] : undefined,
      'video/*': format === 'video' ? [] : undefined,
    },
    maxFiles: 1
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalCreative(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (updatedCreative: Partial<AdCreative>) => {
    onSave(updatedCreative);
  };

  const handleBlur = () => {
    handleSave(localCreative);
  };

  const handleWhatsAppConfigChange = (config: WhatsAppAdConfig) => {
    setLocalCreative(prev => ({
      ...prev,
      whatsappConfig: config
    }));
    handleSave({
      ...localCreative,
      whatsappConfig: config
    });
  };

  return (
    <div className="space-y-6">
      {platform === 'meta' && (
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isWhatsAppAd}
              onCheckedChange={setIsWhatsAppAd}
              id="whatsapp-mode"
            />
            <Label htmlFor="whatsapp-mode">Create Click-to-WhatsApp Ad</Label>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        {(['image', 'video', 'carousel', 'text'] as AdFormat[]).map((f) => (
          <Button
            key={f}
            variant={format === f ? "default" : "outline"}
            onClick={() => onFormatChange(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Ad Title</Label>
          <Input
            id="title"
            name="title"
            value={localCreative.title || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your ad title"
            maxLength={platform === 'meta' ? 40 : 90}
          />
          <p className="text-sm text-gray-500 mt-1">
            {localCreative.title?.length || 0}/{platform === 'meta' ? 40 : 90} characters
          </p>
        </div>

        <div>
          <Label htmlFor="description">Ad Description</Label>
          <Textarea
            id="description"
            name="description"
            value={localCreative.description || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your ad description"
            maxLength={platform === 'meta' ? 125 : 180}
          />
          <p className="text-sm text-gray-500 mt-1">
            {localCreative.description?.length || 0}/{platform === 'meta' ? 125 : 180} characters
          </p>
        </div>

        {format !== 'text' && (
          <Card
            {...getRootProps()}
            className={`p-6 border-2 border-dashed ${
              isDragActive ? 'border-primary' : 'border-gray-300'
            } cursor-pointer hover:border-primary transition-colors`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? `Drop your ${format} here`
                  : `Drag and drop your ${format} here, or click to select`}
              </p>
              {localCreative.assets?.primary && (
                <div className="mt-4">
                  {format === 'image' ? (
                    <img
                      src={localCreative.assets.primary}
                      alt="Ad preview"
                      className="max-h-48 mx-auto"
                    />
                  ) : format === 'video' ? (
                    <video
                      src={localCreative.assets.primary}
                      controls
                      className="max-h-48 mx-auto"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </Card>
        )}

        {isWhatsAppAd && platform === 'meta' && (
          <WhatsAppTemplateSelector onConfigChange={handleWhatsAppConfigChange} />
        )}
      </div>
    </div>
  );
} 