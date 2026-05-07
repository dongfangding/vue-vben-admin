import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace UserProfileApi {
  export interface UserProfile {
    avatar?: string;
    email?: string;
    mobile?: string;
    nickname: string;
    sex: number;
    userId: number;
    username: string;
  }

  export interface UpdateProfileParams {
    avatar?: string;
    email?: string;
    mobile?: string;
    nickname: string;
    sex: number;
  }

  export interface ChangePasswordParams {
    newPassword: string;
    oldPassword: string;
  }
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

/**
 * 获取当前用户个人资料
 */
export async function getUserProfileApi() {
  return requestClient.get<UserProfileApi.UserProfile>('/user/profile');
}

/**
 * 修改当前用户个人资料
 */
export async function updateUserProfileApi(
  data: UserProfileApi.UpdateProfileParams,
) {
  return requestClient.post<boolean>('/user/profile', data);
}

/**
 * 修改当前用户密码
 */
export async function changeUserPasswordApi(
  data: UserProfileApi.ChangePasswordParams,
) {
  return requestClient.post<boolean>('/user/change-password', data);
}
