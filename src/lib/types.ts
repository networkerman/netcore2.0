export type Language = 'English' | 'Hindi' | 'Spanish' | 'French' | 'German';

export type TemplateLayout = 
  | 'text'
  | 'single-product'
  | 'multi-product'
  | 'catalog'
  | 'order-details'
  | 'order-status'
  | 'rich-media'
  | 'quick-reply'
  | 'carousel'
  | 'authentication';

export type MessageType = "text" | "quick_reply";

export interface QuickReplyButton {
  id: string;
  label: string;
  action?: "optin" | "optout" | "custom";
  value?: string;
}

export interface KeywordResponse {
  id: string;
  text: string;
  language: Language;
  buttons?: QuickReplyButton[];
  variables?: string[];
}

export interface KeywordVariation {
  id: string;
  text: string;
}

export interface KeywordConfig {
  id: string;
  keyword: string;
  variations: KeywordVariation[];
  responses: KeywordResponse[];
  isDefault?: boolean;
  isEnabled?: boolean;
}

export interface AutoReplySettings {
  isEnabled: boolean;
  defaultLanguage: Language;
  caseSensitive: boolean;
  maxVariations: number;
  maxButtons: number;
  maxResponseLength: number;
}

export interface APIPayload {
  type: "optin" | "optout";
  recipients: {
    recipient: string;
    source: string;
    user_agent: string;
    ip: string;
  }[];
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  templateId?: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  lastMessage: string;
  timestamp: number;
  status: 'active' | 'resolved' | 'archived';
}

export interface ConversationMessage {
  id: string;
  text: string;
  sender: 'customer' | 'business';
  timestamp: number;
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: any;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  type: 'text' | 'media' | 'interactive';
  language: Language;
  layout: TemplateLayout;
  variables: Variable[];
  products?: Product[];
  catalogId?: string;
  orderId?: string;
  mediaUrl?: string;
  buttons?: Button[];
  cards?: Card[];
  otpCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
}

export interface Button {
  id: string;
  text: string;
  type: 'reply' | 'url' | 'phone';
  value: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttons: Button[];
}

export interface TemplateSection {
  type: string;
  text: string;
  variables: Variable[];
}

export type VariableType = 'text' | 'number' | 'date' | 'currency' | 'url';

export interface Variable {
  name: string;
  type: VariableType;
  defaultValue?: string;
  required: boolean;
} 