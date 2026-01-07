import { Controller } from '@application/contracts/controller';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class CreateMealController extends Controller<'private', CreateMealController.Response> {

  protected override async handle(): Promise<
    Controller.Response<CreateMealController.Response>
  > {

    return {
      statusCode: 200,
      body: {
        mealId: 'meal-id-placeholder',
      },
    };
  }
}

export namespace CreateMealController {
  export type Response = {
    mealId: string;
  };
}
