import { Account } from '@application/entities/account';
import { Goal } from '@application/entities/goal';
import { Profile } from '@application/entities/profile';
import { Injectable } from '@kernel/decorators/injectable';
import { AccountRepository } from '../repositories/account-repository';
import { GoalRepository } from '../repositories/goal-repository';
import { ProfileRepository } from '../repositories/profile-repository';
import { UnitOfWork } from './unit-of-work';

@Injectable()
export class SignUpUnitOfWork extends UnitOfWork {

  constructor(private readonly goalRepository: GoalRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly accountRepository: AccountRepository,
  ) {
    super();
  }

  async run({ account, goal, profile }: SignUpUnitOfWork.RunProps) {
    this.addPut(this.accountRepository.getPutCommand(account));
    this.addPut(this.goalRepository.getPutCommand(goal));
    this.addPut(this.profileRepository.getPutCommand(profile));
    await this.commit();
  }
}

export namespace SignUpUnitOfWork {
  export type RunProps = {
    account: Account
    goal: Goal,
    profile: Profile
  }
}
