import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemLogApi {
  export interface SystemLog {
    address?: string;
    browser?: string;
    createTime?: number;
    description?: string;
    exceptionDetail?: string;
    logId: number;
    logType?: string;
    method?: string;
    params?: string;
    phone?: string;
    requestIp?: string;
    time?: number;
    username?: string;
  }
}

/**
 * 获取操作日志列表
 */
export async function getLogList(params: Recordable<any>) {
  return requestClient.get<{
    content?: SystemLogApi.SystemLog[];
    list?: SystemLogApi.SystemLog[];
    total?: number;
  }>('/sys-log/list', {
    params,
  });
}

/**
 * 批量删除操作日志
 */
export async function deleteLogs(ids: number[]) {
  return requestClient.post<boolean>('/sys-log/delete', { ids });
}
