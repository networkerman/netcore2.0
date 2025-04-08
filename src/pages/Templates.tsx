import TemplateList from "@/components/template/TemplateList";
import TemplateEditor from "@/components/template/TemplateEditor";
import { useState } from "react";
import type { Template } from "@/types/whatsapp-template";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const { toast } = useToast();

  const handleCreateNew = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: "New Template",
      type: "text",
      category: "marketing",
      status: "draft",
      isStatic: false,
      sections: [
        {
          type: "header",
          content: "",
          variables: [],
          characterLimit: 60
        },
        {
          type: "body",
          content: "",
          variables: [],
          characterLimit: 1024
        },
        {
          type: "footer",
          content: "",
          variables: [],
          characterLimit: 60
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: "en"
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
  };

  const handleSaveTemplate = (template: Template, isDraft: boolean) => {
    const updatedTemplates = templates.map(t => 
      t.id === template.id ? template : t
    );
    setTemplates(updatedTemplates);
    setSelectedTemplate(template);
  };

  return (
    <div className="h-screen flex">
      <div className="w-80 border-r p-4">
        <TemplateList 
          templates={templates}
          onSelectTemplate={setSelectedTemplate}
          onCreateNew={handleCreateNew}
        />
      </div>
      
      <div className="flex-1">
        {selectedTemplate ? (
          <div className="h-full">
            <TemplateEditor 
              template={selectedTemplate}
              onSave={handleSaveTemplate}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              Select a template or create a new one to start editing
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 