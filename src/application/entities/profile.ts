
export class Profile {

  readonly accountId: string;
  name: string;
  birthdate: Date;
  gender: Profile.Gender;
  height: number;
  weight: number;
  readonly goal: Profile.Goal;
  readonly activityLevel: Profile.ActivityLevel;
  readonly createdAt: Date;

  constructor(props: Profile.Atributes) {
    this.accountId = props.accountId;
    this.name = props.name;
    this.birthdate = props.birthdate;
    this.gender = props.gender;
    this.height = props.height;
    this.weight = props.weight;
    this.goal = props.goal;
    this.activityLevel = props.activityLevel;
    this.createdAt = props.createdAt ?? new Date();
  }
}

export namespace Profile {
  export type Atributes = {
    accountId: string;
    name: string;
    birthdate: Date;
    gender: Gender
    height: number;
    weight: number;
    goal: Goal;
    activityLevel: ActivityLevel;
    createdAt?: Date;
  };

  export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
  }

  export enum Goal{
    LOSE= 'LOSE',
    MAINTAIN= 'MAINTAIN',
    GAIN= 'GAIN',
  }

  export enum ActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHT = 'LIGHT',
    MODERATE = 'MODERATE',
    HEAVY = 'HEAVY',
    ATHLETE = 'ATHLETE',
  }
}
