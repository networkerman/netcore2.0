import { KeywordConfig, KeywordResponse, Language, MessageType } from '../types';

export class AutoReplyService {
  private keywordConfigs: KeywordConfig[] = [];
  private defaultConfig?: KeywordConfig;
  private readonly STORAGE_KEY = 'auto_reply_configs';

  constructor() {
    // Initialize with default configurations
    this.initializeDefaultConfigs();
    this.loadConfigs();
  }

  private initializeDefaultConfigs() {
    // Default configuration for opt-in
    this.defaultConfig = {
      id: 'default',
      keyword: 'default',
      variations: [],
      responses: [
        {
          id: 'default-response',
          text: 'Thank you for your message. We will get back to you soon.',
          language: 'English'
        }
      ],
      isDefault: true
    };
  }

  private loadConfigs() {
    try {
      const savedConfigs = localStorage.getItem(this.STORAGE_KEY);
      if (savedConfigs) {
        this.keywordConfigs = JSON.parse(savedConfigs);
      }
    } catch (error) {
      console.error('Error loading auto reply configs:', error);
    }
  }

  private saveConfigs() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.keywordConfigs));
    } catch (error) {
      console.error('Error saving auto reply configs:', error);
    }
  }

  public addKeywordConfig(config: KeywordConfig): void {
    this.keywordConfigs.push(config);
    this.saveConfigs();
  }

  public removeKeywordConfig(configId: string): void {
    this.keywordConfigs = this.keywordConfigs.filter(config => config.id !== configId);
    this.saveConfigs();
  }

  public updateKeywordConfig(config: KeywordConfig): void {
    const index = this.keywordConfigs.findIndex(c => c.id === config.id);
    if (index !== -1) {
      this.keywordConfigs[index] = config;
      this.saveConfigs();
    }
  }

  public findMatchingResponse(message: string, language: Language = 'English'): KeywordResponse {
    const normalizedMessage = message.toLowerCase().trim();
    
    // Find matching keyword config
    const matchingConfig = this.keywordConfigs.find(config => {
      const keywordMatch = config.keyword.toLowerCase() === normalizedMessage;
      const variationMatch = config.variations.some(
        variation => variation.text.toLowerCase() === normalizedMessage
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

  public isEnabled(): boolean {
    return this.keywordConfigs.length > 0;
  }

  public setEnabled(enabled: boolean): void {
    if (!enabled) {
      this.keywordConfigs = [];
      this.saveConfigs();
    }
  }
} 