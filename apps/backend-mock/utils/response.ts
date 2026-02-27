import type { EventHandlerRequest, H3Event } from 'h3';

import { setResponseStatus } from 'h3';

export function useResponseSuccess<T = any>(data: T) {
  return {
    code: '0',
    data,
    error: null,
    message: '操作成功',
    subMessage: '',
    timestamp: Date.now(),
    extra: {},
    formatParams: [],
  };
}

export function usePageResponseSuccess<T = any>(
  page: number | string,
  pageSize: number | string,
  list: T[],
  { message = '操作成功' } = {},
) {
  const pageNum = Number.parseInt(`${page}`);
  const pageSizeNum = Number.parseInt(`${pageSize}`);
  const total = list.length;
  const totalPage = Math.ceil(total / pageSizeNum);
  const pageData = pagination(pageNum, pageSizeNum, list);

  return {
    code: '0',
    data: {
      pageNum,
      pageSize: pageSizeNum,
      totalPage,
      total,
      content: pageData,
    },
    error: null,
    message,
    subMessage: '',
    timestamp: Date.now(),
    extra: {},
    formatParams: [],
  };
}

export function useResponseError(message: string, error: any = null) {
  return {
    code: '-1',
    data: null,
    error,
    message,
    subMessage: '',
    timestamp: Date.now(),
    extra: {},
    formatParams: [],
  };
}

export function forbiddenResponse(
  event: H3Event<EventHandlerRequest>,
  message = 'Forbidden Exception',
) {
  setResponseStatus(event, 403);
  return useResponseError(message, message);
}

export function unAuthorizedResponse(event: H3Event<EventHandlerRequest>) {
  setResponseStatus(event, 401);
  return {
    code: '401',
    data: null,
    error: 'Unauthorized Exception',
    message: '未授权',
    subMessage: 'Unauthorized Exception',
    timestamp: Date.now(),
    extra: {},
    formatParams: [],
  };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function pagination<T = any>(
  pageNo: number,
  pageSize: number,
  array: T[],
): T[] {
  const offset = (pageNo - 1) * Number(pageSize);
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset)
    : array.slice(offset, offset + Number(pageSize));
}
