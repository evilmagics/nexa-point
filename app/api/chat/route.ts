import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { PERSONAS, PersonaId } from '@/lib/personas';

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
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { messages, personaId } = await req.json();
    const persona = PERSONAS[personaId as PersonaId] || PERSONAS['travel'];

    // Convert UIMessages (parts) to CoreMessages (content) for compatibility with streamText
    const coreMessages = messages.map((m: any) => {
      const content = m.content || (m.parts && m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('')) || '';
      
      return {
        role: m.role,
        content
      };
    });

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: persona.systemPrompt,
      messages: coreMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
