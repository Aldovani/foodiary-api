import { Meal } from '@application/entities/meal';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { MealItem } from '@infra/database/dynamo/items/meal-item';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';
@Injectable()
export class ListMealsByDayQuery {
  constructor(private readonly config: AppConfig) { }

  async execute({
    accountId,
    date,
  }: ListMealsByDayQuery.Input): Promise<ListMealsByDayQuery.Output> {
    const command = new QueryCommand({
      TableName: this.config.db.dynamoDB.mainTableName,
      IndexName: 'GSI1',
      ProjectionExpression: '#GSI1PK, #id, #name, #createdAt,  #icon, #foods',
      KeyConditionExpression: '#GSI1PK = :GSI1PK',
      FilterExpression: '#status = :status',
      ScanIndexForward: false,
      ExpressionAttributeNames: {
        '#GSI1PK': 'GSI1PK',
        '#id': 'id',
        '#name': 'name',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':GSI1PK': `${MealItem.getGSI1PK({
          accountId: accountId,
          createdAt: date,
        })} `,
        ':status': Meal.Status.SUCCESS,
      },
    });

    const { Items = [] } = await dynamoClient.send(command);

    const item = Items as MealItem.ItemType[];

    const meals: ListMealsByDayQuery.Output['meals'] = item.map((item) => ({
      id: item.id,
      GSI1PK: item.GSI1PK,
      name: item.name,
      createdAt: item.createdAt,
      icon: item.icon,
      foods: item.foods,
    }));

    return {
      meals,
    };
  }
}

export namespace ListMealsByDayQuery {
  export type Input = {
    accountId: string;
    date: Date;
  };

  export type MealItemType = {
    GSI1PK: string;
    id: string;
    name: string;
    createdAt: string;
    icon: string;
    foods: Meal.Food[];
  };

  export type Output = {
    meals: {
      id: string;
      name: string;
      createdAt: string;
      icon: string;
      foods: Meal.Food[];
    }[];
  };
}
