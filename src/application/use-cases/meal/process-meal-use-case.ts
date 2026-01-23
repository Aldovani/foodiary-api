import { Meal } from '@application/entities/meal';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { MealsAIGateway } from '@infra/ai/gateways/meals-ai-gateway';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { Injectable } from '@kernel/decorators/injectable';

const MAX_ATTEMPTS = 3;

@Injectable()
export class ProcessMealUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsAIGateway: MealsAIGateway,
  ) {}

  public async execute({
    accountId,
    mealId,
  }: ProcessMealUseCase.Input): Promise<void> {
    const meal = await this.mealRepository.findById({
      mealId,
      accountId,
    });

    if (!meal) {
      throw new ResourceNotFound(`Meal "${mealId}" not found`);
    }

    if (meal.status === Meal.Status.UPLOADING) {
      throw new Error(`Meal "${mealId}" is in UPLOADING status`);
    }

    if (meal.status === Meal.Status.PROCESSING) {
      throw new Error(`Meal "${mealId}" is already being processed`);
    }

    if (meal.status === Meal.Status.SUCCESS) {
      return;
    }

    try {
      meal.status = Meal.Status.PROCESSING;
      meal.attempts += 1;

      await this.mealRepository.save(meal);

      const { foods, icon, name } = await this.mealsAIGateway.processMeal({
        meal,
      });

      meal.status = Meal.Status.SUCCESS;
      meal.name = name;
      meal.icon = icon;
      meal.foods = foods;

      await this.mealRepository.save(meal);
    } catch (error) {
      meal.status =
        meal.attempts >= MAX_ATTEMPTS
          ? Meal.Status.FAILED
          : Meal.Status.PROCESSING;

      await this.mealRepository.save(meal);

      throw error;
    }
  }
}

export namespace ProcessMealUseCase {
  export type Input = {
    accountId: string;
    mealId: string;
  };
}
