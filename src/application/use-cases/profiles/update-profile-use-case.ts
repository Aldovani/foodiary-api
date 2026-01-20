import { Profile } from '@application/entities/profile';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { ProfileRepository } from '@infra/database/dynamo/repositories/profile-repository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) { }

  public async execute({
    accountId,
    name,
    birthdate,
    gender,
    weight,
    height,
  }: UpdateProfileUseCase.Input): Promise<UpdateProfileUseCase.Output> {
    const profile = await this.profileRepository.findByAccountId(accountId);

    if (!profile) {
      throw new ResourceNotFound('Profile not found');
    }

    profile.name = name;
    profile.birthdate = birthdate;
    profile.gender = gender;
    profile.weight = weight;
    profile.height = height;

    await this.profileRepository.save(profile);
  }
}
export namespace UpdateProfileUseCase {
  export type Input = {
    accountId: string;
    name: string;
    birthdate: Date;
    gender: Profile.Gender;
    weight: number;
    height: number;
  };
  export type Output = void;
}
