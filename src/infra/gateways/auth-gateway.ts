import { InvalidCredentials } from '@application/errors/application/invalid-credentials';
import { InvalidRefreshToken } from '@application/errors/application/invalid-refresh-token';
import { AdminDeleteUserCommand, ConfirmForgotPasswordCommand, ForgotPasswordCommand, GetTokensFromRefreshTokenCommand, InitiateAuthCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@infra/clients/cognito-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';
import { createHmac } from 'node:crypto';

@Injectable()
export class AuthGateway {

  constructor(private readonly appConfig: AppConfig) { }

  async signUp({
    email,
    password,
    internalId,
  }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const command = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      Username: email,
      Password: password,
      SecretHash: this.getSecretHash(email),
      UserAttributes: [
        { Name: 'q', Value: internalId },
      ],
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if (!externalId) {
      throw new Error(`Cannot sign up user: ${email}`);
    }

    return {
      externalId,
    };
  }

  async signIn({
    email,
    password,
  }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    try {
      const command = new InitiateAuthCommand({
        ClientId: this.appConfig.auth.cognito.client.id,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: this.getSecretHash(email),
        },
        AuthFlow: 'USER_PASSWORD_AUTH',
      });

      const { AuthenticationResult } = await cognitoClient.send(command);

      if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
        throw new Error(`Cannot authenticate user: ${email}`);
      }

      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken,
      };

    }
    catch {
      throw new InvalidCredentials();
    }
  }

  async refreshToken({ refreshToken }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
    try {

      const command = new GetTokensFromRefreshTokenCommand({
        ClientId: this.appConfig.auth.cognito.client.id,
        RefreshToken: refreshToken,
        ClientSecret: this.appConfig.auth.cognito.client.secret,
      });

      const { AuthenticationResult } = await cognitoClient.send(command);

      if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
        throw new Error('Cannot refresh token');
      }

      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken,
      };
    }
    catch {
      throw new InvalidRefreshToken();
    }

  }

  async forgotPassword({ email }: AuthGateway.ForgotPasswordParams): Promise<void> {

    const command = new ForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      Username: email,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  async confirmForgotPassword({ email, confirmationCode, password }: AuthGateway.ConfirmForgotPasswordParams): Promise<void> {

    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      ConfirmationCode: confirmationCode,
      Password: password,
      Username: email,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  async deleteUser({ externalId }: AuthGateway.DeleteUserParams): Promise<void> {

    const command = new AdminDeleteUserCommand({
      UserPoolId: this.appConfig.auth.cognito.pool.id,
      Username: externalId,
    });

    await cognitoClient.send(command);
  }

  private getSecretHash(email: string): string {

    const { id, secret } = this.appConfig.auth.cognito.client;
    return createHmac('SHA256', secret!)
      .update(email + id)
      .digest('base64');
  }
}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
    internalId: string;
  };

  export type SignUpResult = {
    externalId: string;
  };

  export type SignInParams = {
    email: string;
    password: string;
  };

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type RefreshTokenParams = {
    refreshToken: string;
  }

  export type DeleteUserParams = {
    externalId: string;
  }

  export type RefreshTokenResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type ForgotPasswordParams = {
    email: string;
  };

  export type ConfirmForgotPasswordParams = {
    email: string;
    confirmationCode: string;
    password: string;
  };

}
