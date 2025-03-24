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

export interface QuickReplyButton {
  id: string;
  text: string;
  action?: "optin" | "optout" | "custom";
}

export interface KeywordResponse {
  id: string;
  text: string;
  language: Language;
  quickReplyButtons?: QuickReplyButton[];
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
}

export type MessageType = "received" | "sent";

export interface APIPayload {
  type: "optin" | "optout";
  recipients: {
    recipient: string;
    source: string;
    user_agent: string;
    ip: string;
  }[];
} 