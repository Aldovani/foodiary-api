import { Meal } from '@application/entities/meal';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class CreateMealUseCase {
  constructor(private readonly mealRepository: MealRepository) { }

  public async execute({
    accountId,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
    const meal = new Meal({
      accountId,
      inputType: Meal.InputType.PICTURE,
      inputFileKey: 'INPUT_FILE_KEY_PLACEHOLDER',
      status: Meal.Status.UPLOADING,
    });

    await this.mealRepository.create(meal);

    return {
      mealId: meal.id,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string;
    file: {
      type: Meal.InputType;
      size: number;
    };
  };

  export type Output = {
    mealId: string;
  };
}
