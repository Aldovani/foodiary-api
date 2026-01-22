import { IQueueConsumer } from '@application/contracts/IQueue-consumer';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { MealsQueueGateway } from '@infra/gateways/meals-queue-gateway';

export class MealsQueueConsumer implements IQueueConsumer<MealsQueueGateway.Message> {
  constructor(private readonly mealsRepository: MealRepository) {}

  async process({
    accountId,
    mealId,
  }: MealsQueueGateway.Message): Promise<void> {
    const meal = await this.mealsRepository.findById({
      mealId,
      accountId,
    });

    if (!meal) {
      throw new ResourceNotFound('Meal not found');
    }
  }
}
