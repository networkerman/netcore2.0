
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PreviewMessage } from "@/components/ui/preview-message";
import { X, Plus, Info } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { KeywordConfig, Language, KeywordResponse, QuickReplyButton, KeywordVariation } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const languages: Language[] = [
  "English",
  "Hindi",
  "Tamil",
  "Mandarin",
  "Thai",
  "Arabic",
  "Spanish",
  "Portuguese",
  "French",
];

interface KeywordFormProps {
  initialConfig?: KeywordConfig;
  onSave: (config: KeywordConfig) => void;
  onCancel: () => void;
}

export const KeywordForm: React.FC<KeywordFormProps> = ({
  initialConfig,
  onSave,
  onCancel,
}) => {
  const [id] = useState(initialConfig?.id || uuidv4());
  const [keyword, setKeyword] = useState(initialConfig?.keyword || "");
  const [variations, setVariations] = useState<KeywordVariation[]>(
    initialConfig?.variations || []
  );
  const [responses, setResponses] = useState<KeywordResponse[]>(
    initialConfig?.responses || [
      {
        id: uuidv4(),
        text: "",
        language: "English",
        quickReplyButtons: [],
      },
    ]
  );
  const [showQuickReply, setShowQuickReply] = useState(
    initialConfig?.responses[0]?.quickReplyButtons?.length ? true : false
  );
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("English");
  const [activeResponseId, setActiveResponseId] = useState<string>(
    responses[0]?.id || ""
  );
  const [isFormValid, setIsFormValid] = useState(false);

  const activeResponse = responses.find((r) => r.id === activeResponseId);

  useEffect(() => {
    // Validate form
    const keywordValid = keyword.trim().length > 0;
    const responseValid = responses.every((r) => r.text.trim().length > 0);
    const quickReplyValid = responses.every(
      (r) =>
        !r.quickReplyButtons ||
        r.quickReplyButtons.every((b) => b.text.trim().length > 0)
    );

    setIsFormValid(keywordValid && responseValid && quickReplyValid);
  }, [keyword, responses]);

  const addVariation = () => {
    if (variations.length >= 5) {
      toast({
        title: "Maximum variations reached",
        description: "You can only add up to 5 variations for a keyword.",
        variant: "destructive",
      });
      return;
    }
    setVariations([...variations, { id: uuidv4(), text: "" }]);
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter((v) => v.id !== id));
  };

  const updateVariation = (id: string, text: string) => {
    setVariations(
      variations.map((v) => (v.id === id ? { ...v, text } : v))
    );
  };

  const switchLanguage = (language: Language) => {
    setSelectedLanguage(language);
    
    // Find if we already have a response for this language
    const existingResponse = responses.find((r) => r.language === language);
    
    if (existingResponse) {
      setActiveResponseId(existingResponse.id);
    } else {
      // Create a new response for this language
      const newResponse: KeywordResponse = {
        id: uuidv4(),
        text: "",
        language,
        quickReplyButtons: showQuickReply ? [{ id: uuidv4(), text: "" }] : [],
      };
      
      setResponses([...responses, newResponse]);
      setActiveResponseId(newResponse.id);
    }
  };

  const updateResponseText = (text: string) => {
    setResponses(
      responses.map((r) =>
        r.id === activeResponseId ? { ...r, text } : r
      )
    );
  };

  const addQuickReplyButton = () => {
    const updatedResponses = responses.map((r) => {
      if (r.id === activeResponseId) {
        const currentButtons = r.quickReplyButtons || [];
        
        if (currentButtons.length >= 3) {
          toast({
            title: "Maximum buttons reached",
            description: "You can only add up to 3 quick reply buttons.",
            variant: "destructive",
          });
          return r;
        }
        
        return {
          ...r,
          quickReplyButtons: [
            ...currentButtons,
            { id: uuidv4(), text: "" },
          ],
        };
      }
      return r;
    });
    
    setResponses(updatedResponses);
  };

  const removeQuickReplyButton = (buttonId: string) => {
    setResponses(
      responses.map((r) => {
        if (r.id === activeResponseId && r.quickReplyButtons) {
          return {
            ...r,
            quickReplyButtons: r.quickReplyButtons.filter(
              (b) => b.id !== buttonId
            ),
          };
        }
        return r;
      })
    );
  };

  const updateQuickReplyButton = (buttonId: string, text: string) => {
    setResponses(
      responses.map((r) => {
        if (r.id === activeResponseId && r.quickReplyButtons) {
          return {
            ...r,
            quickReplyButtons: r.quickReplyButtons.map((b) =>
              b.id === buttonId ? { ...b, text } : b
            ),
          };
        }
        return r;
      })
    );
  };

  const toggleQuickReply = (enabled: boolean) => {
    setShowQuickReply(enabled);
    
    setResponses(
      responses.map((r) => {
        if (enabled && (!r.quickReplyButtons || r.quickReplyButtons.length === 0)) {
          return {
            ...r,
            quickReplyButtons: [{ id: uuidv4(), text: "" }],
          };
        }
        
        if (!enabled) {
          return {
            ...r,
            quickReplyButtons: [],
          };
        }
        
        return r;
      })
    );
  };

  const handleSave = () => {
    if (!isFormValid) return;

    const config: KeywordConfig = {
      id,
      keyword,
      variations,
      responses,
      isDefault: initialConfig?.isDefault,
    };

    onSave(config);
  };

  return (
    <div className="animate-slide-in grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">
      <div className="lg:col-span-3 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Keyword Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="keyword">
                Keyword <span className="text-red-500">*</span>
              </Label>
              <Input
                id="keyword"
                placeholder="Enter keyword (e.g., stop, help)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                maxLength={70}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Max 70 characters. This is the exact keyword that will trigger the response.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>
                  Variations (Optional)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 inline-block ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Add up to 5 variations of the keyword that will trigger the same response.
                          For example: "stop", "unsubscribe", "end"
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariation}
                  disabled={variations.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Variation
                </Button>
              </div>

              {variations.length > 0 ? (
                <div className="space-y-2">
                  {variations.map((variation) => (
                    <div
                      key={variation.id}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        value={variation.text}
                        onChange={(e) =>
                          updateVariation(variation.id, e.target.value)
                        }
                        placeholder="Enter keyword variation"
                        maxLength={70}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariation(variation.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No variations added
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Max 5 variations. Each variation can be up to 70 characters.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={selectedLanguage}
                onValueChange={(value) => switchLanguage(value as Language)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeResponse && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="responseText">
                    Response Text <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="responseText"
                    placeholder="Enter response message"
                    value={activeResponse.text}
                    onChange={(e) => updateResponseText(e.target.value)}
                    className="min-h-[120px]"
                    maxLength={1024}
                  />
                  <p className="text-xs text-muted-foreground">
                    Max 1024 characters. You can use variables like {"{name}"} that will be replaced with user data.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="quick-reply"
                      checked={showQuickReply}
                      onCheckedChange={toggleQuickReply}
                    />
                    <Label htmlFor="quick-reply">Add Quick Reply Buttons</Label>
                  </div>

                  {showQuickReply && (
                    <div className="space-y-3 pl-6">
                      <div className="flex items-center justify-between">
                        <Label>
                          Button Labels <span className="text-red-500">*</span>
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addQuickReplyButton}
                          disabled={
                            !activeResponse.quickReplyButtons ||
                            activeResponse.quickReplyButtons.length >= 3
                          }
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Button
                        </Button>
                      </div>

                      {activeResponse.quickReplyButtons &&
                        activeResponse.quickReplyButtons.length > 0 && (
                          <div className="space-y-2">
                            {activeResponse.quickReplyButtons.map((button) => (
                              <div
                                key={button.id}
                                className="flex items-center space-x-2"
                              >
                                <Input
                                  value={button.text}
                                  onChange={(e) =>
                                    updateQuickReplyButton(
                                      button.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Button text (e.g., Yes, No)"
                                  maxLength={20}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeQuickReplyButton(button.id)}
                                  disabled={
                                    activeResponse.quickReplyButtons?.length === 1
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      <p className="text-xs text-muted-foreground">
                        Max 3 buttons. Each button text can be up to 20 characters.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-50 rounded-md p-4">
            {activeResponse && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-2">User message:</p>
                  <PreviewMessage
                    type="received"
                    message={{ id: "preview", text: keyword || "Keyword", language: "English" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Bot response:</p>
                  <PreviewMessage
                    type="sent"
                    message={activeResponse}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid}>
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

