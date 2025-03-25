export type AdPlatform = 'google-ads' | 'meta' | 'linkedin' | 'twitter';

export type AdFormat = 'image' | 'video' | 'carousel' | 'text' | 'responsive';

export type AdStatus = 'draft' | 'pending_review' | 'active' | 'paused' | 'completed';

export type WhatsAppTemplateStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  status: WhatsAppTemplateStatus;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  components: {
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    text?: string;
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    example?: {
      header_text?: string[];
      body_text?: string[][];
    };
  }[];
}

export interface WhatsAppAdConfig {
  templateId: string;
  phoneNumberId: string;
  headerVariables?: string[];
  bodyVariables?: string[][];
  callToAction: {
    text: string;
    phoneNumber?: string;
  };
}

export interface AdCreative {
  id: string;
  title: string;
  description: string;
  format: AdFormat;
  assets: {
    primary: string; // URL to main asset
    additional?: string[]; // URLs to additional assets (for carousel etc.)
  };
  specs: {
    dimensions?: { width: number; height: number };
    duration?: number; // for video ads
    fileSize?: number;
  };
  variations?: AdCreative[]; // for A/B testing
  whatsappConfig?: WhatsAppAdConfig; // New field for CTWA ads
}

export interface AdCampaign {
  id: string;
  name: string;
  objective: 'awareness' | 'consideration' | 'conversion';
  platform: AdPlatform;
  status: AdStatus;
  budget: {
    daily?: number;
    total: number;
    currency: string;
  };
  targeting: {
    locations?: string[];
    ageRange?: { min: number; max: number };
    interests?: string[];
    demographics?: Record<string, any>;
    customAudiences?: string[];
  };
  schedule: {
    startDate: string;
    endDate?: string;
    timezone: string;
  };
  creatives: AdCreative[];
  tracking: {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent?: string;
    utmTerm?: string;
    customParameters?: Record<string, string>;
  };
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
}

export interface AdSet {
  id: string;
  campaignId: string;
  name: string;
  status: AdStatus;
  budget: {
    daily?: number;
    total: number;
    currency: string;
  };
  bidStrategy: 'lowest_cost' | 'target_cost' | 'manual';
  targeting: AdCampaign['targeting'];
  creatives: AdCreative[];
}

export interface AdMetrics {
  id: string;
  campaignId: string;
  adSetId?: string;
  creativeId: string;
  timestamp: string;
  metrics: {
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    conversionRate: number;
    roas: number;
  };
} 