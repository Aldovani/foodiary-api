import { Meal } from '@application/entities/meal';

export class MealItem {
  static readonly type = 'Meal';

  private readonly keys: MealItem.keys;

  constructor(public readonly attrs: MealItem.Atributes) {
    this.keys = {
      PK: MealItem.getPk({
        accountId: this.attrs.accountId,
        mealId: this.attrs.id,
      }),
      SK: MealItem.getSk({
        accountId: this.attrs.accountId,
        mealId: this.attrs.id,
      }),
      GSI1PK: MealItem.getGSI1PK({
        accountId: this.attrs.accountId,
        createdAt: new Date(this.attrs.createdAt),
      }),
      GSI1SK: MealItem.getGSI1SK(this.attrs.accountId),
    };
  }

  toItem(): MealItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: MealItem.type,
    };
  }

  static toEntity(MealItem: MealItem.ItemType): Meal {
    return new Meal({
      id: MealItem.id,
      accountId: MealItem.accountId,
      status: MealItem.status,
      attempts: MealItem.attempts,
      inputType: MealItem.inputType,
      inputFileKey: MealItem.inputFileKey,
      name: MealItem.name,
      icon: MealItem.icon,
      foods: MealItem.foods,
      createdAt: new Date(MealItem.createdAt),
    });
  }

  static fromEntity(Meal: Meal): MealItem {
    return new MealItem({
      ...Meal,
      createdAt: Meal.createdAt.toISOString(),
    });
  }

  static getPk({ accountId, mealId }: MealItem.PKParams): MealItem.keys['PK'] {
    return `Account#${accountId}#Meal#${mealId}`;
  }
  static getSk({ accountId, mealId }: MealItem.SKParams): MealItem.keys['SK'] {
    return `Account#${accountId}#Meal#${mealId}`;
  }

  static getGSI1PK({
    accountId,
    createdAt,
  }: MealItem.GSI1PKParams): MealItem.keys['GSI1PK'] {
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDate()).padStart(2, '0');

    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }

  static getGSI1SK(accountId: string): MealItem.keys['GSI1SK'] {
    return `Meal#${accountId}`;
  }
}

export namespace MealItem {
  export type keys = {
    PK: `Account#${string}#Meal#${string}`;
    SK: `Account#${string}#Meal#${string}`;
    GSI1PK: `MEALS#${string}#${string}-${string}-${string}`;
    GSI1SK: `Meal#${string}`;
  };

  export type Atributes = {
    accountId: string;
    id: string;
    status: Meal.Status;
    attempts: number;
    inputType: Meal.InputType;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    createdAt: string;
  };

  export type ItemType = keys &
    Atributes & {
      type: 'Meal';
    };

  export type GSI1PKParams = {
    accountId: string;
    createdAt: Date;
  };

  export type PKParams = {
    mealId: string;
    accountId: string;
  };
  export type SKParams = {
    mealId: string;
    accountId: string;
  };
}
