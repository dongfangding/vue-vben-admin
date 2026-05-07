# 弹窗组件参考

## Modal 模态框

### 基础用法

```vue
<script setup lang="ts">
import { useModal } from '@vben-core/popup-ui';

const [Modal, modalApi] = useModal({
  title: '弹窗标题',
  // 宽度
  width: 600,
  // 底部显示操作按钮
  showActions: true,
  // 确认按钮文本
  confirmText: '确定',
  // 取消按钮文本
  cancelText: '取消',
  // 点击遮罩关闭
  closeOnClickModal: false,
  // 点击取消关闭
  closeOnPressEscape: true,
});

function openModal() {
  // 传递数据
  modalApi.open({ id: 1, name: 'test' });
}

function handleConfirm() {
  // 关闭弹窗
  modalApi.close();
  // 或者携带数据关闭
  modalApi.close({ success: true });
}
</script>

<template>
  <Button @click="openModal">打开弹窗</Button>
  <Modal @confirm="handleConfirm">
    <div>弹窗内容</div>
  </Modal>
</template>
```

### 使用 slots

```vue
<script setup lang="ts">
const [Modal, modalApi] = useModal({
  title: '用户详情',
});
</script>

<template>
  <Button @click="modalApi.open()">打开</Button>
  <Modal>
    <template #header>
      <div class="custom-header">自定义头部</template>
    </template>
    <div>内容区域</div>
    <template #footer>
      <Button @click="modalApi.close()">自定义底部</Button>
    </template>
  </Modal>
</template>
```

### 表单+弹窗组合

```vue
<script setup lang="ts">
import { useModal } from '@vben-core/popup-ui';
import { useVbenForm } from '@vben-core/form-ui';

const [Modal, modalApi] = useModal({
  title: '编辑用户',
  width: 500,
});

const [Form, formApi] = useVbenForm({
  schema: [
    { component: 'Input', fieldName: 'name', label: '姓名' },
    { component: 'Input', fieldName: 'email', label: '邮箱' },
  ],
});

// 打开时加载数据
async function onOpen(values?: any) {
  if (values?.id) {
    // 编辑模式 - 加载数据
    const data = await getUserById(values.id);
    formApi.setValues(data);
  } else {
    // 新增模式 - 重置表单
    formApi.resetForm();
  }
}

modalApi.setOpenHandler(onOpen);
</script>

<template>
  <Button @click="modalApi.open()">新增</Button>
  <Button @click="modalApi.open({ id: 1 })">编辑</Button>
  <Modal @confirm="async () => { await formApi.submit(); modalApi.close(); }">
    <Form />
  </Modal>
</template>
```

## Drawer 抽屉

### 基础用法

```vue
<script setup lang="ts">
import { useDrawer } from '@vben-core/popup-ui';

const [Drawer, drawerApi] = useDrawer({
  title: '抽屉标题',
  // 宽度，可以是数字或字符串
  width: 500,
  // 或 '30%'
  // 高度（垂直抽屉）
  height: '50%',
  // 位置
  placement: 'right', // left, right, top, bottom
  // 显示关闭按钮
  showClose: true,
  // 关闭时销毁
  destroyOnClose: true,
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

### 抽屉表单

```vue
<script setup lang="ts">
import { useDrawer } from '@vben-core/popup-ui';
import { useVbenForm } from '@vben-core/form-ui';

const [Drawer, drawerApi] = useDrawer({
  title: '编辑',
  width: 500,
  showActions: true,
});

const [Form, formApi] = useVbenForm({
  schema: [
    { component: 'Input', fieldName: 'name', label: '名称' },
  ],
});

async function handleSubmit() {
  const valid = await formApi.validate();
  if (!valid) return;

  const values = formApi.getValues();
  await saveData(values);
  drawerApi.close();
}
</script>

<template>
  <Button @click="drawerApi.open()">新增</Button>
  <Drawer @confirm="handleSubmit">
    <Form />
  </Drawer>
</template>
```

## Alert 提示

```vue
<script setup lang="ts">
import { Alert } from '@vben-core/popup-ui';
</script>

<template>
  <Alert
    title="提示标题"
    description="这是提示描述内容"
    type="info" // info, success, warning, error
    closable
    show-icon
  />
</template>
```

## Message 消息提示

```typescript
import { message, successMessage, errorMessage, warningMessage, infoMessage } from '@vben-core/popup-ui';

// 成功
successMessage('操作成功');

// 错误
errorMessage('操作失败');

// 警告
warningMessage('警告信息');

// 提示
infoMessage('提示信息');

// 加载中
const hide = message.loading('处理中...');
hide();
```

## Confirm 确认对话框

```typescript
import { confirm } from '@vben-core/popup-ui';

// 确认框
await confirm({
  title: '确认删除',
  content: '确定要删除这条记录吗？',
  confirmText: '删除',
  cancelText: '取消',
});

// 带错误的确认框
await confirm({
  title: '危险操作',
  content: '此操作不可恢复！',
  type: 'error',
});
```

## Modal 与 Drawer 的区别

| 特性 | Modal | Drawer |
|------|-------|--------|
| 打开方式 | 遮罩层居中 | 从侧边滑入 |
| 适用场景 | 简短操作、查看详情 | 表单编辑、详细配置 |
| 宽度 | 较小 | 可较大 |
| 可视区域 | 固定区域 | 可利用更多空间 |
