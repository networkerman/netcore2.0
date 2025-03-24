import React, { useState, useEffect } from 'react';
import { KeywordConfig, Language, KeywordResponse, KeywordVariation } from '../lib/types';
import { AutoReplyService } from '../lib/services/auto-reply.service';

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

  const autoReplyService = new AutoReplyService();

  useEffect(() => {
    // Load initial configurations
    const initialConfigs = autoReplyService.getKeywordConfigs();
    setConfigs(initialConfigs);
  }, []);

  const handleAddConfig = () => {
    if (!newKeyword.trim()) return;

    const newConfig: KeywordConfig = {
      id: Date.now().toString(),
      keyword: newKeyword.trim(),
      variations: [],
      responses: [],
      isDefault: false
    };

    setConfigs([...configs, newConfig]);
    setNewKeyword('');
    onConfigUpdate?.(configs);
  };

  const handleAddVariation = () => {
    if (!selectedConfig || !newVariation.trim()) return;

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

  const handleAddResponse = () => {
    if (!selectedConfig || !newResponse.trim()) return;

    const response: KeywordResponse = {
      id: Date.now().toString(),
      text: newResponse.trim(),
      language: selectedLanguage
    };

    const updatedConfig = {
      ...selectedConfig,
      responses: [...selectedConfig.responses, response]
    };

    setConfigs(configs.map(c => c.id === selectedConfig.id ? updatedConfig : c));
    setSelectedConfig(updatedConfig);
    setNewResponse('');
    onConfigUpdate?.(configs);
  };

  const handleDeleteConfig = (configId: string) => {
    setConfigs(configs.filter(c => c.id !== configId));
    if (selectedConfig?.id === configId) {
      setSelectedConfig(null);
    }
    onConfigUpdate?.(configs);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Keyword Configuration Manager</h2>
      
      {/* Add new keyword */}
      <div className="mb-4">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Enter new keyword"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddConfig}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Keyword
        </button>
      </div>

      {/* Keyword list */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Keywords</h3>
        <div className="space-y-2">
          {configs.map(config => (
            <div
              key={config.id}
              className={`p-2 border rounded ${
                selectedConfig?.id === config.id ? 'bg-blue-100' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => setSelectedConfig(config)}
                >
                  {config.keyword}
                </span>
                <button
                  onClick={() => handleDeleteConfig(config.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected keyword details */}
      {selectedConfig && (
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">
            Details for: {selectedConfig.keyword}
          </h3>

          {/* Add variation */}
          <div className="mb-4">
            <input
              type="text"
              value={newVariation}
              onChange={(e) => setNewVariation(e.target.value)}
              placeholder="Enter variation"
              className="border p-2 mr-2"
            />
            <button
              onClick={handleAddVariation}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Variation
            </button>
          </div>

          {/* Variations list */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Variations:</h4>
            <ul className="list-disc pl-5">
              {selectedConfig.variations.map(variation => (
                <li key={variation.id}>{variation.text}</li>
              ))}
            </ul>
          </div>

          {/* Add response */}
          <div className="mb-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              className="border p-2 mr-2"
            >
              {AVAILABLE_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <input
              type="text"
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              placeholder="Enter response"
              className="border p-2 mr-2"
            />
            <button
              onClick={handleAddResponse}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Add Response
            </button>
          </div>

          {/* Responses list */}
          <div>
            <h4 className="font-semibold mb-2">Responses:</h4>
            <ul className="space-y-2">
              {selectedConfig.responses.map(response => (
                <li key={response.id} className="border p-2 rounded">
                  <div className="font-medium">{response.language}</div>
                  <div>{response.text}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}; 