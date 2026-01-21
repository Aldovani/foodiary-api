import { Meal } from '@application/entities/meal';
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository';
import { MealsFileStorageGateway } from '@infra/gateways/meals-file-storage-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class CreateMealUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) { }

  public async execute({
    accountId,
    file,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
    const inputFileKey = MealsFileStorageGateway.generateFileKey({
      accountId,
      inputType: file.inputType,
    });

    const meal = new Meal({
      accountId,
      inputType: file.inputType,
      status: Meal.Status.UPLOADING,
      inputFileKey,
    });

    const [, { uploadSignature }] = await Promise.all([
      this.mealRepository.create(meal),
      this.mealsFileStorageGateway.createPOST({
        mealId: meal.id,
        accountId,
        file: {
          inputType: file.inputType,
          key: inputFileKey,
          size: file.size,
        },
      }),
    ]);
    return {
      mealId: meal.id,
      uploadSignature,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string;
    file: {
      inputType: Meal.InputType;
      size: number;
    };
  };

  export type Output = {
    mealId: string;
    uploadSignature: string;
  };
}
