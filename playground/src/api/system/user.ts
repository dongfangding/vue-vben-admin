import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface SystemUser {
    [key: string]: any;
    avatar?: string;
    createBy?: string;
    createTime?: number | string;
    deptIds?: number[];
    email?: string;
    enabled?: boolean;
    mobile?: string;
    nickname: string;
    password?: string;
    pwdResetTime?: number;
    roleIds?: number[];
    sex?: number;
    updateBy?: string;
    updateTime?: number | string;
    userId: number;
    username: string;
  }
}

/**
 * 获取用户列表
 */
async function getUserList(params: Recordable<any>) {
  const response = await requestClient.get<
    | {
        content?: SystemUserApi.SystemUser[];
        list?: SystemUserApi.SystemUser[];
        total?: number;
      }
    | SystemUserApi.SystemUser[]
  >('sys-user/list', {
    params,
  });

  if (Array.isArray(response)) {
    return {
      content: response,
      total: response.length,
    };
  }

  return {
    content: response?.content ?? response?.list ?? [],
    total: response?.total ?? 0,
  };
}

/**
 * 创建用户
 */
async function createUser(data: SystemUserApi.SystemUser) {
  return requestClient.post('sys-user/persist', data);
}

/**
 * 更新用户
 */
async function updateUser(userId: number, data: SystemUserApi.SystemUser) {
  return requestClient.post('sys-user/persist', { ...data, userId });
}

async function resetUserPassword(userId: number) {
  return requestClient.post('sys-user/reset-password', { id: userId, userId });
}

/**
 * 删除用户
 */
async function deleteUser(userId: number) {
  return requestClient.post('sys-user/delete', { id: userId, userId });
}

/**
 * 更新状态
 */
async function updateUserEnable(userId: number, enabled: boolean) {
  return requestClient.post('sys-user/enable', { enabled, id: userId, userId });
}

export {
  createUser,
  deleteUser,
  getUserList,
  resetUserPassword,
  updateUser,
  updateUserEnable,
};
