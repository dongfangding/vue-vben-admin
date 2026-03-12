import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemDictApi {
  export interface SystemDict {
    createBy?: string;
    createTime?: number | string;
    description?: string;
    /** 字典代码 */
    dictCode?: string;
    dictId?: number;
    name: string;
    updateBy?: string;
    updateTime?: number | string;
  }

  export interface SystemDictDetail {
    createBy?: string;
    createTime?: number | string;
    /** 字典明细编码 */
    detailCode?: string;
    detailId?: number;
    /** 字典代码 */
    dictCode?: string;
    dictId: number;
    dictSort: number;
    label: string;
    updateBy?: string;
    updateTime?: number | string;
    value: string;
  }
}

/**
 * 获取字典列表
 */
export async function getDictList(params: Recordable<any>) {
  return requestClient.get<{
    content?: SystemDictApi.SystemDict[];
    list?: SystemDictApi.SystemDict[];
    total?: number;
  }>('/sys-dict/list', {
    params,
  });
}

/**
 * 保存字典
 */
export async function persistDict(data: SystemDictApi.SystemDict) {
  return requestClient.post<boolean>('/sys-dict/persist', data);
}

/**
 * 删除字典
 */
export async function deleteDict(dictId: number) {
  return requestClient.post<boolean>('/sys-dict/delete', { id: dictId });
}

/**
 * 获取字典明细列表
 */
export async function getDictDetailList(params: Recordable<any>) {
  return requestClient.get<{
    content?: SystemDictApi.SystemDictDetail[];
    list?: SystemDictApi.SystemDictDetail[];
    total?: number;
  }>('/sys-dict-detail/list', {
    params,
  });
}

/**
 * 保存字典明细
 */
export async function persistDictDetail(data: SystemDictApi.SystemDictDetail) {
  return requestClient.post<boolean>('/sys-dict-detail/persist', data);
}

/**
 * 删除字典明细
 */
export async function deleteDictDetail(detailId: number) {
  return requestClient.post<boolean>('/sys-dict-detail/delete', {
    id: detailId,
  });
}
