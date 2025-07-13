import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

import { TMiddleware } from '@/models';
import prompt from '@/prompts/comparedb-ai.prompt.json';

export const POST: TMiddleware = async (req) => {
  const { schema_source, schema_target } = await req.json();

  const result = await generateText({
    model: openai(process.env.OPENAI_MODEL),
    prompt: `
    ${prompt.instructions}
    schema_source: ${schema_source}
    schema_target: ${schema_target}
    `,
  });

  return NextResponse.json(result.text);
};
