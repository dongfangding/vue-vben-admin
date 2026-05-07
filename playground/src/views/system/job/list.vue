<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemJobApi } from '#/api';

import { useAccess } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteJob, getJobList } from '#/api';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const { hasAccessByCodes } = useAccess();
const canCreateJob = hasAccessByCodes(['job:add']);
const canEditJob = hasAccessByCodes(['job:add']);
const canDeleteJob = hasAccessByCodes(['job:del']);

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick, {
      delete: canDeleteJob,
      edit: canEditJob,
    }),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getJobList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'jobId',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemJobApi.SystemJob>,
});

function onActionClick({
  code,
  row,
}: OnActionClickParams<SystemJobApi.SystemJob>) {
  switch (code) {
    case 'edit': {
      if (!canEditJob) {
        return;
      }
      formDrawerApi.setData(row).open();
      break;
    }
    case 'delete': {
      onDelete(row);
      break;
    }
  }
}

function onCreate() {
  if (!canCreateJob) {
    return;
  }
  formDrawerApi.setData({}).open();
}

function onRefresh() {
  gridApi.query();
}

async function onDelete(row: SystemJobApi.SystemJob) {
  if (!canDeleteJob) {
    return;
  }

  const hideLoading = message.loading({
    content: `正在删除岗位 ${row.name}...`,
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteJob(row.jobId!);
    message.success({
      content: `岗位 ${row.name} 已删除`,
      key: 'action_process_msg',
    });
    onRefresh();
  } catch {
    hideLoading();
  }
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="岗位列表">
      <template #toolbar-tools>
        <Button v-if="canCreateJob" type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增岗位
        </Button>
      </template>
    </Grid>
  </Page>
</template>
