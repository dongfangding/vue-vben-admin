# 基础组件参考

## Button 按钮

```vue
<script setup lang="ts">
import { Button } from '@vben-core/shadcn-ui';
</script>

<template>
  <!-- 主要按钮 -->
  <Button type="primary">主要</Button>

  <!-- 次要按钮 -->
  <Button>默认</Button>

  <!-- 危险按钮 -->
  <Button danger>危险</Button>

  <!-- 文字按钮 -->
  <Button variant="ghost">文字</Button>

  <!-- 图标按钮 -->
  <Button>
    <Icon icon="lucide:plus" />
    <span>新增</span>
  </Button>

  <!-- 加载状态 -->
  <Button :loading="true">加载中</Button>

  <!-- 禁用 -->
  <Button :disabled="true">禁用</Button>

  <!-- 按钮组 -->
  <ButtonGroup>
    <Button>左</Button>
    <Button>中</Button>
    <Button>右</Button>
  </ButtonGroup>
</template>
```

### Button 属性

| 属性 | 说明 | 类型 |
|------|------|------|
| type | 按钮类型 | primary, default, danger |
| variant | 变体 | solid, outline, ghost |
| size | 尺寸 | small, middle, large |
| loading | 加载状态 | boolean |
| disabled | 禁用 | boolean |

## Icon 图标

项目使用 Iconify 图标集，通过 `Icon` 组件使用：

```vue
<script setup lang="ts">
import { Icon } from '@vben-core/shadcn-ui';
</script>

<template>
  <!-- 基本用法 -->
  <Icon icon="lucide:home" />

  <!-- 带颜色 -->
  <Icon icon="lucide:home" color="red" />

  <!-- 带尺寸 -->
  <Icon icon="lucide:home" :size="24" />

  <!-- 旋转 -->
  <Icon icon="lucide:home" :rotate="90" />

  <!-- 动画 spin -->
  <Icon icon="lucide:loader" :size="20" class="animate-spin" />
</template>
```

### 常用图标

```vue
<!-- 菜单图标 -->
<Icon icon="lucide:layout-dashboard" />   <!-- 仪表盘 -->
<Icon icon="lucide:folder" />             <!-- 文件夹 -->
<Icon icon="lucide:file" />               <!-- 文件 -->
<Icon icon="lucide:settings" />           <!-- 设置 -->
<Icon icon="lucide:user" />               <!-- 用户 -->
<Icon icon="lucide:users" />              <!-- 用户组 -->
<Icon icon="lucide:lock" />               <!-- 锁 -->
<Icon icon="lucide:key" />                <!-- 密钥 -->

<!-- 操作图标 -->
<Icon icon="lucide:plus" />                <!-- 新增 -->
<Icon icon="lucide:edit" />               <!-- 编辑 -->
<Icon icon="lucide:trash" />              <!-- 删除 -->
<Icon icon="lucide:search" />             <!-- 搜索 -->
<Icon icon="lucide:eye" />                <!-- 查看 -->
<Icon icon="lucide:download" />           <!-- 下载 -->
<Icon icon="lucide:upload" />             <!-- 上传 -->
<Icon icon="lucide:refresh" />            <!-- 刷新 -->
<Icon icon="lucide:save" />               <!-- 保存 -->
<Icon icon="lucide:close" />              <!-- 关闭 -->
<Icon icon="lucide:check" />              <!-- 确认 -->
<Icon icon="lucide:more-vertical" />      <!-- 更多 -->

<!-- 状态图标 -->
<Icon icon="lucide:check-circle" />       <!-- 成功 -->
<Icon icon="lucide:alert-circle" />       <!-- 错误 -->
<Icon icon="lucide:alert-triangle" />     <!-- 警告 -->
<Icon icon="lucide:info" />               <!-- 信息 -->
```

## Table 表格

项目使用 VXE Table，详细用法见示例页面 `playground/src/views/examples/vxe-table/`

```vue
<script setup lang="ts">
import { VxeTable } from '@vben-core/ui-kit';

// 定义列
const columns = [
  { type: 'seq', width: 60, title: '序号' },
  { type: 'checkbox', width: 60 },
  { field: 'name', title: '名称' },
  { field: 'status', title: '状态', slots: { default: 'status-default' } },
  { field: 'createTime', title: '创建时间' },
  { title: '操作', width: 200, slots: { default: 'action-default' } },
];

const tableData = ref([
  { id: 1, name: '测试', status: 1, createTime: '2024-01-01' },
]);
</script>

<template>
  <VxeTable :data="tableData" :columns="columns">
    <template #status-default="{ row }">
      <Tag :type="row.status === 1 ? 'success' : 'error'">
        {{ row.status === 1 ? '启用' : '禁用' }}
      </Tag>
    </template>
    <template #action-default="{ row }">
      <Button size="small" @click="handleEdit(row)">编辑</Button>
      <Button size="small" type="error" @click="handleDelete(row)">删除</Button>
    </template>
  </VxeTable>
</template>
```

## Input 输入框

```vue
<script setup lang="ts">
import { Input } from '@vben-core/shadcn-ui';
</script>

<template>
  <Input v-model="value" placeholder="请输入" />

  <!-- 带前缀图标 -->
  <Input v-model="value">
    <template #prefix>
      <Icon icon="lucide:search" />
    </template>
  </Input>

  <!-- 带后缀 -->
  <Input v-model="value">
    <template #suffix>
      <Icon icon="lucide:x" />
    </template>
  </Input>

  <!-- 密码输入 -->
  <InputPassword v-model="password" />
</template>
```

## Select 选择器

```vue
<script setup lang="ts">
import { Select } from '@vben-core/shadcn-ui';

const options = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
];
</script>

<template>
  <Select v-model="value" :options="options" placeholder="请选择" />

  <!-- 多选 -->
  <Select v-model="values" :options="options" multiple />

  <!-- 可搜索 -->
  <Select v-model="value" :options="options" filterable />
</template>
```

## Tag 标签

```vue
<script setup lang="ts">
import { Tag } from '@vben-core/shadcn-ui';
</script>

<template>
  <Tag>默认</Tag>
  <Tag type="primary">主要</Tag>
  <Tag type="success">成功</Tag>
  <Tag type="warning">警告</Tag>
  <Tag type="error">错误</Tag>
  <Tag :closable="true">可关闭</Tag>
</template>
```

## Dropdown 下拉菜单

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuItem } from '@vben-core/shadcn-ui';
</script>

<template>
  <DropdownMenu>
    <DropdownMenuItem key="edit">
      <Icon icon="lucide:edit" />
      编辑
    </DropdownMenuItem>
    <DropdownMenuItem key="delete" danger>
      <Icon icon="lucide:trash" />
      删除
    </DropdownMenuItem>
  </DropdownMenu>
</template>
```

## Tooltip 提示

```vue
<script setup lang="ts">
import { Tooltip } from '@vben-core/shadcn-ui';
</script>

<template>
  <Tooltip content="提示内容">
    <Button>鼠标悬停</Button>
  </Tooltip>
</template>
```

## Scrollbar 滚动条

```vue
<script setup lang="ts">
import { Scrollbar } from '@vben-core/shadcn-ui';
</script>

<template>
  <Scrollbar height="400px">
    <div class="content">长内容...</div>
  </Scrollbar>
</template>
```

## Spinner 加载

```vue
<script setup lang="ts">
import { Spinner } from '@vben-core/shadcn-ui';
</script>

<template>
  <Spinner />
  <Spinner size="large" />
  <Spinner color="primary" />
</template>
```
