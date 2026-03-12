<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api';

import { useAccess } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRole, getRoleList, updateRoleEnable } from '#/api';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import MenuDrawer from './modules/menu-drawer.vue';

const { hasAccessByCodes } = useAccess();
const canCreateRole = hasAccessByCodes(['roles:add']);
const canAuthorizeRole = hasAccessByCodes(['roles:edit']);
const canEditRole = hasAccessByCodes(['roles:edit']);
const canDeleteRole = hasAccessByCodes(['roles:del']);
const canUpdateRoleStatus = hasAccessByCodes(['roles:persist']);

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [RoleMenuDrawer, roleMenuDrawerApi] = useVbenDrawer({
  connectedComponent: MenuDrawer,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(
      onActionClick,
      canUpdateRoleStatus ? onStatusChange : undefined,
      {
      authorize: canAuthorizeRole,
      delete: canDeleteRole,
      edit: canEditRole,
      },
    ),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getRoleList({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'roleId',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemRoleApi.SystemRole>,
});

function onActionClick(e: OnActionClickParams<SystemRoleApi.SystemRole>) {
  switch (e.code) {
    case 'authorize': {
      onAuthorize(e.row);
      break;
    }
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

function confirm(content: string, title: string) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('cancel'));
      },
      onOk() {
        resolve(true);
      },
      title,
    });
  });
}

async function onStatusChange(
  newStatus: boolean,
  row: SystemRoleApi.SystemRole,
) {
  const status: Recordable<string> = {
    false: '禁用',
    true: '启用',
  };
  try {
    await confirm(
      `确认将 ${row.name} 的状态切换为“${status[String(newStatus)]}”吗？`,
      '切换状态',
    );
    await updateRoleEnable(row.roleId, newStatus);
    return true;
  } catch {
    return false;
  }
}

function onEdit(row: SystemRoleApi.SystemRole) {
  if (!canEditRole) {
    return;
  }
  formDrawerApi.setData(row).open();
}

function onAuthorize(row: SystemRoleApi.SystemRole) {
  if (!canAuthorizeRole) {
    return;
  }
  roleMenuDrawerApi.setData(row).open();
}

function onDelete(row: SystemRoleApi.SystemRole) {
  if (!canDeleteRole) {
    return;
  }

  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteRole(row.roleId)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  if (!canCreateRole) {
    return;
  }
  formDrawerApi.setData({}).open();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <RoleMenuDrawer @success="onRefresh" />
    <Grid :table-title="$t('system.role.list')">
      <template #toolbar-tools>
        <Button v-if="canCreateRole" type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.role.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
