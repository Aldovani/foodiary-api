import { Goal } from '@application/entities/goal';
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';
import { GoalItem } from '../items/goal-item';

@Injectable()
export class GoalRepository {

  constructor(private readonly appConfig: AppConfig) { }

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

}
