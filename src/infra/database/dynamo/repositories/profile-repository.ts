import { Profile } from '@application/entities/profile';
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '@infra/clients/dynamo-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';
import { ProfileItem } from '../items/profile-item';

@Injectable()
export class ProfileRepository {

  constructor(private readonly appConfig: AppConfig) { }

  getPutCommand(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.fromEntity(profile);

    return {
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Item: profileItem.toItem(),
    };
  }

  async create(profile: Profile): Promise<void> {
    const profileItem = ProfileItem.fromEntity(profile);

    const command = new PutCommand({
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Item: profileItem.toItem(),
    });

    await dynamoClient.send(command);

  }

}
