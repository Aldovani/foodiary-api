import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { GoalRepository } from '@infra/database/dynamo/repositories/goal-repository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class UpdateGoalUseCase {
  constructor(private readonly goalRepository: GoalRepository) { }

  public async execute({
    accountId,
    calories,
  }: UpdateGoalUseCase.Input): Promise<UpdateGoalUseCase.Output> {
    const goal = await this.goalRepository.findByAccountId(accountId);

    if (!goal) {
      throw new ResourceNotFound('Goal not found');
    }

    goal.calories = calories;
    goal.carbohydrates = calories;
    goal.fats = calories;
    goal.proteins = calories;

    await this.goalRepository.save(goal);
  }
}
export namespace UpdateGoalUseCase {
  export type Input = {
    accountId: string;
    calories: number;
    proteins: number;
    fats: number;
    carbohydrates: number;
  };
  export type Output = void;
}
