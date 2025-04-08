import React, { useState, useEffect } from 'react';
import { TemplateManagementService } from '@/lib/services/template-management';
import { Template, Variable, TemplateLayout } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Bot, Image, ShoppingCart, FileText, Mail, Phone } from 'lucide-react';

interface ChatPreviewProps {
  onSendTest?: (templateId: string, data: Record<string, string>) => Promise<void>;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({ onSendTest }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [previewMessage, setPreviewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templateService = TemplateManagementService.getInstance();
      const loadedTemplates = await templateService.getTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      const initialValues: Record<string, string> = {};
      template.variables.forEach(variable => {
        initialValues[variable.name] = variable.defaultValue || '';
      });
      setVariableValues(initialValues);
      updatePreview(template, initialValues);
    }
  };

  const handleVariableChange = (name: string, value: string) => {
    const newValues = { ...variableValues, [name]: value };
    setVariableValues(newValues);
    if (selectedTemplate) {
      updatePreview(selectedTemplate, newValues);
    }
  };

  const updatePreview = async (template: Template, values: Record<string, string>) => {
    try {
      const templateService = TemplateManagementService.getInstance();
      const renderedMessage = await templateService.renderTemplate(template, values);
      setPreviewMessage(renderedMessage);
    } catch (error) {
      console.error('Failed to render template:', error);
    }
  };

  const handleSendTest = async () => {
    if (!selectedTemplate || !onSendTest) return;
    setIsLoading(true);
    try {
      await onSendTest(selectedTemplate.id, variableValues);
    } catch (error) {
      console.error('Failed to send test message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLayoutIcon = (layout: TemplateLayout) => {
    switch (layout) {
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'single-product':
      case 'multi-product':
        return <ShoppingCart className="h-4 w-4" />;
      case 'rich-media':
        return <Image className="h-4 w-4" />;
      case 'quick-reply':
        return <Mail className="h-4 w-4" />;
      case 'authentication':
        return <Phone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Template</label>
        <Select onValueChange={handleTemplateSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center space-x-2">
                  {renderLayoutIcon(template.layout)}
                  <span>{template.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTemplate && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Variables</label>
            {selectedTemplate.variables.map(variable => (
              <div key={variable.name} className="space-y-1">
                <label className="text-sm">{variable.name}</label>
                <Input
                  value={variableValues[variable.name] || ''}
                  onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                  placeholder={`Enter ${variable.name}`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preview</label>
            <div className="border rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Bot className="h-6 w-6 text-blue-500" />
                <div className="bg-blue-100 rounded-lg p-3">
                  <p className="text-sm">{previewMessage}</p>
                  {selectedTemplate.layout === 'rich-media' && selectedTemplate.mediaUrl && (
                    <img 
                      src={selectedTemplate.mediaUrl} 
                      alt="Media preview" 
                      className="mt-2 rounded-lg max-w-full"
                    />
                  )}
                  {selectedTemplate.layout === 'quick-reply' && selectedTemplate.buttons && (
                    <div className="mt-2 space-y-2">
                      {selectedTemplate.buttons.map(button => (
                        <Button
                          key={button.id}
                          variant="outline"
                          className="w-full"
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {onSendTest && (
            <Button
              onClick={handleSendTest}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Test Message'}
            </Button>
          )}
        </>
      )}
    </Card>
  );
};

export default ChatPreview; 