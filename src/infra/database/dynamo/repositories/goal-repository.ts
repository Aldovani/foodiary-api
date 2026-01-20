import { Goal } from '@application/entities/goal';
import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';
import { GoalItem } from '../items/goal-item';

@Injectable()
export class GoalRepository {
  constructor(private readonly appConfig: AppConfig) {}

  getPutCommand(goal: Goal): PutCommandInput {
    const goalItem = GoalItem.fromEntity(goal);

    return {
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Item: goalItem.toItem(),
    };
  }

  async create(goal: Goal): Promise<void> {
    await dynamoClient.send(new PutCommand(this.getPutCommand(goal)));
  }

  async findByAccountId(accountId: string): Promise<Goal | null> {
    const command = new GetCommand({
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Key: {
        PK: GoalItem.getPk(accountId),
        SK: GoalItem.getSk(accountId),
      },
    });

    const { Item: goalItem } = await dynamoClient.send(command);
    if (!goalItem) {
      return null;
    }

    return GoalItem.toEntity(goalItem as GoalItem.ItemType);
  }

  async save(goal: Goal): Promise<void> {
    const goalItem = GoalItem.fromEntity(goal).toItem();

    const command = new UpdateCommand({
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Key: {
        PK: goalItem.PK,
        SK: goalItem.SK,
      },
      UpdateExpression:
        'SET #calories = :calories, #carbohydrates = :carbohydrates, #fats = :fats, #proteins = :proteins',
      ExpressionAttributeNames: {
        '#calories': 'calories',
        '#carbohydrates': 'carbohydrates',
        '#fats': 'fats',
        '#proteins': 'proteins',
      },
      ExpressionAttributeValues: {
        ':calories': goalItem.calories,
        ':carbohydrates': goalItem.carbohydrates,
        ':fats': goalItem.fats,
        ':proteins': goalItem.proteins,
      },
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }
}
