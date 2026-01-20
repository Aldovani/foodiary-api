import { Controller } from '@application/contracts/controller';
import { UpdateProfileUseCase } from '@application/use-cases/profiles/update-profile-use-case';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';
import {
  UpdateProfileSchema,
  updateProfileSchema,
} from './schemas/update-profile-schema';

@Injectable()
@Schema(updateProfileSchema)
export class UpdateProfilesController extends Controller<
  'private',
  UpdateProfilesController.Response
> {
  constructor(private readonly updateProfilesUseCase: UpdateProfileUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<'private', UpdateProfileSchema>): Promise<
    Controller.Response<UpdateProfilesController.Response>
  > {

    await this.updateProfilesUseCase.execute({
      accountId,
      name: body.name,
      birthdate: body.birthDate,
      gender: body.gender,
      height: body.height,
      weight: body.weight,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}

export namespace UpdateProfilesController {
  export type Response = null;
}
