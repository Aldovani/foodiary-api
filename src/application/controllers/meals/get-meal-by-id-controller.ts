import { Controller } from '@application/contracts/controller';
import { Meal } from '@application/entities/meal';
import { GetMealByIdUseCase } from '@application/use-cases/meal/get-meal-by-id-use-case';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMealByIdController extends Controller<
  'private',
  GetMealByIdController.Response
> {
  constructor(private readonly getMealByIdUseCase: GetMealByIdUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    params,
  }: GetMealByIdController.Request): Promise<
    Controller.Response<GetMealByIdController.Response>
  > {
    const meal = await this.getMealByIdUseCase.execute({
      mealId: params.mealId,
      accountId,
    });

    return {
      statusCode: 200,
      body: {
        meal: {
          ...meal,
          createdAt: meal.createdAt.toISOString(),
        },
      },
    };
  }
}

export namespace GetMealByIdController {
  export type Params = {
    mealId: string;
  };

  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    Params
  >;

  export type Response = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputType;
      inputFileKey: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
      createdAt: string;
    };
  };
}
