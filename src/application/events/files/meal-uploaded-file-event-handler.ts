import { IFileEventHandler } from '@application/contracts/IFile-event-handler';
import { MealUploadedUseCase } from '@application/use-cases/meal/meal-uploaded-use-case';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class MealUploadedFileEventHandler implements IFileEventHandler {
  constructor(private readonly mealUploadedUseCase: MealUploadedUseCase) {}
  async handle({ fileKey }: IFileEventHandler.Input): Promise<void> {
    await this.mealUploadedUseCase.execute({
      fileKey,
    });
  }
}
