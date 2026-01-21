import KSUID from 'ksuid';

export class Meal {
  readonly id: string;
  readonly accountId: string;

  status: Meal.Status;
  attempts: number;
  name: string;
  icon: string;
  foods: Meal.Food[];

  readonly inputType: Meal.InputType;

  readonly inputFileKey: string;

  readonly createdAt: Date;

  constructor(props: Meal.Attributes) {
    this.id = props.id ?? KSUID.randomSync().string;
    this.accountId = props.accountId;
    this.status = props.status;
    this.attempts = props.attempts ?? 0;
    this.inputType = props.inputType;
    this.inputFileKey = props.inputFileKey;
    this.name = props.name ?? '';
    this.icon = props.icon ?? '';
    this.foods = props.foods ?? [];
    this.createdAt = props.createdAt ?? new Date();
  }
}

export namespace Meal {
  export type Attributes = {
    id?: string;
    attempts?: number;
    name?: string;
    icon?: string;
    foods?: Meal.Food[];
    createdAt?: Date;
    accountId: string;
    status: Meal.Status;
    inputType: Meal.InputType;
    inputFileKey: string;
  };

  export enum Status {
    UPLOADING = 'UPLOADING',
    QUEUED = 'QUEUED',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }
  export enum InputType {
    AUDIO = 'AUDIO',
    PICTURE = 'PICTURE',
  }

  export type Food = {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };
}
