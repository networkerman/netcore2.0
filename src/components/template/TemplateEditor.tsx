import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Template, TemplateSection, Variable, VariableType, CarouselItem } from "@/types/whatsapp-template";
import { 
  createVariable, 
  TEMPLATE_SECTION_LIMITS, 
  countCharacters, 
  isOverCharacterLimit 
} from "@/utils/template-utils";
import { 
  Bold, 
  Italic, 
  Smile, 
  Variable as VariableIcon,
  Save,
  Send,
  Image,
  Video,
  FileText,
  ShoppingCart,
  Globe,
  Plus,
  Trash
} from "lucide-react";
import WhatsAppPreview from "./WhatsAppPreview";
import VariableMenu from "./VariableMenu";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TemplateEditorProps {
  template: Template;
  onSave: (template: Template, isDraft: boolean) => void;
}

const RECOMMENDATION_ALGORITHMS = [
  { value: 'best_selling', label: 'Best Selling Products' },
  { value: 'recently_viewed', label: 'Recently Viewed' },
  { value: 'recommended_for_you', label: 'Recommended For You' },
  { value: 'top_sellers', label: 'Top Sellers' },
  { value: 'new_arrivals', label: 'New Arrivals' },
  { value: 'trending', label: 'Trending Products' },
  { value: 'frequently_bought_together', label: 'Frequently Bought Together' },
  { value: 'similar_products', label: 'Similar Products' }
];

export default function TemplateEditor({ template, onSave }: TemplateEditorProps) {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(template);
  const [activeSection, setActiveSection] = useState<'header' | 'body' | 'footer'>('body');
  const [showVariableMenu, setShowVariableMenu] = useState(false);
  const [variableMenuPosition, setVariableMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedVariableType, setSelectedVariableType] = useState<VariableType>('user_attribute');
  const [activeTab, setActiveTab] = useState('content');
  const [sampleData, setSampleData] = useState({
    brandName: 'Sunshine Glow',
    productName: 'Summer Silk Dress',
    productPrice: '$129.99',
    discountCode: 'SUMMER20'
  });
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleSectionChange = (content: string) => {
    setCurrentTemplate(prev => {
      const newTemplate = { ...prev };
      const sectionIndex = newTemplate.sections.findIndex(s => s.type === activeSection);
      
      if (sectionIndex !== -1) {
        newTemplate.sections[sectionIndex] = {
          ...newTemplate.sections[sectionIndex],
          content
        };
      }
      
      return newTemplate;
    });
  };

  const handleAddVariable = (variableName: string, type: VariableType) => {
    // Only add if we have a textarea to insert into
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);
    
    // Create the variable placeholder
    const variablePlaceholder = `{{${variableName}}}`;
    
    // Insert at cursor position
    const newText = textBefore + variablePlaceholder + textAfter;
    
    // Update the section
    handleSectionChange(newText);
    
    // Add the variable to the section's variables array if it's not already there
    setCurrentTemplate(prev => {
      const sectionIndex = prev.sections.findIndex(s => s.type === activeSection);
      
      if (sectionIndex === -1) return prev;
      
      const sectionVariables = [...prev.sections[sectionIndex].variables];
      if (!sectionVariables.some(v => v.name === variableName)) {
        sectionVariables.push(createVariable(variableName, type));
      }
      
      const newSections = [...prev.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        variables: sectionVariables
      };
      
      return {
        ...prev,
        sections: newSections
      };
    });
    
    // Hide the variable menu
    setShowVariableMenu(false);
    
    // Focus back on textarea and set cursor after the inserted variable
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = cursorPos + variablePlaceholder.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleOpenVariableMenu = () => {
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const textareaRect = textarea.getBoundingClientRect();
    
    setVariableMenuPosition({ 
      x: textareaRect.x + textareaRect.width / 2,
      y: textareaRect.y
    });
    
    setShowVariableMenu(true);
  };

  const handleSaveDraft = () => {
    onSave(currentTemplate, true);
    toast({
      title: "Template saved as draft",
      description: "Your template has been saved. You can continue editing it later.",
    });
  };

  const handleSendForApproval = () => {
    // Validate the template first
    const emptySection = currentTemplate.sections.find(section => 
      section.content.trim() === '' && section.type === 'body'
    );
    
    if (emptySection) {
      toast({
        title: "Validation Error",
        description: "Body section cannot be empty when submitting for approval.",
        variant: "destructive"
      });
      return;
    }
    
    const overLimitSection = currentTemplate.sections.find(section => 
      isOverCharacterLimit(section)
    );
    
    if (overLimitSection) {
      toast({
        title: "Validation Error",
        description: `${overLimitSection.type.charAt(0).toUpperCase() + overLimitSection.type.slice(1)} exceeds character limit.`,
        variant: "destructive"
      });
      return;
    }
    
    onSave({
      ...currentTemplate,
      status: 'pending'
    }, false);
    
    toast({
      title: "Template submitted for approval",
      description: "Your template has been submitted and is pending approval.",
    });
  };

  const handleAddButton = () => {
    if (!currentTemplate.buttons) {
      setCurrentTemplate({
        ...currentTemplate,
        buttons: [{ type: 'quick_reply', text: 'Reply' }]
      });
    } else if (currentTemplate.buttons.length < 3) { // WhatsApp allows max 3 buttons
      setCurrentTemplate({
        ...currentTemplate,
        buttons: [...currentTemplate.buttons, { type: 'quick_reply', text: 'Reply' }]
      });
    } else {
      toast({
        title: "Button limit reached",
        description: "WhatsApp templates can have a maximum of 3 buttons.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateButton = (index: number, field: 'type' | 'text' | 'value', value: string) => {
    if (!currentTemplate.buttons) return;
    
    const updatedButtons = [...currentTemplate.buttons];
    updatedButtons[index] = {
      ...updatedButtons[index],
      [field]: value
    };
    
    setCurrentTemplate({
      ...currentTemplate,
      buttons: updatedButtons
    });
  };

  const handleRemoveButton = (index: number) => {
    if (!currentTemplate.buttons) return;
    
    setCurrentTemplate({
      ...currentTemplate,
      buttons: currentTemplate.buttons.filter((_, i) => i !== index)
    });
  };

  const handleEnableProductRecommendation = (enabled: boolean) => {
    if (enabled) {
      setCurrentTemplate({
        ...currentTemplate,
        productRecommendation: {
          enabled: true,
          source: 'default',
          algorithm: 'best_selling',
          count: 4
        }
      });
    } else {
      const { productRecommendation, ...rest } = currentTemplate;
      setCurrentTemplate(rest as Template);
    }
  };
  
  const handleUpdateProductRecommendation = (field: string, value: any) => {
    if (!currentTemplate.productRecommendation) return;
    
    setCurrentTemplate({
      ...currentTemplate,
      productRecommendation: {
        ...currentTemplate.productRecommendation,
        [field]: value
      }
    });
  };

  const handleAddCarouselItem = () => {
    if (!currentTemplate.carouselItems) {
      setCurrentTemplate({
        ...currentTemplate,
        carouselItems: [{
          title: 'Product Title',
          description: 'Product Description',
          imageUrl: 'https://placehold.co/600x400/png?text=Product'
        }]
      });
    } else if (currentTemplate.carouselItems.length < 10) { // WhatsApp allows max 10 carousel items
      setCurrentTemplate({
        ...currentTemplate,
        carouselItems: [
          ...currentTemplate.carouselItems,
          {
            title: 'Product Title',
            description: 'Product Description',
            imageUrl: 'https://placehold.co/600x400/png?text=Product'
          }
        ]
      });
    }
  };

  const handleUpdateCarouselItem = (index: number, field: keyof CarouselItem, value: any) => {
    if (!currentTemplate.carouselItems) return;
    
    const updatedItems = [...currentTemplate.carouselItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    } as CarouselItem;
    
    setCurrentTemplate({
      ...currentTemplate,
      carouselItems: updatedItems
    });
  };

  const handleRemoveCarouselItem = (index: number) => {
    if (!currentTemplate.carouselItems) return;
    
    setCurrentTemplate({
      ...currentTemplate,
      carouselItems: currentTemplate.carouselItems.filter((_, i) => i !== index)
    });
  };

  const handleAddCarouselItemButton = (carouselIndex: number) => {
    if (!currentTemplate.carouselItems) return;
    
    const item = currentTemplate.carouselItems[carouselIndex];
    if (!item.buttons) {
      const updatedItems = [...currentTemplate.carouselItems];
      updatedItems[carouselIndex] = {
        ...item,
        buttons: [{ type: 'url', text: 'View Details' }]
      };
      
      setCurrentTemplate({
        ...currentTemplate,
        carouselItems: updatedItems
      });
    }
  };

  // Get the current section for display
  const activeTemplateSection = currentTemplate.sections.find(
    section => section.type === activeSection
  );

  const getCharacterCount = (section?: TemplateSection) => {
    if (!section) return 0;
    return countCharacters(section.content);
  };

  const isOverLimit = (section?: TemplateSection) => {
    if (!section) return false;
    return isOverCharacterLimit(section);
  };

  return (
    <div className="h-full flex">
      <div className="flex-1">
        <Card className="h-full">
          <WhatsAppPreview 
            template={currentTemplate} 
            sampleData={sampleData}
          />
        </Card>
      </div>

      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Edit Template</h2>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="variables">Variables</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="content">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        value={currentTemplate.name}
                        onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Template Type</Label>
                      <div className="flex">
                        <Button
                          variant={currentTemplate.isStatic ? "default" : "outline"}
                          className="rounded-l-md rounded-r-none flex-1"
                          onClick={() => setCurrentTemplate({...currentTemplate, isStatic: true})}
                        >
                          Static
                        </Button>
                        <Button
                          variant={!currentTemplate.isStatic ? "default" : "outline"}
                          className="rounded-r-md rounded-l-none flex-1"
                          onClick={() => setCurrentTemplate({...currentTemplate, isStatic: false})}
                        >
                          Dynamic
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {['header', 'body', 'footer'].map((sectionType) => (
                        <div key={sectionType}>
                          <Label className="capitalize">{sectionType}</Label>
                          <Textarea
                            value={currentTemplate.sections.find(s => s.type === sectionType)?.content || ''}
                            onChange={(e) => {
                              const updatedSections = currentTemplate.sections.map(section => 
                                section.type === sectionType 
                                  ? {...section, content: e.target.value}
                                  : section
                              );
                              setCurrentTemplate({...currentTemplate, sections: updatedSections});
                            }}
                            className="mt-1"
                            rows={4}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variables">
                  <div className="space-y-4">
                    {/* Variables content */}
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="space-y-4">
                    {/* Preview content */}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={handleSendForApproval}>
                <Send className="h-4 w-4 mr-2" />
                Send for Approval
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showVariableMenu && (
        <VariableMenu 
          position={variableMenuPosition}
          onSelectVariable={handleAddVariable}
          onClose={() => setShowVariableMenu(false)}
          selectedType={selectedVariableType}
          onChangeType={setSelectedVariableType}
        />
      )}
    </div>
  );
}
