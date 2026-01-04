import { getSchema } from "@kernel/decorators/schema";

export abstract class Controller<TBody = undefined> {
  protected abstract handle(
    request: Controller.Request
  ): Promise<Controller.Response<TBody>>;

  public async execute(
    request: Controller.Request
  ): Promise<Controller.Response<TBody>> {
    const body = this.validateBody(request.body);

    return this.handle({ ...request, body });
  }

  private validateBody(body: Controller.Request["body"]) {
    const schema = getSchema(this);

    if (!schema) return body;

    return schema.parse(body);
  }
}

export namespace Controller {
  export type Request<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQuery = Record<string, unknown>
  > = {
    body: TBody;
    query: TQuery;
    params: TParams;
  };

  export type Response<TBody = undefined> = {
    body?: TBody;
    statusCode: number;
  };
}
