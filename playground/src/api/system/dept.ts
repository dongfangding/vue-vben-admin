import { requestClient } from '#/api/request';

export namespace SystemDeptApi {
  export interface SystemDept {
    [key: string]: any;
    children?: SystemDept[];
    createBy: string;
    createTime: number;
    deptId: number;
    description?: string;
    enabled: boolean;
    name: string;
    pid: number;
    sort: number;
    subCount: number;
  }
}

/**
 * 获取部门列表数据
 */
async function getDeptList() {
  return requestClient.get<Array<SystemDeptApi.SystemDept>>('/sys-dept/list');
}

/**
 * 创建部门
 * @param data 部门数据
 */
async function createDept(
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'deptId'>,
) {
  return requestClient.post('/sys-dept/persist', data);
}

/**
 * 更新部门
 *
 * @param id 部门 ID
 * @param data 部门数据
 */
async function updateDept(
  deptId: number,
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'deptId'>,
) {
  data.deptId = deptId;
  return requestClient.post('/sys-dept/persist', data);
}

/**
 * 删除部门
 * @param deptId 部门 ID
 */
async function deleteDept(deptId: number) {
  return requestClient.post(`/sys-dept/delete`, { ids: [deptId] });
}

export { createDept, deleteDept, getDeptList, updateDept };
