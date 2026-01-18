import { Goal } from '@application/entities/goal';
import { AccountItem } from './account-item';
import {  } from './profile-item';

export class GoalItem {
  static readonly type = 'Goal';

  private readonly keys: GoalItem.keys;

  constructor(public readonly attrs: GoalItem.Atributes) {
    this.keys = {
      PK: GoalItem.getPk(this.attrs.accountId),
      SK: GoalItem.getSk(this.attrs.accountId),
    };

  }

  toItem(): GoalItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: GoalItem.type,
    };
  }

  static toEntity(goalItem: GoalItem.ItemType): Goal {
    return new Goal({
      accountId: goalItem.accountId,
      calories: goalItem.calories,
      proteins: goalItem.proteins,
      carbohydrates: goalItem.carbohydrates,
      fats: goalItem.fats,
      createdAt: new Date(goalItem.createdAt),
    });
  }

  static fromEntity(goal: Goal): GoalItem {
    return new GoalItem({
      ...goal,
      createdAt: goal.createdAt?.toISOString(),
    });
  }

  static getPk(accountId: string): GoalItem.keys['PK'] {
    return `Account#${accountId}`;
  }
  static getSk(accountId: string): GoalItem.keys['SK'] {
    return `Account#${accountId}#GOAL`;
  }

}

export namespace GoalItem {
  export type keys = {
    PK: AccountItem.ItemType['PK'];
    SK: `Account#${string}#GOAL`;

  }

  export type Atributes = {
    accountId: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    createdAt: string;
  };

  export type ItemType = keys & Atributes & {
    type: 'Goal';

  };
}
