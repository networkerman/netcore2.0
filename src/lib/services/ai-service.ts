import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateVariations(text: string, language: string, count: number = 3): Promise<string[]> {
    try {
      const prompt = `Generate ${count} natural variations of the following text in ${language}. Each variation should:
1. Maintain the exact same meaning and intent
2. Use different words and sentence structures
3. Sound natural and conversational
4. Be suitable for a WhatsApp message
5. Have a similar length to the original
6. Be culturally appropriate for the target language

Original text: "${text}"

Format the response as a JSON object with a "variations" array containing the variations.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at creating natural, conversational text variations while maintaining the exact same meaning. You understand WhatsApp's communication style and create variations that sound authentic and engaging."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7 // Slightly higher temperature for more creative variations
      });

      const response = JSON.parse(completion.choices[0].message.content || '{"variations": []}');
      return response.variations || [];
    } catch (error) {
      console.error('Error generating variations:', error);
      return [];
    }
  }

  async generateResponse(message: string, context: string, language: string = 'English'): Promise<string> {
    try {
      const prompt = `Generate a natural and helpful response to the following message in ${language}. The response should:
1. Be conversational and friendly
2. Address the user's message directly
3. Be concise but informative
4. Be culturally appropriate
5. Be suitable for a WhatsApp message
6. Maintain a professional yet approachable tone

Context: ${context}
Message: "${message}"

Provide only the response text, without any additional formatting or explanation.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful and friendly customer service assistant. You provide clear, concise, and culturally appropriate responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      });

      return completion.choices[0].message.content?.trim() || '';
    } catch (error) {
      console.error('Error generating response:', error);
      return '';
    }
  }

  async analyzeSentiment(message: string): Promise<'positive' | 'negative' | 'neutral'> {
    try {
      const prompt = `Analyze the sentiment of the following message and classify it as positive, negative, or neutral. Consider:
1. The overall tone and emotion
2. The choice of words
3. The context and intent
4. Any emojis or special characters

Message: "${message}"

Respond with only one word: positive, negative, or neutral.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing text sentiment. You provide clear, accurate sentiment classifications."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      });

      const sentiment = completion.choices[0].message.content?.trim().toLowerCase() || 'neutral';
      return (sentiment === 'positive' || sentiment === 'negative') ? sentiment : 'neutral';
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 'neutral';
    }
  }

  async extractKeywords(message: string): Promise<string[]> {
    try {
      const prompt = `Extract the key terms and phrases from the following message that are most relevant for understanding the user's intent or request. Consider:
1. Main topics or subjects
2. Action words or verbs
3. Important modifiers or descriptors
4. Any specific entities or names

Message: "${message}"

Format the response as a JSON object with a "keywords" array containing the extracted keywords.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at extracting key terms and phrases from text. You identify the most relevant keywords for understanding user intent."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      });

      const response = JSON.parse(completion.choices[0].message.content || '{"keywords": []}');
      return response.keywords || [];
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return [];
    }
  }
} 