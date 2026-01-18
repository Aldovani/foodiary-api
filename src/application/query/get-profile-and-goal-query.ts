import { Profile } from '@application/entities/profile';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { AccountItem } from '@infra/database/dynamo/items/account-item';
import { GoalItem } from '@infra/database/dynamo/items/goal-item';
import { ProfileItem } from '@infra/database/dynamo/items/profile-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class GetProfileAndGoalQuery {
  constructor(private readonly config: AppConfig) { }

  async execute(
    input: GetProfileAndGoalQuery.Input,
  ): Promise<GetProfileAndGoalQuery.Output> {
    const command = new QueryCommand({
      TableName: this.config.db.dynamoDB.mainTableName,
      Limit: 2,
      ProjectionExpression:
        '#PK, #SK, #name, #birthdate, #gender, #height, #weight, #calories, #proteins, #carbohydrates, #fats, #type',
      KeyConditionExpression: '#PK = :PK AND begins_with(#SK, :SK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
        '#name': 'name',
        '#birthdate': 'birthdate',
        '#gender': 'gender',
        '#height': 'height',
        '#weight': 'weight',
        '#calories': 'calories',
        '#proteins': 'proteins',
        '#carbohydrates': 'carbohydrates',
        '#fats': 'fats',
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':PK': AccountItem.getPk(input.accountId),
        ':SK': `${AccountItem.getPk(input.accountId)}#`,
      },
    });

    const { Items = [] } = await dynamoClient.send(command);

    const profile = Items.find(
      (item): item is GetProfileAndGoalQuery.ProfileItemType =>
        item.type === ProfileItem.type,
    );
    const goal = Items.find(
      (item): item is GetProfileAndGoalQuery.GoalItemType =>
        item.type === GoalItem.type,
    );

    if (!profile || !goal) {
      throw new ResourceNotFound('Profile or Goal not found');
    }

    return {
      goal: {
        calories: goal.calories,
        proteins: goal.proteins,
        carbohydrates: goal.carbohydrates,
        fats: goal.fats,
      },
      profile: {
        name: profile.name,
        birthdate: profile.birthdate,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
      },
    };
  }
}

export namespace GetProfileAndGoalQuery {
  export type Input = {
    accountId: string;
  };

  export type ProfileItemType = {
    name: string;
    birthdate: string;
    gender: Profile.Gender;
    height: number;
    weight: number;
  };

  export type GoalItemType = {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };

  export type Output = {
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
