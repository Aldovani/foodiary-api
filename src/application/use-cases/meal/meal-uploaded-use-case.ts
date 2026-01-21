import { Meal } from '@application/entities/meal';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { MealsFileStorageGateway } from '@infra/gateways/meals-file-storage-gateway';
import { MealsQueueGateway } from '@infra/gateways/meals-queue-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class MealUploadedUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
    private readonly mealsQueueGateway: MealsQueueGateway,
  ) { }

  public async execute({
    fileKey,
  }: MealUploadedUseCase.Input): Promise<MealUploadedUseCase.Output> {
    const { mealId, accountId } =
      await this.mealsFileStorageGateway.getFileMetadata({
        fileKey,
      });

    const meal = await this.mealRepository.findById({
      accountId,
      mealId,
    });

    if (!meal) {
      throw new ResourceNotFound('Meal not found');
    }

    meal.status = Meal.Status.QUEUED;

    await this.mealRepository.save(meal);

    await this.mealsQueueGateway.publish({
      mealId: meal.id,
      accountId: meal.accountId,
    });
  }
}

export namespace MealUploadedUseCase {
  export type Input = {
    fileKey: string;
  };

  export type Output = void;
}
