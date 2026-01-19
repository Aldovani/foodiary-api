import { Controller } from '@application/contracts/controller';
import { Meal } from '@application/entities/meal';
import { CreateMealUseCase } from '@application/use-cases/meal/create-meal-use-case';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';
import { CreateMealSchema } from './schemas/create-meal-schema';

@Injectable()
@Schema(CreateMealSchema)
export class CreateMealController extends Controller<
  'private',
  CreateMealController.Response
> {
  constructor(private readonly createMealUseCase: CreateMealUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<'private', CreateMealSchema>): Promise<
    Controller.Response<CreateMealController.Response>
  > {
    const { file } = body;

    const inputType =
      file.type === 'audio/mpeg'
        ? Meal.InputType.AUDIO
        : Meal.InputType.PICTURE;

    const { mealId, uploadSignature } = await this.createMealUseCase.execute({
      accountId,
      file: {
        size: file.size,
        inputType: inputType,
      },
    });

    return {
      statusCode: 200,
      body: {
        mealId,
        uploadSignature,
      },
    };
  }
}

export namespace CreateMealController {
  export type Response = {
    mealId: string;
    uploadSignature: string;
  };
}
