import React, { useState, useEffect, Suspense } from 'react';
import { TemplateManagementService } from '@/lib/services/template-management';
import { Template, Variable, TemplateLayout, Language } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, FileText, ShoppingCart, Image, Mail, Phone } from 'lucide-react';

// Dynamic import for ChatPreview
const ChatPreview = React.lazy(() => import('@/components/chat/ChatPreview'));

const availableLanguages: Language[] = ['English', 'Hindi', 'Spanish', 'French', 'German'];
const availableLayouts: TemplateLayout[] = [
  'text',
  'single-product',
  'multi-product',
  'catalog',
  'order-details',
  'order-status',
  'rich-media',
  'quick-reply',
  'carousel',
  'authentication'
];

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

export const TemplateManagement: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    content: '',
    type: 'text',
    layout: 'text',
    language: 'English',
    variables: []
  });
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
      toast.error('Failed to load templates');
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const templateService = TemplateManagementService.getInstance();
      const template = await templateService.createTemplate({
        ...newTemplate,
        variables: newTemplate.variables || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Omit<Template, 'id'>);
      setTemplates([...templates, template]);
      setNewTemplate({
        name: '',
        content: '',
        type: 'text',
        layout: 'text',
        language: 'English',
        variables: []
      });
      setIsCreating(false);
      toast.success('Template created successfully');
    } catch (error) {
      console.error('Failed to create template:', error);
      toast.error('Failed to create template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTest = async (templateId: string, data: Record<string, string>) => {
    try {
      const templateService = TemplateManagementService.getInstance();
      const message = await templateService.sendMessage({
        templateId,
        data
      });
      toast.success('Test message sent successfully');
      console.log('Test message:', message);
    } catch (error) {
      console.error('Failed to send test message:', error);
      toast.error('Failed to send test message');
    }
  };

  if (isCreating) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create New Template</h1>
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            Back to Templates
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Name</label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="Enter template name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Input
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                placeholder="Enter template content (use {{variable_name}} for variables)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Layout</label>
              <Select
                value={newTemplate.layout}
                onValueChange={(value) => setNewTemplate({ ...newTemplate, layout: value as TemplateLayout })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  {availableLayouts.map(layout => (
                    <SelectItem key={layout} value={layout}>
                      {layout}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={newTemplate.language}
                onValueChange={(value) => setNewTemplate({ ...newTemplate, language: value as Language })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map(language => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreateTemplate}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Template'}
            </Button>
          </Card>

          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading preview...</div>}>
            <ChatPreview onSendTest={handleSendTest} />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">WhatsApp Templates</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id} className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              {renderLayoutIcon(template.layout)}
              <h3 className="font-semibold">{template.name}</h3>
            </div>
            <p className="text-sm text-gray-500">{template.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{template.language}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedTemplate(template)}
              >
                Preview
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Template Preview</h2>
                <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                  Close
                </Button>
              </div>
              <Suspense fallback={<div className="flex items-center justify-center h-full">Loading preview...</div>}>
                <ChatPreview onSendTest={handleSendTest} />
              </Suspense>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}; 