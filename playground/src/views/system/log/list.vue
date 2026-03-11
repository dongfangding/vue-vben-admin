<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemLogApi } from '#/api';

import { Page } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteLogs, getLogList } from '#/api';

import { useColumns, useGridFormSchema } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    checkboxConfig: {
      highlight: true,
    },
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getLogList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'logId',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemLogApi.SystemLog>,
});

function onRefresh() {
  gridApi.query();
}

async function onBatchDelete() {
  const rows = (gridApi.grid?.getCheckboxRecords?.() ?? []) as SystemLogApi.SystemLog[];
  const ids = rows.map((item) => item.logId).filter(Boolean);
  if (ids.length === 0) {
    message.warning('请先选择要删除的日志');
    return;
  }

  const hideLoading = message.loading({
    content: `正在删除 ${ids.length} 条日志...`,
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteLogs(ids);
    message.success({
      content: '日志删除成功',
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
    <Grid table-title="操作日志">
      <template #toolbar-tools>
        <Button danger @click="onBatchDelete">
          批量删除
        </Button>
      </template>
    </Grid>
  </Page>
</template>
