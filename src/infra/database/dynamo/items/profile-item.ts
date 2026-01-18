import { Profile } from '@application/entities/profile';
import { AccountItem } from './account-item';

export class ProfileItem {
  private readonly type = 'Profile';

  private readonly keys: ProfileItem.keys;

  constructor(public readonly attrs: ProfileItem.Atributes) {

    this.keys = {
      PK: ProfileItem.getPk(this.attrs.accountId),
      SK: ProfileItem.getSk(this.attrs.accountId),
    };

  }

  toItem(): ProfileItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: this.type,
    };
  }

  static toEntity(profileItem: ProfileItem.ItemType): Profile {
    return new Profile({
      accountId: profileItem.accountId,
      activityLevel: profileItem.activityLevel,
      birthdate: new Date(profileItem.birthdate),
      gender: profileItem.gender,
      height: profileItem.height,
      name: profileItem.name,
      weight: profileItem.weight,
      createdAt: new Date(profileItem.createdAt),
    });
  }

  static fromEntity(profile: Profile): ProfileItem {
    return new ProfileItem({
      ...profile,
      birthdate: profile.birthdate.toISOString(),
      createdAt: profile.createdAt?.toISOString(),
    });
  }

  static getPk(accountId: string): ProfileItem.keys['PK'] {
    return `Account#${accountId}`;
  }
  static getSk(accountId: string): ProfileItem.keys['SK'] {
    return `Account#${accountId}#PROFILE`;
  }

}

export namespace ProfileItem {

  export type keys = {
    PK: AccountItem.ItemType['PK'];
    SK: `Account#${string}#PROFILE`;

  }

  export type Atributes = {
    accountId: string;
    name: string;
    birthdate: string;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activityLevel: Profile.ActivityLevel;
    createdAt: string;
  };

  export type ItemType = keys & Atributes & {
    type: 'Profile';

  };
}
