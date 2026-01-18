import { Controller } from '@application/contracts/controller';
import { Profile } from '@application/entities/profile';
import { GetProfileAndGoalQuery } from '@application/query/get-profile-and-goal-query';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMeController extends Controller<
  'private',
  GetMeController.Response
> {
  constructor(private readonly getProfileAndGoalQuery: GetProfileAndGoalQuery) {
    super();
  }

  protected override async handle({
    accountId,
  }: Controller.Request<'private'>): Promise<
    Controller.Response<GetMeController.Response>
  > {
    const profileAndGoal = await this.getProfileAndGoalQuery.execute({
      accountId,
    });

    return {
      statusCode: 200,
      body: {
        ...profileAndGoal,
      },
    };
  }
}

export namespace GetMeController {
  export type Response = {
    profile: {
      name: string;
      birthdate: string;
      gender: Profile.Gender;
      height: number;
      weight: number;
    };
    goal: {
      calories: number;
      proteins: number;
      carbohydrates: number;
      fats: number;
    };
  };
}
