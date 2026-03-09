# 业务示例参考

## 增删改查完整示例

### 1. 创建 API 文件

```typescript
// playground/src/api/system/role.ts
import { requestClient } from '#/request';

export interface Role {
  id: string;
  name: string;
  code: string;
  status: number;
  sort: number;
  remark?: string;
  createTime: string;
}

export async function getRoleList(params: any) {
  return requestClient.get<{ list: Role[]; total: number }>('system/role/list', { params });
}

export async function getRole(id: string) {
  return requestClient.get<Role>(`system/role/${id}`);
}

export async function createRole(data: Role) {
  return requestClient.post('system/role', data);
}

export async function updateRole(id: string, data: Role) {
  return requestClient.put(`system/role/${id}`, data);
}

export async function deleteRole(id: string) {
  return requestClient.delete(`system/role/${id}`);
}
```

### 2. 创建列表页面

```vue
<!-- playground/src/views/system/role/index.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useVbenForm } from '@vben-core/form-ui';
import { useDrawer } from '@vben-core/popup-ui';
import { Button } from '@vben-core/shadcn-ui';
import { successMessage, errorMessage } from '@vben-core/popup-ui';

import { getRoleList, deleteRole, type Role } from '@/api/system/role';
import RoleDrawer from './role-drawer.vue';

// 查询表单
const [SearchForm, searchFormApi] = useVbenForm({
  layout: 'grid',
  gridConfig: { cols: 4 },
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        placeholder: '全部',
      },
    },
  ],
  showActions: true,
});

// 弹窗
const [Drawer, drawerApi] = useDrawer({
  title: '角色',
  width: 600,
  destroyOnClose: true,
});
const drawerRef = ref<InstanceType<typeof RoleDrawer>>();

// 表格数据
const loading = ref(false);
const tableData = ref<Role[]>([]);
const total = ref(0);
const queryParams = ref({ page: 1, pageSize: 10 });

// 加载数据
async function loadData() {
  loading.value = true;
  try {
    const values = searchFormApi.getValues();
    const params = { ...queryParams.value, ...values };
    const res = await getRoleList(params);
    tableData.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
}

// 查询
function handleSearch() {
  queryParams.value.page = 1;
  loadData();
}

// 重置
function handleReset() {
  searchFormApi.resetForm();
  handleSearch();
}

// 新增
function handleAdd() {
  drawerApi.setValues({});
  drawerApi.open();
}

// 编辑
function handleEdit(row: Role) {
  drawerApi.setValues(row);
  drawerApi.open({ id: row.id });
}

// 删除
async function handleDelete(row: Role) {
  try {
    await deleteRole(row.id);
    successMessage('删除成功');
    loadData();
  } catch (e) {
    errorMessage('删除失败');
  }
}

// 表格列
const columns = [
  { type: 'seq', width: 60, title: '序号' },
  { field: 'name', title: '角色名称' },
  { field: 'code', title: '角色编码' },
  { field: 'sort', title: '排序' },
  {
    field: 'status',
    title: '状态',
    slot: 'status',
  },
  { field: 'createTime', title: '创建时间' },
  { title: '操作', width: 180, slot: 'action' },
];

// 初始加载
loadData();
</script>

<template>
  <div class="p-4">
    <!-- 查询表单 -->
    <SearchForm @search="handleSearch" @reset="handleReset" />

    <!-- 工具栏 -->
    <div class="mb-4">
      <Button type="primary" @click="handleAdd">
        <Icon icon="lucide:plus" />
        新增
      </Button>
      <Button @click="loadData">
        <Icon icon="lucide:refresh" />
        刷新
      </Button>
    </div>

    <!-- 表格 -->
    <VxeTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
      row-key="id"
    >
      <template #status="{ row }">
        <Tag :type="row.status === 1 ? 'success' : 'error'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </Tag>
      </template>
      <template #action="{ row }">
        <Button size="small" @click="handleEdit(row)">编辑</Button>
        <Button size="small" type="error" @click="handleDelete(row)">删除</Button>
      </template>
    </VxeTable>

    <!-- 分页 -->
    <Pagination
      v-model:page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      @change="loadData"
    />

    <!-- 抽屉表单 -->
    <Drawer>
      <RoleDrawer
        ref="drawerRef"
        @success="loadData"
        @close="drawerApi.close()"
      />
    </Drawer>
  </div>
</template>
```

### 3. 创建表单抽屉组件

```vue
<!-- playground/src/views/system/role/role-drawer.vue -->
<script setup lang="ts">
import { useVbenForm } from '@vben-core/form-ui';
import { Button, message } from '@vben-core/shadcn-ui';
import { createRole, updateRole } from '@/api/system/role';

const props = defineProps<{
  id?: string;
}>();

const emit = defineEmits<{
  success: [];
  close: [];
}>();

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '角色编码',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: '排序',
      componentProps: { min: 0 },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: '备注',
    },
  ],
});

async function handleSubmit() {
  const valid = await formApi.validate();
  if (!valid) return;

  const values = formApi.getValues();
  const data = { ...values };

  try {
    if (props.id) {
      await updateRole(props.id, data);
      message.success('更新成功');
    } else {
      await createRole(data);
      message.success('创建成功');
    }
    emit('success');
  } catch (e) {
    // 错误已在拦截器中处理
  }
}
</script>

<template>
  <div class="p-4">
    <Form />
    <div class="flex justify-end gap-2 mt-4">
      <Button @click="emit('close')">取消</Button>
      <Button type="primary" @click="handleSubmit">提交</Button>
    </div>
  </div>
</template>
```

## 树形表格示例

参考 `playground/src/views/system/menu/` 目录的菜单管理实现。

## 角色权限配置示例

参考 `playground/src/views/system/role/` 目录的角色管理实现。

## 用户管理示例

参考 `playground/src/views/system/user/` 目录的用户管理实现。

## 常用业务模式

### 1. 批量操作

```typescript
// 批量删除
const selectedIds = tableRef.value?.getCheckboxRecords()?.map((r) => r.id);
await deleteBatch(selectedIds);
```

### 2. 导入导出

```typescript
// 导入
import { uploadFile } from '@/api/common';

async function handleImport(file: File) {
  const res = await uploadFile(file);
  // 处理导入结果
}

// 导出
import { exportData } from '@/api/common';

async function handleExport() {
  await exportData({ format: 'excel' });
}
```

### 3. 状态切换

```typescript
async function toggleStatus(row: any) {
  const newStatus = row.status === 1 ? 0 : 1;
  await updateStatus({ id: row.id, status: newStatus });
  row.status = newStatus;
}
```

### 4. 排序

```typescript
// 上移
async function moveUp(row: any) {
  await updateSort({ id: row.id, sort: row.sort - 1 });
  loadData();
}

// 下移
async function moveDown(row: any) {
  await updateSort({ id: row.id, sort: row.sort + 1 });
  loadData();
}
```
