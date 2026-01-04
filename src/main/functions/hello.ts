import "reflect-metadata";

import { HelloController } from "@application/controllers/hello-controller";
import { Register } from "@kernel/di/register";
import { lambdaHttpAdapter } from "@main/adapters/lambda-http-adapter";

const controller = Register.getInstance().resolve(HelloController);

export const handler = lambdaHttpAdapter(controller);
