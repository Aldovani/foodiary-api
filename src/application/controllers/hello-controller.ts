import { Controller } from "@application/contracts/controller";
import { HelloUseCase } from "@application/use-cases/hello-use-case";
import { Injectable } from "@kernel/decorators/injectable";
import { Schema } from "@kernel/decorators/schema";
import { HelloSchema, helloSchema } from "./schemas/hello-schema";

@Injectable()
@Schema(helloSchema)
export class HelloController extends Controller<unknown> {
  constructor(private readonly helloUseCase: HelloUseCase) {
    super();
  }

  protected override async handle(
    request: Controller.Request<HelloSchema>
  ): Promise<Controller.Response<unknown>> {
    const output = await this.helloUseCase.execute({ name: request.body.name });

    return {
      statusCode: 200,
      body: {
        parsedBody: request.body,
      },
    };
  }
}
