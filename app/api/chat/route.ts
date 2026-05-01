import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { PERSONAS, PersonaId } from '@/lib/personas';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export const maxDuration = 30;

class RateLimiter {
  private requests = new Map<string, number[]>();

  async checkLimit(identifier: string, maxRequests: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }
}

const limiter = new RateLimiter();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const allowed = await limiter.checkLimit(ip, 20, 60000); // Max 20 requests per minute

    if (!allowed) {
      return new Response('Rate limit exceeded. Please wait a moment before sending more messages.', { 
        status: 429,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const { messages, personaId } = await req.json();
    const persona = PERSONAS[personaId as PersonaId] || PERSONAS['travel'];

    // Convert UIMessages (v6 style with parts) to CoreMessages (streamText style with content)
    const coreMessages = messages.map((m: any) => {
      // If content already exists, use it. Otherwise, extract text from parts.
      let content = m.content;
      if (!content && m.parts) {
        content = m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');
      }
      
      return {
        role: m.role,
        content: content || ''
      };
    });

    // Limit context to the last 15 messages for efficiency
    const MAX_HISTORY = 15;
    let limitedMessages = coreMessages.slice(-MAX_HISTORY);
    
    // Gemini/Google requires the first message in the conversation (after system) to be 'user'
    while (limitedMessages.length > 0 && limitedMessages[0].role !== 'user') {
      limitedMessages.shift();
    }

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: persona.systemPrompt,
      messages: limitedMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    // Check if it's a quota limit error from Google AI
    const errorMessage = error?.message || '';
    if (error?.status === 429 || errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('rate limit')) {
      return new Response('Quota limit reached or rate limited by Google API. Please try again later.', { 
        status: 429,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    return new Response('Internal server error. Please try again.', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
