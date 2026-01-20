import { Controller } from '@application/contracts/controller';
import { UpdateGoalUseCase } from '@application/use-cases/goals/update-goal-use-case';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';
import {
  UpdateGoalSchema,
  updateGoalSchema,
} from './schemas/update-goal-schema';

@Injectable()
@Schema(updateGoalSchema)
export class UpdateGoalsController extends Controller<
  'private',
  UpdateGoalsController.Response
> {
  constructor(private readonly updateGoalUseCase: UpdateGoalUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<'private', UpdateGoalSchema>): Promise<
    Controller.Response<UpdateGoalsController.Response>
  > {
    await this.updateGoalUseCase.execute({
      accountId,
      calories: body.calorizes,
      proteins: body.proteins,
      fats: body.fats,
      carbohydrates: body.carbohydrates,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}

export namespace UpdateGoalsController {
  export type Response = null;
}
