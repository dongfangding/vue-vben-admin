import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  export interface LoginParams {
    captchaVerification?: string;
    code?: string;
    password?: string;
    username?: string;
    uuid?: string;
  }

  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

export interface CaptchaResult {
  height: number;
  originalImageBase64: string;
  prefix: string;
  uuid: string;
  width: number;
  wordList: string[];
}

export interface CaptchaCheckResult {
  captchaVerification: string;
  uuid: string;
}

export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data, {
    withCredentials: false,
  });
}

export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/auth/refresh',
    null,
    {
      withCredentials: false,
    },
  );
}

export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', null, {
    withCredentials: false,
  });
}

export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}

export async function generateCaptchaApi() {
  return requestClient.get<CaptchaResult>('/common/captcha/generate');
}

export async function checkCaptchaApi(data: {
  captchaType: string;
  captchaVerification: string;
  uuid: string;
  verification: boolean;
  verifyCode: string;
}) {
  return requestClient.post<CaptchaCheckResult>('/common/captcha/check', data);
}
