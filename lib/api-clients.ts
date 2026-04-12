import { ApiProvider, SolvedQuestion } from '@/types';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const ResponseSchema = z.object({
  questions: z.array(
    z.object({
      questionNumber: z.number().describe("Sequential question number"),
      problemStatement: z.string().describe("The exact verbatim prompt, question, or problem statement provided by the user, without any summarization or changes"),
      code: z.string().describe("The primary answer, pure code implementation, or pure essay text without comments or AI markdown"),
      output: z.string().optional().describe("Expected output (if coding) or supplementary text"),
      explanation: z.string().optional().describe("Any explanation, reasoning, code comments, or AI generated context should go ONLY here"),
    })
  )
});

export async function solveProblem(
  provider: ApiProvider,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
) {
  let model;

  if (provider === 'gemini') {
    const google = createGoogleGenerativeAI({ apiKey });
    model = google('gemini-2.5-flash');
  } else if (provider === 'groq') {
    const groq = createOpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });
    model = groq('llama-3.1-70b-versatile');
  } else if (provider === 'together') {
    const together = createOpenAI({ apiKey, baseURL: 'https://api.together.xyz/v1' });
    model = together('meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo');
  } else {
    throw new Error('Unknown provider');
  }

  try {
    const { object } = await generateObject({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      schema: ResponseSchema,
      temperature: 0.2,
    });
    return object;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Generation failed: ${error.message}`);
    }
    throw error;
  }
}

