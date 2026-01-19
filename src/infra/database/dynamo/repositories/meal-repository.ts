import { Meal } from '@application/entities/meal';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';
import { MealItem } from '../items/meal-item';

@Injectable()
export class MealRepository {
  constructor(private readonly appConfig: AppConfig) { }

  async getPutCommandInput(meal: Meal) {
    const mealItem = MealItem.fromEntity(meal);

    return {
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Item: mealItem.toItem(),
    };
  }
  async create(meal: Meal): Promise<void> {
    const putCommandInput = await this.getPutCommandInput(meal);

    await dynamoClient.send(new PutCommand(putCommandInput));
  }
}
