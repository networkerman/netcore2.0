
// Mock data for the CTWA dashboard
import { addDays, format, subDays } from "date-fns";

// Types
export interface AdCampaign {
  id: string;
  name: string;
  platform: "Meta" | "Google";
  startDate: string;
  endDate: string | null;
  budget: number;
  spent: number;
}

export interface AdMetrics {
  date: string;
  impressions: number;
  clicks: number;
  conversations: number;
  conversions: number;
  spent: number;
  revenue: number;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  adId: string;
  adName: string;
  ctwaClid: string;
  adUrl: string;
  startTime: string;
  lastMessageTime: string;
  status: "active" | "inactive" | "converted";
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  time: string;
  sender: "customer" | "business";
  message: string;
  type: "text" | "image" | "video" | "document" | "location";
}

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  count: number;
  criteria: string;
}

// Helper functions to generate random data
const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateDateRange = (days: number) => {
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    return format(subDays(today, days - 1 - i), "yyyy-MM-dd");
  });
};

// Generate mock ad campaigns
export const generateAdCampaigns = (count: number = 5): AdCampaign[] => {
  const campaigns = [];
  const platforms: ("Meta" | "Google")[] = ["Meta", "Google"];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const startDate = format(subDays(today, randomBetween(15, 60)), "yyyy-MM-dd");
    const endDate = randomBetween(0, 3) === 0 
      ? null 
      : format(addDays(new Date(startDate), randomBetween(30, 90)), "yyyy-MM-dd");
    const budget = randomBetween(500, 5000);
    const spent = endDate === null ? randomBetween(budget * 0.1, budget * 0.9) : budget;
    
    campaigns.push({
      id: `campaign-${i + 1}`,
      name: `Campaign ${i + 1} ${platforms[i % 2]}`,
      platform: platforms[i % 2],
      startDate,
      endDate,
      budget,
      spent
    });
  }
  
  return campaigns;
};

// Generate mock ad metrics for the last 30 days
export const generateAdMetrics = (days: number = 30): AdMetrics[] => {
  const dates = generateDateRange(days);
  const metrics: AdMetrics[] = [];
  
  let impressionsBase = randomBetween(1000, 5000);
  let clicksBase = impressionsBase * randomBetween(2, 5) / 100;
  let conversationsBase = clicksBase * randomBetween(10, 30) / 100;
  let conversionsBase = conversationsBase * randomBetween(5, 15) / 100;
  let spentBase = randomBetween(50, 100);
  
  dates.forEach((date, i) => {
    // Add some variance each day
    const dayVariance = 1 + (Math.random() * 0.4 - 0.2);
    const weekendEffect = [0, 6].includes(new Date(date).getDay()) ? 0.8 : 1;
    
    const impressions = Math.floor(impressionsBase * dayVariance * weekendEffect);
    const clicks = Math.floor(clicksBase * dayVariance * weekendEffect);
    const conversations = Math.floor(conversationsBase * dayVariance * weekendEffect);
    const conversions = Math.floor(conversionsBase * dayVariance * weekendEffect);
    const spent = Math.floor(spentBase * dayVariance * weekendEffect);
    const revenue = Math.floor(conversions * randomBetween(50, 150));
    
    metrics.push({
      date,
      impressions,
      clicks,
      conversations,
      conversions,
      spent,
      revenue
    });
    
    // Slight trend upward over time for realistic growth pattern
    if (i % 5 === 0) {
      impressionsBase *= 1.05;
      clicksBase *= 1.08;
      conversationsBase *= 1.1;
      conversionsBase *= 1.12;
      spentBase *= 1.03;
    }
  });
  
  return metrics;
};

// Generate mock customer conversations
export const generateConversations = (count: number = 20): Conversation[] => {
  const conversations: Conversation[] = [];
  const statuses: ("active" | "inactive" | "converted")[] = ["active", "inactive", "converted"];
  const adCampaigns = generateAdCampaigns();
  
  for (let i = 0; i < count; i++) {
    const campaign = adCampaigns[i % adCampaigns.length];
    const startTime = format(subDays(new Date(), randomBetween(1, 14)), "yyyy-MM-dd'T'HH:mm:ss");
    const lastMessageTime = format(addDays(new Date(startTime), randomBetween(0, 3)), "yyyy-MM-dd'T'HH:mm:ss");
    const status = statuses[randomBetween(0, 2)];
    
    const messages: ConversationMessage[] = [];
    const messageCount = randomBetween(1, 8);
    
    for (let j = 0; j < messageCount; j++) {
      const time = format(
        addDays(new Date(startTime), j === 0 ? 0 : randomBetween(0, 3) / 24), 
        "yyyy-MM-dd'T'HH:mm:ss"
      );
      const sender = j % 2 === 0 ? "customer" : "business";
      
      messages.push({
        id: `msg-${i}-${j}`,
        time,
        sender,
        message: sender === "customer" 
          ? "Hello, I'm interested in your product." 
          : "Thank you for reaching out! How can I assist you today?",
        type: "text"
      });
    }
    
    if (status === "converted") {
      messages.push({
        id: `msg-${i}-${messageCount}`,
        time: lastMessageTime,
        sender: "customer",
        message: "I'd like to make a purchase now.",
        type: "text"
      });
    }
    
    conversations.push({
      id: `conv-${i}`,
      customerId: `customer-${i}`,
      customerName: `Customer ${i + 1}`,
      adId: campaign.id,
      adName: campaign.name,
      ctwaClid: `clid-${randomBetween(100000, 999999)}`,
      adUrl: `https://fb.com/ads/${randomBetween(100000, 999999)}`,
      startTime,
      lastMessageTime,
      status,
      messages
    });
  }
  
  return conversations;
};

// Generate mock user segments
export const generateUserSegments = (): UserSegment[] => {
  return [
    {
      id: "segment-1",
      name: "Clicked but did not purchase",
      description: "Users who clicked on an ad but did not complete a purchase",
      count: randomBetween(100, 500),
      criteria: "Ad click without conversion event"
    },
    {
      id: "segment-2",
      name: "Abandoned cart",
      description: "Users who added items to cart but did not checkout",
      count: randomBetween(50, 200),
      criteria: "Added to cart without purchase event"
    },
    {
      id: "segment-3",
      name: "High-value conversions",
      description: "Users who made purchases over $100",
      count: randomBetween(20, 100),
      criteria: "Purchase value > $100"
    },
    {
      id: "segment-4",
      name: "Multi-purchase customers",
      description: "Users who made more than one purchase",
      count: randomBetween(10, 50),
      criteria: "Purchase count > 1"
    },
    {
      id: "segment-5",
      name: "Meta campaign conversions",
      description: "Users who converted from Meta campaigns",
      count: randomBetween(30, 150),
      criteria: "Platform = Meta AND Converted = true"
    }
  ];
};

// Calculate summary metrics
export const calculateSummaryMetrics = (metrics: AdMetrics[]) => {
  return metrics.reduce((acc, curr) => {
    return {
      totalImpressions: acc.totalImpressions + curr.impressions,
      totalClicks: acc.totalClicks + curr.clicks,
      totalConversations: acc.totalConversations + curr.conversations,
      totalConversions: acc.totalConversions + curr.conversions,
      totalSpent: acc.totalSpent + curr.spent,
      totalRevenue: acc.totalRevenue + curr.revenue
    };
  }, {
    totalImpressions: 0,
    totalClicks: 0,
    totalConversations: 0,
    totalConversions: 0,
    totalSpent: 0,
    totalRevenue: 0
  });
};

// Get all mock data for the dashboard
export const getDashboardData = (days: number = 30) => {
  const adCampaigns = generateAdCampaigns();
  const adMetrics = generateAdMetrics(days);
  const conversations = generateConversations();
  const userSegments = generateUserSegments();
  const summaryMetrics = calculateSummaryMetrics(adMetrics);
  
  return {
    adCampaigns,
    adMetrics,
    conversations,
    userSegments,
    summaryMetrics
  };
};
