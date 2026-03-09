# API 请求参考

## requestClient 基础用法

项目使用 `requestClient` 封装了 Axios，提供统一的请求/响应处理。

### 引入方式

```typescript
import { requestClient } from '#/request';
```

### GET 请求

```typescript
// 基础 GET
const result = await requestClient.get('/user/list');

// 带参数
const result = await requestClient.get('/user/list', {
  params: { page: 1, pageSize: 10 },
});

// 带配置
const result = await requestClient.get('/user/1', {
  timeout: 5000,
  headers: { 'X-Custom': 'value' },
});
```

### POST 请求

```typescript
// 基础 POST
const result = await requestClient.post('/user', {
  name: '张三',
  email: 'zhangsan@example.com',
});

// JSON 请求（默认）
await requestClient.post('/api/user', data, {
  headers: { 'Content-Type': 'application/json' },
});
```

### PUT 请求

```typescript
const result = await requestClient.put('/user/1', {
  name: '李四',
});
```

### DELETE 请求

```typescript
const result = await requestClient.delete('/user/1');

// 带参数
await requestClient.delete('/user/batch', {
  params: { ids: [1, 2, 3] },
  data: { ids: [1, 2, 3] }, // DELETE 请求带 body
});
```

### PATCH 请求

```typescript
const result = await requestClient.patch('/user/1/status', {
  status: 1,
});
```

## 文件上传

```typescript
// 单文件上传
async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return requestClient.upload('upload/file', {
    data: formData,
  });
}

// 多文件上传
async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return requestClient.upload('upload/multiple', {
    data: formData,
  });
}

// 带进度
async function uploadWithProgress(file: File) {
  return requestClient.upload('upload/file', {
    data: { file },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`上传进度: ${percent}%`);
    },
  });
}
```

## 文件下载

```typescript
// 下载文件
async function downloadFile(id: string) {
  await requestClient.download(`file/download/${id}`, {
    fileName: 'document.pdf',
  });
}

// 下载带进度
async function downloadWithProgress(id: string) {
  await requestClient.download(`file/download/${id}`, {
    onDownloadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`下载进度: ${percent}%`);
    },
  });
}
```

## API 定义规范

### 创建 API 文件

在 `playground/src/api/` 下按模块创建 API 文件：

```typescript
// playground/src/api/system/user.ts

import { requestClient } from '#/request';

// 定义接口类型
export interface User {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: number;
  createTime: string;
}

export interface UserQuery {
  page?: number;
  pageSize?: number;
  username?: string;
  status?: number;
}

// 获取用户列表
export async function getUserList(params?: UserQuery) {
  return requestClient.get<{ list: User[]; total: number }>('system/user/list', {
    params,
  });
}

// 获取用户详情
export async function getUser(id: string) {
  return requestClient.get<User>(`system/user/${id}`);
}

// 创建用户
export async function createUser(data: Omit<User, 'id' | 'createTime'>) {
  return requestClient.post('system/user', data);
}

// 更新用户
export async function updateUser(id: string, data: Partial<User>) {
  return requestClient.put(`system/user/${id}`, data);
}

// 删除用户
export async function deleteUser(id: string) {
  return requestClient.delete(`system/user/${id}`);
}

// 批量删除
export async function deleteUserBatch(ids: string[]) {
  return requestClient.delete('system/user/batch', {
    data: { ids },
  });
}

// 重置密码
export async function resetPassword(id: string) {
  return requestClient.post(`system/user/${id}/reset-password`);
}

// 修改状态
export async function updateUserStatus(id: string, status: number) {
  return requestClient.patch(`system/user/${id}/status`, { status });
}
```

## 响应类型定义

```typescript
// 基础响应
interface Response<T = any> {
  code: number;
  data: T;
  message: string;
}

// 分页响应
interface PageResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

## 错误处理

### 全局错误处理

项目已在 `preset-interceptors.ts` 中配置了全局错误处理：
- 401 自动刷新 token
- 业务错误显示提示
- 网络错误显示提示

### 手动错误处理

```typescript
try {
  const result = await requestClient.get('/api/data');
  // 成功处理
} catch (error: any) {
  if (error.code === 403) {
    // 处理权限不足
  } else if (error.code === 404) {
    // 处理资源不存在
  } else {
    // 处理其他错误
  }
}
```

## SSE 推送

```typescript
// 服务器推送
const eventSource = await requestClient.postSSE('/api/stream', {
  data: { query: 'test' },
  onmessage: (data) => {
    console.log('收到消息:', data);
  },
  onerror: () => {
    console.log('连接错误');
  },
});
```

## 使用示例：增删改查

```typescript
// user-api.ts
import { requestClient } from '#/request';

export interface User {
  id: string;
  name: string;
  status: number;
}

// 列表查询
export async function fetchUserList(params: any) {
  return requestClient.get<{ list: User[]; total: number }>('/user/list', { params });
}

// 新增
export async function addUser(data: User) {
  return requestClient.post('/user', data);
}

// 编辑
export async function editUser(id: string, data: User) {
  return requestClient.put(`/user/${id}`, data);
}

// 删除
export async function removeUser(id: string) {
  return requestClient.delete(`/user/${id}`);
}

// 使用
const { data, loading } = useRequest(() => fetchUserList({ page: 1 }));
await addUser({ name: '新用户', status: 1 });
await editUser('1', { name: '修改', status: 1 });
await removeUser('1');
```
