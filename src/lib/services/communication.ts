import { LoggingService } from './logging.service';
import { AIService } from './ai.service';
import { Template, TemplateSection, Variable, VariableType, Language } from '../types';

export class CommunicationService {
  private static instance: CommunicationService;
  private loggingService: LoggingService;
  private aiService: AIService;
  private templates: Template[] = [];

  private constructor() {
    this.loggingService = LoggingService.getInstance();
    this.aiService = AIService.getInstance();
    this.loadTemplates();
  }

  public static getInstance(): CommunicationService {
    if (!CommunicationService.instance) {
      CommunicationService.instance = new CommunicationService();
    }
    return CommunicationService.instance;
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

  private async saveTemplates() {
    try {
      localStorage.setItem('templates', JSON.stringify(this.templates));
    } catch (error) {
      this.loggingService.log('error', 'Failed to save templates', { error });
    }
  }

  public async getTemplates(): Promise<Template[]> {
    return this.templates;
  }

  public async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    try {
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
      const index = this.templates.findIndex(t => t.id === template.id);
      if (index === -1) {
        throw new Error('Template not found');
      }
      this.templates[index] = {
        ...template,
        updatedAt: new Date().toISOString()
      };
      await this.saveTemplates();
      return this.templates[index];
    } catch (error) {
      this.loggingService.log('error', 'Failed to update template', { error });
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

  // Auto-Reply
  public async findMatchingResponse(message: string, language: Language = 'English'): Promise<string | null> {
    try {
      this.loggingService.log('info', 'Finding matching response', { message, language });
      
      // TODO: Implement keyword matching logic
      const response = await this.aiService.generateResponse(message, language);
      return response;
    } catch (error) {
      this.loggingService.log('error', 'Failed to find matching response', { error });
      throw error;
    }
  }
} 