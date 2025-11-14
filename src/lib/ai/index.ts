import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// AI Provider type
export type AIProvider = 'gemini' | 'openai' | 'anthropic';

// Get the appropriate model based on provider
export function getAIModel(provider: AIProvider = 'gemini') {
  switch (provider) {
    case 'gemini':
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY is not set');
      }
      return google('gemini-2.0-flash-exp'); // Fast and cheap for food parsing

    case 'openai':
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set');
      }
      return openai('gpt-4o-mini'); // Fast and affordable

    case 'anthropic':
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set');
      }
      return anthropic('claude-3-5-haiku-20241022'); // Fast Haiku model

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// Get the first available provider
export function getFirstAvailableProvider(): AIProvider {
  if (process.env.GOOGLE_API_KEY) return 'gemini';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';

  throw new Error('No AI provider API key found. Please set GOOGLE_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY');
}

// Generate text with automatic provider fallback
export async function generateAIText(
  prompt: string,
  options: {
    provider?: AIProvider;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const {
    provider = getFirstAvailableProvider(),
    temperature = 0.3,
    maxTokens = 1000,
  } = options;

  try {
    const model = getAIModel(provider);

    const { text } = await generateText({
      model,
      prompt,
      temperature,
    });

    return text;
  } catch (error) {
    console.error(`AI generation failed with ${provider}:`, error);
    throw error;
  }
}

export { generateText };
