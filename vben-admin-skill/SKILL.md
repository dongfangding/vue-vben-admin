---
name: vben-admin
description: Vue Vben Admin 专用技能，用于快速创建页面组件和业务功能。提供项目封装的基础组件（表单、表格、弹窗、抽屉）、API 请求封装、状态管理、Hooks 等的使用指导。适用于：(1) 创建新页面或路由 (2) 使用封装组件开发业务功能 (3) 调用后端 API (4) 管理用户状态和权限
---

# Vue Vben Admin 技能指南

本技能提供项目封装组件的使用方法和开发规范，帮助快速构建企业级后台管理系统。

## 快速开始

### 1. 创建新页面

```typescript
// 1. 在 playground/src/views/[模块]/[功能]/index.vue 创建页面组件
// 2. 在 playground/src/router/routes/modules/ 下添加路由配置
// 3. 路由文件示例：
const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:folder', title: '菜单名称', order: 1 },
    name: 'ModuleName',
    path: '/module-path',
    children: [
      {
        name: 'FeatureName',
        path: '/module-path/feature',
        component: () => import('@/views/module/feature/index.vue'),
        meta: { icon: 'lucide:file', title: '功能名称', keepAlive: true },
      },
    ],
  },
];
```

### 2. 使用表单组件

详细用法见 [表单组件参考](references/form-components.md)

```vue
<script setup lang="ts">
import { useVbenForm } from '@vben-core/form-ui';

const [Form, formApi] = useVbenForm({
  commonConfig: { componentProps: { placeholder: '请输入' } },
  schema: [
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: { options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] },
    },
  ],
});
</script>

<template>
  <Form />
</template>
```

### 3. 使用 Modal 弹窗

详细用法见 [弹窗组件参考](references/popup-components.md)

```vue
<script setup lang="ts">
import { useModal } from '@vben-core/popup-ui';

const [Modal, modalApi] = useModal({
  title: '弹窗标题',
});

function openModal() {
  modalApi.open();
}
</script>

<template>
  <Button @click="openModal">打开弹窗</Button>
  <Modal>
    <div>弹窗内容</div>
  </Modal>
</template>
```

### 4. 使用 Drawer 抽屉

```vue
<script setup lang="ts">
import { useDrawer } from '@vben-core/popup-ui';

const [Drawer, drawerApi] = useDrawer({
  title: '抽屉标题',
  width: 500,
});

function openDrawer() {
  drawerApi.open();
}
</script>

<template>
  <Button @click="openDrawer">打开抽屉</Button>
  <Drawer>
    <div>抽屉内容</div>
  </Drawer>
</template>
```

### 5. 调用 API

详细用法见 [API 请求参考](references/api-request.md)

```typescript
// 在 playground/src/api/ 下创建 API 文件
import { requestClient } from '#/request';

export async function getUserList(params: any) {
  return requestClient.get('user/list', { params });
}

export async function createUser(data: any) {
  return requestClient.post('user', data);
}

export async function updateUser(id: string, data: any) {
  return requestClient.put(`user/${id}`, data);
}

export async function deleteUser(id: string) {
  return requestClient.delete(`user/${id}`);
}

// 文件上传
export async function uploadFile(file: File) {
  return requestClient.upload('upload', { data: { file } });
}
```

### 6. 使用状态管理

详细用法见 [状态管理参考](references/stores.md)

```typescript
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();

// 获取用户信息
const userInfo = userStore.userInfo;

// 获取Token
const token = userStore.accessToken;

// 登录
await userStore.authLogin({ username: 'admin', password: '123456' });

// 登出
await userStore.logout();
```

### 7. 使用常用 Hooks

```typescript
import { usePagination } from '@vben-core/hooks';

// 分页
const { paging, page, pageSize, total, loading, refresh } = usePagination({
  defaultPage: 1,
  defaultPageSize: 10,
});
```

## 组件索引

| 分类 | 组件 | 参考文档 |
|------|------|---------|
| 表单 | VbenForm, Select, Input, DatePicker | [表单组件](references/form-components.md) |
| 弹窗 | Modal, Drawer, Alert | [弹窗组件](references/popup-components.md) |
| 布局 | VbenLayout, Header, Sidebar | [布局组件](references/layout-components.md) |
| 基础 | Button, Icon, Table, Tree | [基础组件](references/basic-components.md) |
| 业务 | 增删改查, 角色/菜单/用户管理 | [业务示例](references/business-examples.md) |

## 开发规范

1. **组件引入**: 使用 `@vben-core/` 或 `@vben/` 前缀引入封装组件
2. **API 定义**: 放在 `playground/src/api/` 目录，使用 requestClient
3. **页面组件**: 放在 `playground/src/views/` 目录，按模块组织
4. **路由配置**: 放在 `playground/src/router/routes/modules/` 目录
5. **国际化**: 使用 `$t()` 函数，翻译文件在 `playground/src/locales/`

## 项目结构

```
playground/src/
├── api/                    # API 接口定义
├── components/             # 业务组件
├── views/                 # 页面组件
│   ├── _core/             # 核心页面(登录、个人中心)
│   ├── examples/          # 示例页面
│   └── system/            # 系统管理(角色、菜单、用户)
├── router/routes/modules/ # 路由配置
├── locales/               # 国际化文件
└── store/                 # 状态管理
```
