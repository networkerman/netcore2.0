import { KeywordConfig, KeywordResponse, Language, MessageType } from '../types';

export class AutoReplyService {
  private keywordConfigs: KeywordConfig[] = [];
  private defaultConfig?: KeywordConfig;

  constructor() {
    // Initialize with default configurations
    this.initializeDefaultConfigs();
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

  public addKeywordConfig(config: KeywordConfig): void {
    this.keywordConfigs.push(config);
  }

  public removeKeywordConfig(configId: string): void {
    this.keywordConfigs = this.keywordConfigs.filter(config => config.id !== configId);
  }

  public updateKeywordConfig(config: KeywordConfig): void {
    const index = this.keywordConfigs.findIndex(c => c.id === config.id);
    if (index !== -1) {
      this.keywordConfigs[index] = config;
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
} 