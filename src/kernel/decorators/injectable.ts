import { Register } from '@kernel/di/register';
import { Constructor } from '@shared/types/constructor';

export function Injectable(): ClassDecorator {
  return function (target) {
    Register.getInstance().register(target as unknown as Constructor);
  };
}
