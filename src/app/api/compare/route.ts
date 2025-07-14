import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { generateText } from 'ai';

import { TMiddleware } from '@/models';
import comparedbAiPrompt from '@/prompts/comparedb-ai.prompt.json';

// TODO: handle error when API key or schema is invalid

export const POST: TMiddleware = async (req) => {
  try {
    const { schema_source, schema_target, model, openai_key } = await req.json();

    const openAI = createOpenAI({
      compatibility: 'strict',
      apiKey: openai_key,
    });

    const result = await generateText({
      model: openAI(model),
      prompt: `
      ${comparedbAiPrompt.instructions}
      schema_source: ${schema_source}
      schema_target: ${schema_target}
    `,
    });

    return NextResponse.json(result.text);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
