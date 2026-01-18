import { Injectable } from '@kernel/decorators/injectable';

type CompensationFn = () => Promise<void>;

@Injectable()
export class Saga {
  private compensations: CompensationFn[] = [];

  addCompensation(compensation: CompensationFn): void {
    this.compensations.unshift(compensation);
  }

  async compensate(): Promise<void> {
    for await (const compensation of this.compensations) {
      try {
        await compensation();
      } catch { }
    }
  }

  async run<TResult>(fn: () => Promise<TResult>): Promise<TResult> {
    try {
      return await fn();
    } catch (error) {
      await this.compensate();
      throw error;
    }
  }
}
