import { Meal } from '@application/entities/meal';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMealByIdUseCase {
  constructor(private readonly mealRepository: MealRepository) { }

  public async execute({
    accountId,
    mealId,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
    const meal = await this.mealRepository.findById({
      mealId,
      accountId,
    });

    if(!meal) {
      throw new ResourceNotFound('Meal not found');
    }

    return {
      createdAt: meal.createdAt,
      icon: meal.icon,
      id: meal.id,
      inputFileKey: meal.inputFileKey,
      inputType: meal.inputType,
      name: meal.name,
      foods: meal.foods,
      status: meal.status,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string;
    mealId: string;
  };

  export type Output = {
    id: string;
    status: Meal.Status;
    inputType: Meal.InputType;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    createdAt: Date;
  };
}
