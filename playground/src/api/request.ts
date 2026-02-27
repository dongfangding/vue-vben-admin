/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { AxiosResponseHeaders, RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';
import { cloneDeep } from '@vben/utils';

import { message } from 'ant-design-vue';
import JSONBigInt from 'json-bigint';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

// 判断是否使用 Mock 数据
const isMock = import.meta.env.VITE_NITRO_MOCK === 'true';
function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
    transformResponse: (data: any, header: AxiosResponseHeaders) => {
      // storeAsString指示将BigInt存储为字符串，设为false则会存储为内置的BigInt类型
      if (
        header.getContentType()?.toString().includes('application/json') &&
        typeof data === 'string'
      ) {
        return cloneDeep(
          JSONBigInt({ storeAsString: true, strict: true }).parse(data),
        );
      }
      return data;
    },
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // 处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: '0',
    }),
  );

  // token过期的处理（仅在后端模式启用）
  if (!isMock) {
    client.addResponseInterceptor(
      authenticateResponseInterceptor({
        client,
        doReAuthenticate,
        doRefreshToken,
        enableRefreshToken: preferences.app.enableRefreshToken,
        formatToken,
      }),
    );
  }

  // 通用的错误处理
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.message ?? responseData?.msg ?? '';
      const errorCode = responseData?.code ?? '';

      const isUnauthorized =
        errorCode === 401 ||
        errorCode === '401' ||
        errorCode === 'UNAUTHORIZED' ||
        errorMessage.includes('未通过认证') ||
        errorMessage.includes('未认证') ||
        error?.response?.status === 401;

      if (isUnauthorized) {
        const authStore = useAuthStore();
        authStore.logout(true);
        return;
      }

      // 非成功响应（code != 200/0）时弹框提示
      if (errorMessage) {
        message.error(errorMessage);
      } else {
        message.error(msg);
      }
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });

export interface PageFetchParams {
  [key: string]: any;
  pageNo?: number;
  pageSize?: number;
}
