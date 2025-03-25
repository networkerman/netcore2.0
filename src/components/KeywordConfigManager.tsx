import React, { useState, useEffect } from 'react';
import { KeywordConfig, Language, KeywordResponse, KeywordVariation, QuickReplyButton, AutoReplySettings } from '../lib/types';
import { AutoReplyService } from '../lib/services/auto-reply.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, Edit, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

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

  const autoReplyService = new AutoReplyService();

  useEffect(() => {
    // Load initial configurations and settings
    const initialConfigs = autoReplyService.getKeywordConfigs();
    const initialSettings = autoReplyService.getSettings();
    setConfigs(initialConfigs);
    setSettings(initialSettings);
  }, []);

  const handleAddConfig = () => {
    if (!newKeyword.trim()) {
      toast({
        title: "Invalid keyword",
        description: "Please enter a keyword before adding.",
        variant: "destructive",
      });
      return;
    }

    const newConfig: KeywordConfig = {
      id: Date.now().toString(),
      keyword: newKeyword.trim(),
      variations: [],
      responses: [{
        id: Date.now().toString(),
        text: '',
        language: selectedLanguage,
        buttons: []
      }],
      isDefault: false,
      isEnabled: true
    };

    setConfigs([...configs, newConfig]);
    setNewKeyword('');
    onConfigUpdate?.([...configs, newConfig]);
  };

  const handleAddVariation = () => {
    if (!selectedConfig || !newVariation.trim()) {
      toast({
        title: "Invalid variation",
        description: "Please select a keyword and enter a variation.",
        variant: "destructive",
      });
      return;
    }

    if (selectedConfig.variations.length >= settings.maxVariations) {
      toast({
        title: "Maximum variations reached",
        description: `Maximum ${settings.maxVariations} variations allowed per keyword.`,
        variant: "destructive",
      });
      return;
    }

    const variation: KeywordVariation = {
      id: Date.now().toString(),
      text: newVariation.trim()
    };

    const updatedConfig = {
      ...selectedConfig,
      variations: [...selectedConfig.variations, variation]
    };

    setConfigs(configs.map(c => c.id === selectedConfig.id ? updatedConfig : c));
    setSelectedConfig(updatedConfig);
    setNewVariation('');
    onConfigUpdate?.(configs);
  };

  const handleAddButton = () => {
    if (!selectedConfig || !editingResponse || !newButton.label?.trim()) {
      toast({
        title: "Invalid button",
        description: "Please select a response and enter a button label.",
        variant: "destructive",
      });
      return;
    }

    if (editingResponse.buttons && editingResponse.buttons.length >= settings.maxButtons) {
      toast({
        title: "Maximum buttons reached",
        description: `Maximum ${settings.maxButtons} buttons allowed per response.`,
        variant: "destructive",
      });
      return;
    }

    const button: QuickReplyButton = {
      id: Date.now().toString(),
      label: newButton.label.trim(),
      action: newButton.action || 'custom',
      value: newButton.value
    };

    const updatedResponse = {
      ...editingResponse,
      buttons: [...(editingResponse.buttons || []), button]
    };

    const updatedConfig = {
      ...selectedConfig,
      responses: selectedConfig.responses.map(r => 
        r.id === editingResponse.id ? updatedResponse : r
      )
    };

    setConfigs(configs.map(c => c.id === selectedConfig.id ? updatedConfig : c));
    setSelectedConfig(updatedConfig);
    setNewButton({});
    onConfigUpdate?.(configs);
  };

  const handleEditConfig = (config: KeywordConfig) => {
    setSelectedConfig(config);
    setIsEditing(true);
  };

  const handleDeleteConfig = (configId: string) => {
    try {
      const config = configs.find(c => c.id === configId);
      if (config?.isDefault) {
        toast({
          title: "Cannot delete default config",
          description: "Default configurations cannot be deleted.",
          variant: "destructive",
        });
        return;
      }

      const updatedConfigs = configs.filter(c => c.id !== configId);
      setConfigs(updatedConfigs);
      onConfigUpdate?.(updatedConfigs);
    } catch (error) {
      toast({
        title: "Error deleting config",
        description: error instanceof Error ? error.message : "Failed to delete configuration.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateConfig = () => {
    if (!selectedConfig) return;

    try {
      const updatedConfigs = configs.map(c => 
        c.id === selectedConfig.id ? selectedConfig : c
      );
      setConfigs(updatedConfigs);
      setIsEditing(false);
      onConfigUpdate?.(updatedConfigs);
    } catch (error) {
      toast({
        title: "Error updating config",
        description: error instanceof Error ? error.message : "Failed to update configuration.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = (newSettings: Partial<AutoReplySettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      autoReplyService.updateSettings(updatedSettings);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Auto Reply Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enable Auto Reply</Label>
            <Switch
              id="enabled"
              checked={settings.isEnabled}
              onCheckedChange={(checked) => handleUpdateSettings({ isEnabled: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="caseSensitive">Case Sensitive</Label>
            <Switch
              id="caseSensitive"
              checked={settings.caseSensitive}
              onCheckedChange={(checked) => handleUpdateSettings({ caseSensitive: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultLanguage">Default Language</Label>
            <Select
              value={settings.defaultLanguage}
              onValueChange={(value: Language) => handleUpdateSettings({ defaultLanguage: value })}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keyword Configurations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="newKeyword">New Keyword</Label>
              <Input
                id="newKeyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Enter keyword"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddConfig}>
                <Plus className="mr-2 h-4 w-4" />
                Add Keyword
              </Button>
            </div>
          </div>

          {configs.map((config) => (
            <Card key={config.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{config.keyword}</h3>
                  <p className="text-sm text-gray-500">
                    {config.variations.length} variations
                  </p>
                </div>
                <div className="flex gap-2">
                  {!config.isDefault && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteConfig(config.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleEditConfig(config)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isEditing && selectedConfig?.id === config.id && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>Variations</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newVariation}
                          onChange={(e) => setNewVariation(e.target.value)}
                          placeholder="Add variation"
                        />
                        <Button onClick={handleAddVariation}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {config.variations.map((variation) => (
                          <span
                            key={variation.id}
                            className="px-2 py-1 bg-gray-100 rounded text-sm"
                          >
                            {variation.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Responses</Label>
                    {config.responses.map((response) => (
                      <div key={response.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Select
                            value={response.language}
                            onValueChange={(value: Language) => {
                              const updatedResponse = {
                                ...response,
                                language: value
                              };
                              setSelectedConfig({
                                ...selectedConfig,
                                responses: selectedConfig.responses.map(r =>
                                  r.id === response.id ? updatedResponse : r
                                )
                              });
                            }}
                          >
                            <SelectTrigger className="w-[200px]">
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
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingResponse(response)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={response.text}
                          onChange={(e) => {
                            const updatedResponse = {
                              ...response,
                              text: e.target.value
                            };
                            setSelectedConfig({
                              ...selectedConfig,
                              responses: selectedConfig.responses.map(r =>
                                r.id === response.id ? updatedResponse : r
                              )
                            });
                          }}
                          placeholder="Enter response text"
                          maxLength={settings.maxResponseLength}
                        />
                        {editingResponse?.id === response.id && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                value={newButton.label || ''}
                                onChange={(e) => setNewButton({ ...newButton, label: e.target.value })}
                                placeholder="Button label"
                                maxLength={20}
                              />
                              <Select
                                value={newButton.action || 'custom'}
                                onValueChange={(value: 'optin' | 'optout' | 'custom') =>
                                  setNewButton({ ...newButton, action: value })
                                }
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="custom">Custom</SelectItem>
                                  <SelectItem value="optin">Opt-in</SelectItem>
                                  <SelectItem value="optout">Opt-out</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button onClick={handleAddButton}>
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => setEditingResponse(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {response.buttons?.map((button) => (
                                <span
                                  key={button.id}
                                  className="px-2 py-1 bg-gray-100 rounded text-sm"
                                >
                                  {button.label} ({button.action})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateConfig}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}; 