import { IQueueConsumer } from '@application/contracts/IQueue-consumer';
import { ProcessMealUseCase } from '@application/use-cases/meal/process-meal-use-case';
import { MealsQueueGateway } from '@infra/gateways/meals-queue-gateway';

export class MealsQueueConsumer implements IQueueConsumer<MealsQueueGateway.Message> {
  constructor(private readonly processMealUseCase: ProcessMealUseCase) { }

  async process({
    accountId,
    mealId,
  }: MealsQueueGateway.Message): Promise<void> {
    await this.processMealUseCase.execute({ accountId, mealId });
  }
}
