/* eslint-disable no-console */
import OpenAI, { toFile } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

import { Meal } from '@application/entities/meal';
import { MealsFileStorageGateway } from '@infra/gateways/meals-file-storage-gateway';
import { Injectable } from '@kernel/decorators/injectable';
import { ChatCompletionContentPart } from 'openai/resources';
import { downloadFileFromUrl } from 'src/utils/download-file-from-url';
import z from 'zod';
import { getImagePrompt } from '../prompts/get-image-prompt';
import { getTextPrompt } from '../prompts/get-text-prompt';

const mealResponseSchema = z.object({
  name: z.string(),
  icon: z.string(),
  foods: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      calories: z.number(),
      carbohydrates: z.number(),
      fats: z.number(),
      proteins: z.number(),
    }),
  ),
});

@Injectable()
export class MealsAIGateway {
  private readonly client = new OpenAI();

  constructor(
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) { }

  async processMeal({
    meal,
  }: MealsAIGateway.ProcessMealParams): Promise<MealsAIGateway.ProcessMealResult> {
    const mealFileUrl = this.mealsFileStorageGateway.getFileUrl(
      meal.inputFileKey,
    );

    if (meal.inputType === Meal.InputType.PICTURE) {
      await this.callAI({
        systemPrompt: getImagePrompt(),
        mealId: meal.id,
        userMessageParts: [
          {
            type: 'image_url',
            image_url: {
              url: mealFileUrl,
              detail: 'high',
            },
          },
          {
            type: 'text',
            text: `Meal date: ${meal.createdAt}`,
          },
        ],
      });
    }

    const transcription = await this.transcribe({ mealFileUrl });
    const data = await this.callAI({
      systemPrompt: getTextPrompt(),
      mealId: meal.id,
      userMessageParts: `Meal date: ${meal.createdAt} \n\n Meal:${transcription}`,
    });
    return data;
  }

  private async callAI({
    systemPrompt,
    userMessageParts,
    mealId,
  }: MealsAIGateway.callAIParams): Promise<MealsAIGateway.ProcessMealResult> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1-mini',
      response_format: zodResponseFormat(mealResponseSchema, 'meal'),
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessageParts,
        },
      ],
    });

    const json = response?.choices[0]?.message?.content;

    if (!json) {
      console.error('OpenAI response:', JSON.stringify(response, null, 2));
      throw new Error(`Failed to process meal ${mealId}`);
    }

    const { success, data, error } = mealResponseSchema.safeParse(
      JSON.parse(json),
    );

    if (!success) {
      console.log(`Zod error ${JSON.stringify(error.issues)}`);
      console.error('OpenAI response:', JSON.stringify(response, null, 2));
      throw new Error(`Failed to process meal ${mealId}`);
    }

    return data;
  }

  private async transcribe({ mealFileUrl }: MealsAIGateway.TranscribeParams) {
    const audioFile = await downloadFileFromUrl(mealFileUrl);

    const { text } = await this.client.audio.transcriptions.create({
      file: await toFile(audioFile, 'audio.m4a', {
        type: 'audio/m4a',
      }),
      model: 'gpt-4o-mini-transcribe',
    });
    return text;
  }
}

export namespace MealsAIGateway {
  export type ProcessMealParams = {
    meal: Meal;
  };

  export type ProcessMealResult = {
    name: string;
    icon: string;
    foods: Meal.Food[];
  };

  export type callAIParams = {
    systemPrompt: string;
    mealId: string;
    userMessageParts: string | ChatCompletionContentPart[];
  };

  export type TranscribeParams = {
    mealFileUrl: string;
  };
}
