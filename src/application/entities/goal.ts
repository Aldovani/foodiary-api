
export class Goal {

  readonly accountId: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;

  readonly createdAt: Date;

  constructor(props: Goal.Atributes) {
    this.accountId = props.accountId;
    this.calories = props.calories;
    this.proteins = props.proteins;
    this.carbohydrates = props.carbohydrates;
    this.fats = props.fats;
    this.createdAt = props.createdAt ?? new Date();
  }
}

export namespace Goal {
  export type Atributes = {
    accountId: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    createdAt?: Date;
  };

}
