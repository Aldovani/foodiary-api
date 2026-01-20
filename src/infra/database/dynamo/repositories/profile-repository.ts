import { Profile } from '@application/entities/profile';
import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
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
    const command = new PutCommand(this.getPutCommand(profile));
    await dynamoClient.send(command);
  }

  async findByAccountId(accountId: string): Promise<Profile | null> {
    const command = new GetCommand({
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Key: {
        PK: ProfileItem.getPk(accountId),
        SK: ProfileItem.getSk(accountId),
      },
    });

    const { Item: profileItem } = await dynamoClient.send(command);
    if (!profileItem) {
      return null;
    }

    return ProfileItem.toEntity(profileItem as ProfileItem.ItemType);
  }

  async save(profile: Profile): Promise<void> {
    const profileItem = ProfileItem.fromEntity(profile).toItem();

    const command = new UpdateCommand({
      TableName: this.appConfig.db.dynamoDB.mainTableName,
      Key: {
        PK: profileItem.PK,
        SK: profileItem.SK,
      },
      UpdateExpression:
        'SET #name = :name, #birthdate = :birthdate, #gender = :gender, #height = :height, #weight = :weight',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#birthdate': 'birthdate',
        '#gender': 'gender',
        '#height': 'height',
        '#weight': 'weight',
      },
      ExpressionAttributeValues: {
        ':name': profileItem.name,
        ':birthdate': profileItem.birthdate,
        ':gender': profileItem.gender,
        ':height': profileItem.height,
        ':weight': profileItem.weight,
      },
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }
}
