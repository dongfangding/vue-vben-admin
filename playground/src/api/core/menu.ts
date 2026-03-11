import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取当前登录用户可访问的菜单树
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/sys-menu/user-tree');
}
