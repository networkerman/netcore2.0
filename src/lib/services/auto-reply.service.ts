import { KeywordConfig, KeywordResponse, Language, MessageType, AutoReplySettings, QuickReplyButton } from '../types';
import { OptService } from './opt-service';

export class AutoReplyService {
  private keywordConfigs: KeywordConfig[] = [];
  private defaultConfig?: KeywordConfig;
  private settings: AutoReplySettings;
  private readonly STORAGE_KEY = 'auto_reply_configs';
  private readonly SETTINGS_KEY = 'auto_reply_settings';
  private optService: OptService;

  constructor() {
    this.settings = {
      isEnabled: true,
      defaultLanguage: 'English',
      caseSensitive: false,
      maxVariations: 5,
      maxButtons: 3,
      maxResponseLength: 1024
    };
    this.optService = new OptService();
    this.initialize();
    this.loadConfigs();
    this.loadSettings();
  }

  initialize() {
    // Load default configurations
    this.keywordConfigs = [
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
            id: 'stop_resp',
            language: "English",
            text: 'You have been unsubscribed from our messages. To subscribe again, send "start".',
            buttons: []
          }
        ]
      },
      {
        id: 'start',
        keyword: 'start',
        variations: [
          { id: 'start1', text: 'start' },
          { id: 'start2', text: 'subscribe' },
          { id: 'start3', text: 'optin' }
        ],
        responses: [
          {
            id: 'start_resp',
            language: "English",
            text: 'Welcome! You are now subscribed to our messages. Send "stop" to unsubscribe.',
            buttons: []
          }
        ]
      }
    ];
  }

  private loadConfigs() {
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

  private loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error loading auto reply settings:', error);
    }
  }

  private saveConfigs() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.keywordConfigs));
    } catch (error) {
      console.error('Error saving auto reply configs:', error);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving auto reply settings:', error);
    }
  }

  public addKeywordConfig(config: KeywordConfig): void {
    if (!this.settings.isEnabled) return;
    
    // Validate config
    if (config.variations.length > this.settings.maxVariations) {
      throw new Error(`Maximum ${this.settings.maxVariations} variations allowed per keyword`);
    }

    // Validate responses
    config.responses.forEach(response => {
      if (response.text.length > this.settings.maxResponseLength) {
        throw new Error(`Response text exceeds maximum length of ${this.settings.maxResponseLength} characters`);
      }
      if (response.buttons && response.buttons.length > this.settings.maxButtons) {
        throw new Error(`Maximum ${this.settings.maxButtons} buttons allowed per response`);
      }
    });

    this.keywordConfigs.push(config);
    this.saveConfigs();
  }

  public removeKeywordConfig(configId: string): void {
    if (!this.settings.isEnabled) return;
    const config = this.keywordConfigs.find(c => c.id === configId);
    if (config?.isDefault) {
      throw new Error('Cannot remove default configurations');
    }
    this.keywordConfigs = this.keywordConfigs.filter(config => config.id !== configId);
    this.saveConfigs();
  }

  public updateKeywordConfig(config: KeywordConfig): void {
    if (!this.settings.isEnabled) return;
    
    // Validate config
    if (config.variations.length > this.settings.maxVariations) {
      throw new Error(`Maximum ${this.settings.maxVariations} variations allowed per keyword`);
    }

    // Validate responses
    config.responses.forEach(response => {
      if (response.text.length > this.settings.maxResponseLength) {
        throw new Error(`Response text exceeds maximum length of ${this.settings.maxResponseLength} characters`);
      }
      if (response.buttons && response.buttons.length > this.settings.maxButtons) {
        throw new Error(`Maximum ${this.settings.maxButtons} buttons allowed per response`);
      }
    });

    const index = this.keywordConfigs.findIndex(c => c.id === config.id);
    if (index !== -1) {
      this.keywordConfigs[index] = config;
      this.saveConfigs();
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

  public getKeywordConfigs(): KeywordConfig[] {
    return [...this.keywordConfigs];
  }

  public getDefaultConfig(): KeywordConfig | undefined {
    return this.defaultConfig;
  }

  public getSettings(): AutoReplySettings {
    return { ...this.settings };
  }

  public updateSettings(settings: Partial<AutoReplySettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
  }

  public isEnabled(): boolean {
    return this.settings.isEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.settings.isEnabled = enabled;
    this.saveSettings();
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