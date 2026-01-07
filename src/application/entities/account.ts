import KSUID from 'ksuid';

export class Account {
  readonly id: string;
  readonly email: string;
  externalId: string | undefined;
  readonly createdAt: Date;

  constructor(props: Account.Atributes) {
    this.id = props.id ?? KSUID.randomSync().string;
    this.email = props.email;
    this.externalId = props.externalId;
    this.createdAt = props.createdAt ?? new Date();
  }
}

export namespace Account {
  export type Atributes = {
    email: string;
    externalId?: string | undefined;
    id?: string;
    createdAt?: Date;
  };
}
