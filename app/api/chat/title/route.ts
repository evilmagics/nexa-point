import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { context } = await req.json();

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: 'You are an expert summarizer. Generate a very short, concise, and catchy title (maximum 3-5 words) for a chat conversation based on the conversation context provided. Do NOT use quotation marks, punctuation at the end, or generic filler words like "Title:". Return ONLY the title itself, preferably in Title Case. If the context is just a simple greeting, infer a generic but polite title like "New Conversation".',
      prompt: `Conversation Context:\n"${context}"`,
    });

    return new Response(JSON.stringify({ title: result.text.trim() }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Title Generation Error:', error);
    return new Response(JSON.stringify({ title: 'New Chat' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
