import React, { useState, useEffect } from 'react';
import { KeywordConfig, Language, KeywordResponse, KeywordVariation } from '../lib/types';
import { AutoReplyService } from '../lib/services/auto-reply.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

  const autoReplyService = new AutoReplyService();

  useEffect(() => {
    // Load initial configurations
    const initialConfigs = autoReplyService.getKeywordConfigs();
    setConfigs(initialConfigs);
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
        language: selectedLanguage
      }],
      isDefault: false
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

    const variation: KeywordVariation = {
      id: Date.now().toString(),
      text: newVariation.trim()
    };

    const updatedConfig = {
      ...selectedConfig,
      variations: [...selectedConfig.variations, variation]
    };

    const updatedConfigs = configs.map(c => c.id === selectedConfig.id ? updatedConfig : c);
    setConfigs(updatedConfigs);
    setSelectedConfig(updatedConfig);
    setNewVariation('');
    onConfigUpdate?.(updatedConfigs);
  };

  const handleEditConfig = (config: KeywordConfig) => {
    setSelectedConfig(config);
    setIsEditing(true);
  };

  const handleDeleteConfig = (configId: string) => {
    const updatedConfigs = configs.filter(c => c.id !== configId);
    setConfigs(updatedConfigs);
    if (selectedConfig?.id === configId) {
      setSelectedConfig(null);
    }
    onConfigUpdate?.(updatedConfigs);
  };

  const handleUpdateConfig = (config: KeywordConfig) => {
    const updatedConfigs = configs.map(c => c.id === config.id ? config : c);
    setConfigs(updatedConfigs);
    setSelectedConfig(null);
    setIsEditing(false);
    onConfigUpdate?.(updatedConfigs);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="new-keyword">New Keyword</Label>
          <Input
            id="new-keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Enter keyword (e.g., help, support)"
          />
        </div>
        <div className="flex-1">
          <Label>Language</Label>
          <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
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
        <div className="flex items-end">
          <Button onClick={handleAddConfig}>
            <Plus className="h-4 w-4 mr-2" /> Add Keyword
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {configs.map((config) => (
          <Card key={config.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{config.keyword}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditConfig(config)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteConfig(config.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Variations</Label>
                  <div className="flex gap-2 mt-2">
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
                        className="px-2 py-1 bg-secondary rounded-md text-sm"
                      >
                        {variation.text}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Responses</Label>
                  {config.responses.map((response) => (
                    <div key={response.id} className="mt-2">
                      <div className="text-sm text-muted-foreground mb-1">
                        {response.language}
                      </div>
                      <div className="p-2 bg-secondary rounded-md">
                        {response.text || 'No response configured'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 