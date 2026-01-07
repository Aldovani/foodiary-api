import { Account } from '@application/entities/account';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';
import { AccountItem } from '../items/account-item';

@Injectable()
export class AccountRepository {

  constructor(private readonly appConfig: AppConfig) { }

  async findByEmail(email: string): Promise<Account | null> {

    const command = new QueryCommand({
      IndexName: 'GSI1',
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Limit: 1,
      KeyConditionExpression: '#GSI1PK = :GSI1PK AND GSI1SK = :GSI1SK',
      ExpressionAttributeValues: {
        ':GSI1PK': AccountItem.getGSI1PK(email),
        ':GSI1SK': AccountItem.getGSI1SK(email),
      },
      ExpressionAttributeNames: {
        '#GSI1PK': 'GSI1PK',
        'GSI1SK': 'GSI1SK',

      },
    });

    const { Items = [] } = await dynamoClient.send(command);

    if (Items.length === 0) {
      return null;
    }

    const accountItem = Items[0] as AccountItem.ItemType;

    return AccountItem.toEntity(accountItem);
  }

  async create(account: Account): Promise<void> {
    const accountItem = AccountItem.fromEntity(account);

    const command = new PutCommand({
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Item: accountItem.toItem(),
    });

    await dynamoClient.send(command);

  }

}
