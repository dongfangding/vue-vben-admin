<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDeptApi, SystemUserApi } from '#/api';

import { computed, onMounted, ref, watch } from 'vue';

import { useAccess } from '@vben/access';
import { Page, Tree, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Card, message, Modal, Spin } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteUser,
  getDeptList,
  getUserList,
  resetUserPassword,
  updateUserEnable,
} from '#/api';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const { hasAccessByCodes } = useAccess();
const canCreateUser = hasAccessByCodes(['user:add']);
const canEditUser = hasAccessByCodes(['user:edit']);
const canDeleteUser = hasAccessByCodes(['user:del']);
const canResetPassword = hasAccessByCodes(['user:reset-password']);
const canUpdateUserStatus = hasAccessByCodes(['user:edit']);

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const deptLoading = ref(false);
const deptTree = ref<SystemDeptApi.SystemDept[]>([]);
const selectedDeptId = ref<number>();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(
      onActionClick,
      canUpdateUserStatus ? onStatusChange : undefined,
      {
        delete: canDeleteUser,
        edit: canEditUser,
        resetPassword: canResetPassword,
      },
    ),
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getUserList({
            ...formValues,
            deptId: selectedDeptId.value,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'userId',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemUserApi.SystemUser>,
});

const currentDeptName = computed(() => {
  const deptId = selectedDeptId.value;
  if (deptId === undefined) {
    return '';
  }

  const queue = [...deptTree.value];
  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) {
      continue;
    }
    if (node.deptId === deptId) {
      return node.name;
    }
    if (node.children?.length) {
      queue.push(...node.children);
    }
  }
  return '';
});

const tableTitle = computed(() => {
  const deptName = currentDeptName.value;
  return deptName
    ? `${deptName} / ${$t('system.user.list')}`
    : $t('system.user.list');
});

watch(selectedDeptId, () => {
  gridApi.reload();
});

onMounted(async () => {
  await loadDeptTree();
});

async function loadDeptTree() {
  deptLoading.value = true;
  try {
    deptTree.value = await getDeptList();
  } finally {
    deptLoading.value = false;
  }
}

function onActionClick(e: OnActionClickParams<SystemUserApi.SystemUser>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'reset-password': {
      onResetPassword(e.row);
      break;
    }
  }
}

function onCreate() {
  if (!canCreateUser) {
    return;
  }
  formDrawerApi.setData({}).open();
}

function onEdit(row: SystemUserApi.SystemUser) {
  if (!canEditUser) {
    return;
  }
  formDrawerApi.setData(row).open();
}

function onDelete(row: SystemUserApi.SystemUser) {
  if (!canDeleteUser) {
    return;
  }

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.username]),
    duration: 0,
    key: 'action_process_msg',
  });

  deleteUser(row.userId)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.username]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

async function onStatusChange(
  newStatus: boolean,
  row: SystemUserApi.SystemUser,
) {
  const statusText = newStatus ? $t('common.enabled') : $t('common.disabled');
  try {
    await updateUserEnable(row.userId, newStatus);
    message.success(
      `${row.username} ${$t('system.user.status')} ${statusText}`,
    );
    return true;
  } catch {
    return false;
  }
}

function onResetPassword(row: SystemUserApi.SystemUser) {
  if (!canResetPassword) {
    return;
  }

  Modal.confirm({
    content: `确认重置用户 ${row.username} 的密码吗？`,
    okText: '确认',
    cancelText: '取消',
    title: '重置密码',
    async onOk() {
      const hideLoading = message.loading({
        content: `正在重置 ${row.username} 的密码...`,
        duration: 0,
        key: 'action_process_msg',
      });

      try {
        await resetUserPassword(row.userId);
        message.success({
          content: `${row.username} 密码已重置`,
          key: 'action_process_msg',
        });
      } catch {
        hideLoading();
      }
    },
  });
}

function onRefresh() {
  gridApi.reload();
}

function onResetDeptFilter() {
  selectedDeptId.value = undefined;
}
</script>

<template>
  <Page
    auto-content-height
    content-class="flex min-h-0 flex-col gap-4 overflow-hidden"
  >
    <FormDrawer @success="onRefresh" />
    <div
      class="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)] items-stretch gap-4 overflow-hidden"
    >
      <Card
        :bordered="false"
        :body-style="{ padding: '12px' }"
        class="h-full min-h-0"
        size="small"
        :title="$t('system.user.dept')"
      >
        <template #extra>
          <Button type="link" @click="onResetDeptFilter">
            {{ $t('system.user.allDept') }}
          </Button>
        </template>
        <Spin :spinning="deptLoading">
          <div class="max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            <Tree
              v-model="selectedDeptId"
              allow-clear
              bordered
              :default-expanded-level="1"
              :tree-data="deptTree"
              children-field="children"
              label-field="name"
              value-field="deptId"
            />
          </div>
        </Spin>
      </Card>
      <div class="min-h-0 min-w-0 overflow-hidden">
        <Grid class="h-full min-h-0" :table-title="tableTitle">
          <template #toolbar-tools>
            <Button v-if="canCreateUser" type="primary" @click="onCreate">
              <Plus class="size-5" />
              {{ $t('ui.actionTitle.create', [$t('system.user.name')]) }}
            </Button>
          </template>
        </Grid>
      </div>
    </div>
  </Page>
</template>
