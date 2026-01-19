import { Controller } from '@application/contracts/controller';
import { Meal } from '@application/entities/meal';
import { ListMealsByDayQuery } from '@application/query/list-meals-by-day-query';
import { Injectable } from '@kernel/decorators/injectable';
import { CreateMealSchema } from './schemas/create-meal-schema';
import { ListMealByDateSchema } from './schemas/list-meals-by-date-schema';

@Injectable()
export class ListMealsByDayController extends Controller<
  'private',
  ListMealsByDayController.Response
> {
  constructor(private readonly listMealsByDayQuery: ListMealsByDayQuery) {
    super();
  }

  protected override async handle({
    accountId,
    queryParams,
  }: Controller.Request<'private', CreateMealSchema>): Promise<
    Controller.Response<ListMealsByDayController.Response>
  > {
    const { date } = ListMealByDateSchema.parse(queryParams);

    const { meals } = await this.listMealsByDayQuery.execute({
      accountId,
      date,
    });

    return {
      statusCode: 200,
      body: {
        meals,
      },
    };
  }
}

export namespace ListMealsByDayController {
  export type Response = {
    meals: {
      id: string;
      name: string;
      createdAt: string;
      icon: string;
      foods: Meal.Food[];
    }[];
  };
}
