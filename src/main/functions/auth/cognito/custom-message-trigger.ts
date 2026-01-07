import ForgotPassword from '@infra/emails/templates/forgot-password';
import { render } from '@react-email/render';
import { CustomMessageTriggerEvent } from 'aws-lambda';
export async function handler(event: CustomMessageTriggerEvent) {

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {

    const code = event.request.codeParameter;
    const html = await render(ForgotPassword({ confirmationCode: code }));

    event.response.emailSubject = '🍏 Foodiary | Recuperação de Senha';

    event.response.emailMessage = html

  }

  return event;
}
