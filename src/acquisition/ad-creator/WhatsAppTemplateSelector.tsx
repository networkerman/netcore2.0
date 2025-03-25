import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { WhatsAppTemplate, WhatsAppAdConfig } from '@/types/ad.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WhatsAppTemplateSelectorProps {
  onConfigChange: (config: WhatsAppAdConfig) => void;
}

export default function WhatsAppTemplateSelector({ onConfigChange }: WhatsAppTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [headerVars, setHeaderVars] = useState<string[]>([]);
  const [bodyVars, setBodyVars] = useState<string[][]>([[]]);
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [cta, setCta] = useState({ text: 'Send Message', phoneNumber: '' });

  // Mock data - In real implementation, fetch from your WhatsApp Business API
  const mockTemplates: WhatsAppTemplate[] = [
    {
      id: "1",
      name: "welcome_message",
      language: "en",
      status: "APPROVED",
      category: "MARKETING",
      components: [
        {
          type: "HEADER",
          format: "TEXT",
          text: "Welcome {{1}}!",
          example: {
            header_text: ["[customer name]"]
          }
        },
        {
          type: "BODY",
          text: "Thank you for your interest in {{1}}. Our team will assist you with {{2}}.",
          example: {
            body_text: [["our products", "your inquiry"]]
          }
        }
      ]
    }
  ];

  const handleTemplateChange = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      
      // Reset variables based on template structure
      const headerComponent = template.components.find(c => c.type === 'HEADER');
      const bodyComponent = template.components.find(c => c.type === 'BODY');
      
      setHeaderVars(headerComponent?.example?.header_text || []);
      setBodyVars(bodyComponent?.example?.body_text || [[]]);

      updateConfig(template.id);
    }
  };

  const updateConfig = (templateId: string) => {
    const config: WhatsAppAdConfig = {
      templateId,
      phoneNumberId,
      headerVariables: headerVars,
      bodyVariables: bodyVars,
      callToAction: cta
    };
    onConfigChange(config);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">WhatsApp Template Configuration</h3>
      <div className="space-y-4">
        <div>
          <Label>Select Template</Label>
          <Select onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent>
              {mockTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} ({template.language})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>WhatsApp Business Phone Number ID</Label>
          <Input
            value={phoneNumberId}
            onChange={(e) => {
              setPhoneNumberId(e.target.value);
              updateConfig(selectedTemplate?.id || '');
            }}
            placeholder="Enter your WhatsApp Business Phone Number ID"
          />
        </div>

        {selectedTemplate && (
          <>
            {headerVars.length > 0 && (
              <div>
                <Label>Header Variables</Label>
                {headerVars.map((_, index) => (
                  <Input
                    key={`header-${index}`}
                    className="mt-2"
                    placeholder={`Header variable ${index + 1}`}
                    onChange={(e) => {
                      const newVars = [...headerVars];
                      newVars[index] = e.target.value;
                      setHeaderVars(newVars);
                      updateConfig(selectedTemplate.id);
                    }}
                  />
                ))}
              </div>
            )}

            {bodyVars[0].length > 0 && (
              <div>
                <Label>Body Variables</Label>
                {bodyVars[0].map((_, index) => (
                  <Input
                    key={`body-${index}`}
                    className="mt-2"
                    placeholder={`Body variable ${index + 1}`}
                    onChange={(e) => {
                      const newVars = [...bodyVars];
                      newVars[0][index] = e.target.value;
                      setBodyVars(newVars);
                      updateConfig(selectedTemplate.id);
                    }}
                  />
                ))}
              </div>
            )}

            <div>
              <Label>Call to Action</Label>
              <Input
                className="mt-2"
                value={cta.text}
                onChange={(e) => {
                  setCta({ ...cta, text: e.target.value });
                  updateConfig(selectedTemplate.id);
                }}
                placeholder="CTA Button Text"
              />
            </div>
          </>
        )}

        {selectedTemplate && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Preview</h4>
            <div className="space-y-2">
              {selectedTemplate.components.map((component, index) => (
                <div key={index} className="text-sm">
                  <strong>{component.type}:</strong>
                  <p>{component.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 