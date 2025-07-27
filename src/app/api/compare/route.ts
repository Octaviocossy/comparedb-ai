import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import z from 'zod';

import { TMiddleware } from '@/models';
import comparedbAiPrompt from '@/prompts/comparedb-ai.prompt.json';

export const POST: TMiddleware = async (req) => {
  try {
    const { schema_source, schema_target, model, openai_key } = await req.json();

    const openAI = createOpenAI({
      compatibility: 'strict',
      apiKey: openai_key,
    });

    const result = await generateObject({
      model: openAI(model),
      schema: z.object({ changes: z.array(z.string()), sql_script: z.string() }),
      prompt: `${comparedbAiPrompt.instructions}\n\nschema_source: ${schema_source}\nschema_target: ${schema_target}`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
