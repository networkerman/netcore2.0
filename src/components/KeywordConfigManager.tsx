import React, { useState, useEffect } from 'react';
import { KeywordConfig, Language, KeywordResponse, KeywordVariation, QuickReplyButton, AutoReplySettings } from '../lib/types';
import { AutoReplyService } from '../lib/services/auto-reply.service';
import { AIService } from '../lib/services/ai-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, Edit, Save, X, Wand2, MessageSquare, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define available languages as a constant array
const AVAILABLE_LANGUAGES: Language[] = [
  "English",
  "Hindi",
  "Tamil",
  "Mandarin",
  "Thai",
  "Arabic",
  "Spanish",
  "Portuguese",
  "French"
];

interface KeywordConfigManagerProps {
  onConfigUpdate?: (configs: KeywordConfig[]) => void;
}

export const KeywordConfigManager: React.FC<KeywordConfigManagerProps> = ({ onConfigUpdate }) => {
  const [configs, setConfigs] = useState<KeywordConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<KeywordConfig | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [newVariation, setNewVariation] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const [isEditing, setIsEditing] = useState(false);
  const [editingResponse, setEditingResponse] = useState<KeywordResponse | null>(null);
  const [newButton, setNewButton] = useState<Partial<QuickReplyButton>>({});
  const [settings, setSettings] = useState<AutoReplySettings>({
    isEnabled: true,
    defaultLanguage: 'English',
    caseSensitive: false,
    maxVariations: 5,
    maxButtons: 3,
    maxResponseLength: 1024
  });
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [previewResponse, setPreviewResponse] = useState<KeywordResponse | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiService] = useState(() => new AIService());

  useEffect(() => {
    const initializeService = async () => {
      try {
        const service = AutoReplyService.getInstance();
        await service.initialize();
        setConfigs(service.getKeywordConfigs());
        setSettings(service.getSettings());
        setIsInitialized(true);
      } catch (error) {
        toast({
          title: "Error initializing auto reply",
          description: error instanceof Error ? error.message : "Failed to initialize auto reply service.",
          variant: "destructive",
        });
      }
    };

    initializeService();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auto reply settings...</p>
        </div>
      </div>
    );
  }

  const handleAddConfig = async () => {
    if (!newKeyword.trim()) {
      toast({
        title: "Invalid keyword",
        description: "Please enter a keyword.",
        variant: "destructive",
      });
      return;
    }

    try {
      const service = AutoReplyService.getInstance();
      const newConfig: KeywordConfig = {
        id: Date.now().toString(),
        keyword: newKeyword.trim(),
        variations: [],
        responses: [],
        isEnabled: true
      };

      await service.addKeywordConfig(newConfig);
      setConfigs(service.getKeywordConfigs());
      setNewKeyword('');
      toast({
        title: "Keyword added",
        description: "New keyword configuration has been added.",
      });
    } catch (error) {
      toast({
        title: "Error adding keyword",
        description: error instanceof Error ? error.message : "Failed to add keyword configuration.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateConfig = async (config: KeywordConfig) => {
    try {
      const service = AutoReplyService.getInstance();
      await service.updateKeywordConfig(config);
      setConfigs(service.getKeywordConfigs());
      toast({
        title: "Configuration updated",
        description: "Keyword configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating configuration",
        description: error instanceof Error ? error.message : "Failed to update configuration.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfig = async (configId: string) => {
    try {
      const service = AutoReplyService.getInstance();
      await service.deleteKeywordConfig(configId);
      setConfigs(service.getKeywordConfigs());
      toast({
        title: "Configuration deleted",
        description: "Keyword configuration has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleting configuration",
        description: error instanceof Error ? error.message : "Failed to delete configuration.",
        variant: "destructive",
      });
    }
  };

  const handleAddVariation = async () => {
    if (!selectedConfig || !newVariation.trim()) return;

    try {
      const updatedConfig = {
        ...selectedConfig,
        variations: [
          ...selectedConfig.variations,
          { id: Date.now().toString(), text: newVariation.trim() }
        ]
      };

      await handleUpdateConfig(updatedConfig);
      setNewVariation('');
    } catch (error) {
      toast({
        title: "Error adding variation",
        description: error instanceof Error ? error.message : "Failed to add variation.",
        variant: "destructive",
      });
    }
  };

  const handleAddResponse = async () => {
    if (!selectedConfig || !newResponse.trim()) return;

    try {
      const updatedConfig = {
        ...selectedConfig,
        responses: [
          ...selectedConfig.responses,
          {
            id: Date.now().toString(),
            text: newResponse.trim(),
            language: selectedLanguage,
            buttons: []
          }
        ]
      };

      await handleUpdateConfig(updatedConfig);
      setNewResponse('');
    } catch (error) {
      toast({
        title: "Error adding response",
        description: error instanceof Error ? error.message : "Failed to add response.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<AutoReplySettings>) => {
    try {
      const service = AutoReplyService.getInstance();
      const updatedSettings = { ...settings, ...newSettings };
      await service.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      toast({
        title: "Settings updated",
        description: "Auto reply settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating settings",
        description: error instanceof Error ? error.message : "Failed to update settings.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateVariations = async () => {
    if (!selectedConfig) {
      toast({
        title: "No keyword selected",
        description: "Please select a keyword to generate variations.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingVariations(true);
    try {
      const variations = await aiService.generateVariations(selectedConfig.keyword, selectedLanguage);
      const updatedConfig = {
        ...selectedConfig,
        variations: [
          ...selectedConfig.variations,
          ...variations.map(text => ({ id: Date.now().toString() + Math.random(), text }))
        ]
      };

      await handleUpdateConfig(updatedConfig);
      toast({
        title: "Variations generated",
        description: "AI-generated variations have been added to the keyword.",
      });
    } catch (error) {
      toast({
        title: "Error generating variations",
        description: error instanceof Error ? error.message : "Failed to generate variations.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const handlePreviewResponse = async (response: KeywordResponse) => {
    try {
      const context = `Keyword: ${selectedConfig?.keyword}\nLanguage: ${response.language}`;
      const preview = await aiService.generateResponse(response.text, context, response.language);
      setPreviewResponse({ ...response, text: preview });
    } catch (error) {
      console.error('Error previewing response:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Auto Reply Configuration</h2>
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Auto Reply Settings</DialogTitle>
              <DialogDescription>
                Configure general settings for the auto reply system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Enable Auto Reply</Label>
                <Switch
                  id="enabled"
                  checked={settings.isEnabled}
                  onCheckedChange={(checked) => handleUpdateSettings({ isEnabled: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select
                  value={settings.defaultLanguage}
                  onValueChange={(value) => handleUpdateSettings({ defaultLanguage: value as Language })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="caseSensitive">Case Sensitive</Label>
                <Switch
                  id="caseSensitive"
                  checked={settings.caseSensitive}
                  onCheckedChange={(checked) => handleUpdateSettings({ caseSensitive: checked })}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Keyword</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Enter keyword..."
              />
            </div>
            <Button onClick={handleAddConfig}>
              <Plus className="h-4 w-4 mr-2" />
              Add Keyword
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keyword Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Variations</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>{config.keyword}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {config.variations.map((variation) => (
                        <div key={variation.id} className="text-sm">
                          {variation.text}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newVariation}
                          onChange={(e) => setNewVariation(e.target.value)}
                          placeholder="Add variation..."
                          className="h-8"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedConfig(config);
                            handleAddVariation();
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {config.responses.map((response) => (
                        <div key={response.id} className="text-sm">
                          <div className="font-medium">{response.language}</div>
                          <div>{response.text}</div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Textarea
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          placeholder="Add response..."
                          className="h-20"
                        />
                        <Select
                          value={selectedLanguage}
                          onValueChange={(value) => setSelectedLanguage(value as Language)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_LANGUAGES.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedConfig(config);
                            handleAddResponse();
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={config.isEnabled}
                      onCheckedChange={(checked) => {
                        handleUpdateConfig({ ...config, isEnabled: checked });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedConfig(config);
                          handleGenerateVariations();
                        }}
                        disabled={isGeneratingVariations}
                      >
                        <Wand2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteConfig(config.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 