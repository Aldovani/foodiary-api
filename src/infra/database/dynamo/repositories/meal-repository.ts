import { Meal } from '@application/entities/meal';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';
import { MealItem } from '../items/meal-item';

@Injectable()
export class MealRepository {
  constructor(private readonly config: AppConfig) {}

  async getPutCommandInput(meal: Meal) {
    const mealItem = MealItem.fromEntity(meal);

    return {
      TableName: this.config.db.dynamoDB.mainTableName,
      Item: mealItem.toItem(),
    };
  }

  async findById({
    accountId,
    mealId,
  }: MealRepository.FindByIdParam): Promise<Meal | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamoDB.mainTableName,
      Key: {
        PK: MealItem.getPk({ accountId, mealId }),
        SK: MealItem.getSk({ accountId, mealId }),
      },
    });

    const { Item: mealItem } = await dynamoClient.send(command);

    if (!mealItem) {
      return null;
    }

    return MealItem.toEntity(mealItem as MealItem.ItemType);
  }

  async create(meal: Meal): Promise<void> {
    const putCommandInput = await this.getPutCommandInput(meal);

    await dynamoClient.send(new PutCommand(putCommandInput));
  }
}

export namespace MealRepository {
  export type FindByIdParam = {
    mealId: string;
    accountId: string;
  };
}
