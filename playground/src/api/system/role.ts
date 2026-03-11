import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    [key: string]: any;
    createBy?: string;
    createTime: number;
    description?: string;
    enabled: boolean;
    formatCreateTime: string;
    formatUpdateTime: string;
    ipLimit?: string;
    isAdmin: boolean;
    level: number;
    menuIds: (number | string)[];
    name: string;
    roleId: number;
    sort: number;
    updateBy?: string;
    updateTime: number;
  }
}

/**
 * 获取角色列表数据
 */
async function getRoleList(params: Recordable<any>) {
  return requestClient.get<Array<SystemRoleApi.SystemRole>>('sys-role/list', {
    params,
  });
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: Omit<SystemRoleApi.SystemRole, 'roleId'>) {
  return requestClient.post('sys-role/persist', data);
}

/**
 * 更新角色
 *
 * @param roleId 角色 ID
 * @param data 角色数据
 */
async function updateRole(
  roleId: number,
  data: Omit<SystemRoleApi.SystemRole, 'roleId'>,
) {
  return requestClient.post('sys-role/persist', { ...data, roleId });
}

/**
 * 单独更新角色授权
 * @param roleId 角色 ID
 * @param menuIds 菜单 ID 集合
 */
async function updateRoleMenu(roleId: number, menuIds: Array<number | string>) {
  return requestClient.post('sys-role/update-role-menu', {
    roleId,
    menuIds,
  });
}

/**
 * 更新状态
 * @param roleId 角色 ID
 */
async function updateRoleEnable(roleId: number, enabled: boolean) {
  return requestClient.post('sys-role/enable', { id: roleId, enabled });
}

/**
 * 删除角色
 * @param roleId 角色 ID
 */
async function deleteRole(roleId: number) {
  return requestClient.post('sys-role/delete', { id: roleId });
}

export {
  createRole,
  deleteRole,
  getRoleList,
  updateRole,
  updateRoleEnable,
  updateRoleMenu,
};
