import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemJobApi {
  export interface SystemJob {
    createBy?: string;
    createTime?: number;
    enabled: boolean;
    formatCreateTime?: string;
    formatUpdateTime?: string;
    jobId?: number;
    name: string;
    sort: number;
    updateBy?: string;
    updateTime?: number;
  }
}

/**
 * 获取岗位列表
 */
export async function getJobList(params: Recordable<any>) {
  return requestClient.get<{
    content?: SystemJobApi.SystemJob[];
    list?: SystemJobApi.SystemJob[];
    total?: number;
  }>('/sys-job/query', {
    params,
  });
}

/**
 * 保存岗位
 */
export async function persistJob(data: SystemJobApi.SystemJob) {
  return requestClient.post<boolean>('/sys-job/persist', data);
}

/**
 * 删除岗位
 */
export async function deleteJob(jobId: number) {
  return requestClient.post<boolean>('/sys-job/delete', [jobId]);
}
