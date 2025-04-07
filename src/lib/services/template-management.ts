import { LoggingService } from './logging.service';
import { AIService } from './ai.service';
import { Template, TemplateSection, Variable, VariableType, Language, TemplateLayout, Product } from '../types';

export class TemplateManagementService {
  private static instance: TemplateManagementService;
  private loggingService: LoggingService;
  private aiService: AIService;
  private templates: Template[] = [];
  private lastEditTimestamps: Record<string, number> = {};
  private activeJourneys: Set<string> = new Set();

  private constructor() {
    this.loggingService = LoggingService.getInstance();
    this.aiService = AIService.getInstance();
    this.loadTemplates();
    this.loadActiveJourneys();
  }

  public static getInstance(): TemplateManagementService {
    if (!TemplateManagementService.instance) {
      TemplateManagementService.instance = new TemplateManagementService();
    }
    return TemplateManagementService.instance;
  }

  private async loadTemplates() {
    try {
      const storedTemplates = localStorage.getItem('templates');
      if (storedTemplates) {
        this.templates = JSON.parse(storedTemplates);
      }
    } catch (error) {
      this.loggingService.log('error', 'Failed to load templates', { error });
    }
  }

  private async loadActiveJourneys() {
    try {
      const storedJourneys = localStorage.getItem('activeJourneys');
      if (storedJourneys) {
        this.activeJourneys = new Set(JSON.parse(storedJourneys));
      }
    } catch (error) {
      this.loggingService.log('error', 'Failed to load active journeys', { error });
    }
  }

  private async saveTemplates() {
    try {
      localStorage.setItem('templates', JSON.stringify(this.templates));
    } catch (error) {
      this.loggingService.log('error', 'Failed to save templates', { error });
    }
  }

  private async saveActiveJourneys() {
    try {
      localStorage.setItem('activeJourneys', JSON.stringify(Array.from(this.activeJourneys)));
    } catch (error) {
      this.loggingService.log('error', 'Failed to save active journeys', { error });
    }
  }

  public async getTemplates(): Promise<Template[]> {
    return this.templates;
  }

  public async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    try {
      this.validateTemplate(template);
      const newTemplate: Template = {
        ...template,
        id: `template_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.templates.push(newTemplate);
      await this.saveTemplates();
      return newTemplate;
    } catch (error) {
      this.loggingService.log('error', 'Failed to create template', { error });
      throw error;
    }
  }

  public async updateTemplate(template: Template): Promise<Template> {
    try {
      if (this.canEditTemplate(template.id)) {
        this.validateTemplate(template);
        const index = this.templates.findIndex(t => t.id === template.id);
        if (index === -1) {
          throw new Error('Template not found');
        }
        this.templates[index] = {
          ...template,
          updatedAt: new Date().toISOString()
        };
        this.lastEditTimestamps[template.id] = Date.now();
        await this.saveTemplates();
        return this.templates[index];
      } else {
        throw new Error('Template cannot be edited more than once in 24 hours');
      }
    } catch (error) {
      this.loggingService.log('error', 'Failed to update template', { error });
      throw error;
    }
  }

  private canEditTemplate(templateId: string): boolean {
    const lastEdit = this.lastEditTimestamps[templateId];
    if (!lastEdit) return true;
    const hoursSinceLastEdit = (Date.now() - lastEdit) / (1000 * 60 * 60);
    return hoursSinceLastEdit >= 24;
  }

  private validateTemplate(template: Omit<Template, 'id'> | Template) {
    // Validate template content length
    if (template.content.length > 1024) {
      throw new Error('Template content exceeds maximum length of 1024 characters');
    }

    // Validate variables
    const variableRegex = /{{([^}]+)}}/g;
    const matches = template.content.match(variableRegex);
    if (matches) {
      const usedVariables = matches.map(match => match.slice(2, -2));
      const definedVariables = template.variables.map(v => v.name);
      
      // Check for undefined variables
      const undefinedVariables = usedVariables.filter(v => !definedVariables.includes(v));
      if (undefinedVariables.length > 0) {
        throw new Error(`Undefined variables found: ${undefinedVariables.join(', ')}`);
      }

      // Check for unused variables
      const unusedVariables = definedVariables.filter(v => !usedVariables.includes(v));
      if (unusedVariables.length > 0) {
        throw new Error(`Unused variables found: ${unusedVariables.join(', ')}`);
      }
    }

    // Validate layout-specific constraints
    this.validateLayout(template);

    // Validate media constraints
    this.validateMedia(template);
  }

  private validateLayout(template: Omit<Template, 'id'> | Template) {
    switch (template.layout) {
      case 'text':
        // Text templates have no additional constraints
        break;
      case 'single-product':
      case 'multi-product':
        if (!template.products || template.products.length === 0) {
          throw new Error(`${template.layout} template requires at least one product`);
        }
        if (template.layout === 'multi-product' && template.products.length > 4) {
          throw new Error('Multi-product template can have at most 4 products');
        }
        break;
      case 'catalog':
        if (!template.catalogId) {
          throw new Error('Catalog template requires a catalog ID');
        }
        break;
      case 'order-details':
      case 'order-status':
        if (!template.orderId) {
          throw new Error(`${template.layout} template requires an order ID`);
        }
        break;
      case 'rich-media':
        if (!template.mediaUrl) {
          throw new Error('Rich media template requires a media URL');
        }
        break;
      case 'quick-reply':
        if (!template.buttons || template.buttons.length === 0) {
          throw new Error('Quick reply template requires at least one button');
        }
        if (template.buttons.length > 3) {
          throw new Error('Quick reply template can have at most 3 buttons');
        }
        break;
      case 'carousel':
        if (!template.cards || template.cards.length === 0) {
          throw new Error('Carousel template requires at least one card');
        }
        if (template.cards.length > 10) {
          throw new Error('Carousel template can have at most 10 cards');
        }
        break;
      case 'authentication':
        if (!template.otpCode) {
          throw new Error('Authentication template requires an OTP code');
        }
        break;
    }
  }

  private validateMedia(template: Omit<Template, 'id'> | Template) {
    if (template.mediaUrl) {
      const mediaSize = this.getMediaSize(template.mediaUrl);
      if (mediaSize > 2 * 1024 * 1024) { // 2MB limit
        throw new Error('Media file size exceeds 2MB limit');
      }
      const mediaType = this.getMediaType(template.mediaUrl);
      if (!['image/jpeg', 'image/png'].includes(mediaType)) {
        throw new Error('Media must be JPEG or PNG format');
      }
    }
  }

  private getMediaSize(url: string): number {
    // TODO: Implement actual media size check
    return 0;
  }

  private getMediaType(url: string): string {
    // TODO: Implement actual media type check
    return 'image/jpeg';
  }

  public async renderTemplate(template: Template, data: Record<string, string>): Promise<string> {
    try {
      let renderedContent = template.content;
      template.variables.forEach(variable => {
        const value = data[variable.name] || variable.defaultValue || '';
        const regex = new RegExp(`{{${variable.name}}}`, 'g');
        renderedContent = renderedContent.replace(regex, value);
      });
      return renderedContent;
    } catch (error) {
      this.loggingService.log('error', 'Failed to render template', { error });
      throw error;
    }
  }

  public async sendMessage(params: {
    templateId?: string;
    data?: Record<string, string>;
    message?: string;
    language?: Language;
  }): Promise<string> {
    try {
      if (params.templateId) {
        const template = await this.getTemplate(params.templateId);
        if (!template) {
          throw new Error(`Template not found: ${params.templateId}`);
        }
        return this.renderTemplate(template, params.data || {});
      }
      return params.message || '';
    } catch (error) {
      this.loggingService.log('error', 'Failed to send message', { error });
      throw error;
    }
  }

  public async getTemplate(templateId: string): Promise<Template | null> {
    return this.templates.find(t => t.id === templateId) || null;
  }

  public async deleteTemplate(templateId: string): Promise<void> {
    try {
      this.templates = this.templates.filter(t => t.id !== templateId);
      await this.saveTemplates();
    } catch (error) {
      this.loggingService.log('error', 'Failed to delete template', { error });
      throw error;
    }
  }

  public async validateTemplateContent(content: string, variables: Variable[]): Promise<boolean> {
    try {
      const variableRegex = /{{([^}]+)}}/g;
      const matches = content.match(variableRegex);
      if (!matches) return true;

      const usedVariables = matches.map(match => match.slice(2, -2));
      const definedVariables = variables.map(v => v.name);

      return usedVariables.every(v => definedVariables.includes(v));
    } catch (error) {
      this.loggingService.log('error', 'Failed to validate template content', { error });
      return false;
    }
  }

  public async getBestSellingProducts(limit: number = 4): Promise<Product[]> {
    try {
      // TODO: Implement actual product recommendation logic
      return [];
    } catch (error) {
      this.loggingService.log('error', 'Failed to get best selling products', { error });
      return [];
    }
  }

  public async checkActiveJourneys(templateId: string): Promise<boolean> {
    return this.activeJourneys.has(templateId);
  }

  public async pauseJourney(templateId: string): Promise<void> {
    this.activeJourneys.delete(templateId);
    await this.saveActiveJourneys();
  }

  public async resumeJourney(templateId: string): Promise<void> {
    this.activeJourneys.add(templateId);
    await this.saveActiveJourneys();
  }
} 