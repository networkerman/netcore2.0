import { KeywordConfig, KeywordResponse, Language, MessageType, AutoReplySettings, QuickReplyButton } from '../types';
import { OptService } from './opt-service';
import { AIService } from './ai-service';

export class AutoReplyService {
  private static instance: AutoReplyService;
  private keywordConfigs: KeywordConfig[] = [];
  private defaultConfig?: KeywordConfig;
  private settings: AutoReplySettings;
  private readonly STORAGE_KEY = 'auto_reply_configs';
  private readonly SETTINGS_KEY = 'auto_reply_settings';
  private optService: OptService;
  private aiService: AIService;
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.settings = {
      isEnabled: true,
      defaultLanguage: 'English',
      caseSensitive: false,
      maxVariations: 5,
      maxButtons: 3,
      maxResponseLength: 1024
    };
    this.optService = new OptService();
    this.aiService = new AIService();
  }

  public static getInstance(): AutoReplyService {
    if (!AutoReplyService.instance) {
      AutoReplyService.instance = new AutoReplyService();
    }
    return AutoReplyService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        // Load configurations and settings
        await this.loadConfigs();
        await this.loadSettings();

        // Initialize default configurations if none exist
        if (this.keywordConfigs.length === 0) {
          await this.initializeDefaultConfigs();
        } else {
          // Set default config from existing configs
          this.defaultConfig = this.keywordConfigs.find(c => c.isDefault) || this.keywordConfigs[0];
        }

        this.initialized = true;
      } catch (error) {
        console.error('Error initializing AutoReplyService:', error);
        throw new Error('Failed to initialize Auto Reply service');
      } finally {
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  private async initializeDefaultConfigs() {
    this.defaultConfig = {
      id: 'default',
      keyword: 'default',
      variations: [],
      responses: [
        {
          id: 'default-response',
          text: 'Thank you for your message. We will get back to you soon.',
          language: 'English' as Language,
          buttons: []
        }
      ],
      isDefault: true,
      isEnabled: true
    };

    const defaultConfigs: KeywordConfig[] = [
      this.defaultConfig,
      {
        id: 'stop',
        keyword: 'stop',
        variations: [
          { id: 'stop1', text: 'stop' },
          { id: 'stop2', text: 'unsubscribe' },
          { id: 'stop3', text: 'optout' }
        ],
        responses: [
          {
            id: 'stop_response',
            text: 'You have been unsubscribed from our messages. To subscribe again, please send "start".',
            language: 'English' as Language,
            buttons: []
          }
        ],
        isDefault: true,
        isEnabled: true
      }
    ];

    this.keywordConfigs = defaultConfigs;
    await this.saveConfigs();
  }

  private async loadConfigs() {
    try {
      const savedConfigs = localStorage.getItem(this.STORAGE_KEY);
      if (savedConfigs) {
        const parsedConfigs = JSON.parse(savedConfigs);
        // Preserve default configs
        const defaultConfigs = this.keywordConfigs.filter(c => c.isDefault);
        this.keywordConfigs = [...defaultConfigs, ...parsedConfigs.filter((c: KeywordConfig) => !c.isDefault)];
      }
    } catch (error) {
      console.error('Error loading auto reply configs:', error);
    }
  }

  private async loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error loading auto reply settings:', error);
    }
  }

  private async saveConfigs() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.keywordConfigs));
    } catch (error) {
      console.error('Error saving auto reply configs:', error);
    }
  }

  private async saveSettings() {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving auto reply settings:', error);
    }
  }

  public getKeywordConfigs(): KeywordConfig[] {
    return [...this.keywordConfigs];
  }

  public async addKeywordConfig(config: KeywordConfig): Promise<void> {
    this.keywordConfigs.push(config);
    await this.saveConfigs();
  }

  public async updateKeywordConfig(config: KeywordConfig): Promise<void> {
    const index = this.keywordConfigs.findIndex(c => c.id === config.id);
    if (index !== -1) {
      this.keywordConfigs[index] = config;
      await this.saveConfigs();
    }
  }

  public async deleteKeywordConfig(configId: string): Promise<void> {
    this.keywordConfigs = this.keywordConfigs.filter(c => c.id !== configId);
    await this.saveConfigs();
  }

  public async generateVariations(keyword: string, language: Language = 'English'): Promise<{ id: string; text: string }[]> {
    try {
      const variations = await this.aiService.generateVariations(keyword, language, this.settings.maxVariations);
      return variations.map((text, index) => ({
        id: `${keyword}-var-${index + 1}`,
        text
      }));
    } catch (error) {
      console.error('Error generating variations:', error);
      return [];
    }
  }

  public findMatchingResponse(message: string, language: Language = 'English'): KeywordResponse {
    if (!this.settings.isEnabled) {
      return this.defaultConfig!.responses[0];
    }

    const normalizedMessage = this.settings.caseSensitive 
      ? message.trim() 
      : message.toLowerCase().trim();
    
    // Find matching keyword config
    const matchingConfig = this.keywordConfigs.find(config => {
      if (!config.isEnabled) return false;
      
      const keywordMatch = this.settings.caseSensitive
        ? config.keyword === normalizedMessage
        : config.keyword.toLowerCase() === normalizedMessage;
      
      const variationMatch = config.variations.some(
        variation => this.settings.caseSensitive
          ? variation.text === normalizedMessage
          : variation.text.toLowerCase() === normalizedMessage
      );
      
      return keywordMatch || variationMatch;
    });

    if (matchingConfig) {
      // Find response in matching language
      const languageResponse = matchingConfig.responses.find(
        response => response.language === language
      );
      
      // Fallback to English if language not found
      if (languageResponse) {
        return languageResponse;
      }
    }

    // Return default response if no match found
    return this.defaultConfig!.responses[0];
  }

  public getSettings(): AutoReplySettings {
    return { ...this.settings };
  }

  public async updateSettings(settings: Partial<AutoReplySettings>): Promise<void> {
    this.settings = { ...this.settings, ...settings };
    await this.saveSettings();
  }

  public isEnabled(): boolean {
    return this.settings.isEnabled;
  }

  public async handleButtonAction(button: QuickReplyButton, phoneNumber: string): Promise<void> {
    switch (button.action) {
      case 'optin':
        await this.optService.optIn(phoneNumber);
        break;
      case 'optout':
        await this.optService.optOut(phoneNumber);
        break;
      case 'custom':
        // Handle custom button actions here
        console.log('Custom button action:', button.value);
        break;
    }
  }
} 