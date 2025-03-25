export type Language = 
  | "English" 
  | "Hindi" 
  | "Tamil" 
  | "Mandarin" 
  | "Thai" 
  | "Arabic" 
  | "Spanish" 
  | "Portuguese" 
  | "French";

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