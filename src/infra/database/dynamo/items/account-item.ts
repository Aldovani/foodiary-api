import { Account } from '@application/entities/account';

export class AccountItem {
  private readonly type = 'Account';

  private readonly keys: AccountItem.keys;

  constructor(public readonly attrs: AccountItem.Atributes) {

    this.keys = {
      PK: AccountItem.getPk(this.attrs.id),
      SK: AccountItem.getSk(this.attrs.id),
      GSI1PK: AccountItem.getGSI1PK(this.attrs.id),
      GSI1SK: AccountItem.getGSI1SK(this.attrs.createdAt),
    };

  }

  toItem(): AccountItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: this.type,
    };
  }

  static toEntity(accountItem: AccountItem.ItemType): Account {
    return new Account({
      id: accountItem.id,
      email: accountItem.email,
      externalId: accountItem.externalId,
      createdAt: new Date(accountItem.createdAt),
    });
  }

  static fromEntity(account: Account): AccountItem {
    return new AccountItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }

  static getPk(accountId: string): AccountItem.keys['PK'] {
    return `Account#${accountId}`;
  }
  static getSk(accountId: string): AccountItem.keys['SK'] {
    return `Account#${accountId}`;
  }

  static getGSI1PK(email: string): AccountItem.keys['GSI1PK'] {
    return `Account#${email}`;

  }

  static getGSI1SK(email: string): AccountItem.keys['GSI1SK'] {
    return `Account#${email}`;
  }

}

export namespace AccountItem {

  export type keys = {
    PK: `Account#${string}`;
    SK: `Account#${string}`;
    GSI1PK: `Account#${string}`;
    GSI1SK: `Account#${string}`;

  }

  export type Atributes = {
    email: string;
    id: string
    externalId: string | undefined;
    createdAt: string;
  };

  export type ItemType = keys & Atributes & {
    type: 'Account';

  };
}
