import { Account } from '@application/entities/account';
import { Goal } from '@application/entities/goal';
import { Profile } from '@application/entities/profile';
import { EmailAlreadyInUse } from '@application/errors/application/email-already-in-use';
import { AccountRepository } from '@infra/database/dynamo/repositories/account-repository';
import { SignUpUnitOfWork } from '@infra/database/dynamo/uow/sign-up-unit-of-work';
import { AuthGateway } from '@infra/gateways/auth-gateway';
import { Injectable } from '@kernel/decorators/injectable';
import { Saga } from '@shared/saga/saga';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly signUpUnitOfWork: SignUpUnitOfWork,
    private readonly saga: Saga,
  ) { }

  public async execute({
    account: { email, password },
    profile: profileInfo,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    return this.saga.run<SignUpUseCase.Output>(async () => {
      const emailAlreadyExists =
        await this.accountRepository.findByEmail(email);

      if (emailAlreadyExists) {
        throw new EmailAlreadyInUse();
      }

      const account = new Account({ email });
      const profile = new Profile({
        ...profileInfo,
        accountId: account.id,
      });

      const goal = new Goal({
        accountId: account.id,
        calories: 2000,
        proteins: 150,
        carbohydrates: 250,
        fats: 70,
      });

      await this.signUpUnitOfWork.run({
        account,
        profile,
        goal,
      });

      const { externalId } = await this.authGateway.signUp({
        email,
        password,
        internalId: account.id,
      });
      this.saga.addCompensation(() =>
        this.authGateway.deleteUser({ externalId }),
      );

      account.externalId = externalId;

      await this.accountRepository.create(account);

      const { accessToken, refreshToken } = await this.authGateway.signIn({
        email,
        password,
      });

      return {
        accessToken,
        refreshToken,
      };
    });
  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      email: string;
      password: string;
    };
    profile: {
      name: string;
      birthdate: Date;
      gender: Profile.Gender;
      weight: number;
      height: number;
      activityLevel: Profile.ActivityLevel;
    };
  };
  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
