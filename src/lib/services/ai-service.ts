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
} 