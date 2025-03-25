import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY
    });
  }

  async generateVariations(text: string, language: string, count: number = 3): Promise<string[]> {
    try {
      const prompt = `Generate ${count} variations of the following text in ${language}. Each variation should convey the same meaning but use different wording. Format the response as a JSON array of strings:\n\n"${text}"`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates text variations while maintaining the original meaning."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{"variations": []}');
      return response.variations || [];
    } catch (error) {
      console.error('Error generating variations:', error);
      return [];
    }
  }
} 