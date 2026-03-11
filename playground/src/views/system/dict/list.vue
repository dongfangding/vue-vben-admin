<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { computed, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Card, Empty, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDict,
  deleteDictDetail,
  getDictDetailList,
  getDictList,
} from '#/api';

import {
  useDictColumns,
  useDictDetailColumns,
  useDictDetailGridFormSchema,
  useDictGridFormSchema,
} from './data';
import DictDetailForm from './modules/dict-detail-form.vue';
import DictForm from './modules/dict-form.vue';

const currentDict = ref<null | SystemDictApi.SystemDict>(null);

const [DictFormDrawer, dictFormDrawerApi] = useVbenDrawer({
  connectedComponent: DictForm,
  destroyOnClose: true,
});

const [DictDetailFormDrawer, dictDetailFormDrawerApi] = useVbenDrawer({
  connectedComponent: DictDetailForm,
  destroyOnClose: true,
});

const [DictGrid, dictGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useDictGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useDictColumns(onDictActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDictList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'dictId',
      isCurrent: true,
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemDictApi.SystemDict>,
});

const [DetailGrid, detailGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useDictDetailGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useDictDetailColumns(onDetailActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          if (!currentDict.value?.dictId) {
            return {
              content: [],
              total: 0,
            };
          }

          return await getDictDetailList({
            ...formValues,
            dictId: currentDict.value.dictId,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'detailId',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemDictApi.SystemDictDetail>,
});

const detailTitle = computed(() =>
  currentDict.value?.name
    ? `${currentDict.value.name} / 字典明细`
    : '字典明细',
);

function onCreateDict() {
  dictFormDrawerApi.setData({}).open();
}

function onCreateDetail() {
  if (!currentDict.value?.dictId) {
    message.warning('请先选择左侧字典');
    return;
  }

  dictDetailFormDrawerApi
    .setData({
      dictId: currentDict.value.dictId,
      dictSort: 0,
    })
    .open();
}

function onRefreshDict() {
  dictGridApi.query();
}

function onRefreshDetail() {
  detailGridApi.query();
}

function onDictActionClick({
  code,
  row,
}: OnActionClickParams<SystemDictApi.SystemDict>) {
  switch (code) {
    case 'details': {
      currentDict.value = row;
      onRefreshDetail();
      break;
    }
    case 'edit': {
      dictFormDrawerApi.setData(row).open();
      break;
    }
    case 'delete': {
      onDeleteDict(row);
      break;
    }
  }
}

function onDetailActionClick({
  code,
  row,
}: OnActionClickParams<SystemDictApi.SystemDictDetail>) {
  switch (code) {
    case 'edit': {
      dictDetailFormDrawerApi.setData(row).open();
      break;
    }
    case 'delete': {
      onDeleteDetail(row);
      break;
    }
  }
}

async function onDeleteDict(row: SystemDictApi.SystemDict) {
  const hideLoading = message.loading({
    content: `正在删除字典 ${row.name}...`,
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteDict(row.dictId!);
    message.success({
      content: `字典 ${row.name} 已删除`,
      key: 'action_process_msg',
    });
    if (currentDict.value?.dictId === row.dictId) {
      currentDict.value = null;
      onRefreshDetail();
    }
    onRefreshDict();
  } catch {
    hideLoading();
  }
}

async function onDeleteDetail(row: SystemDictApi.SystemDictDetail) {
  const hideLoading = message.loading({
    content: `正在删除字典明细 ${row.label}...`,
    duration: 0,
    key: 'action_process_msg',
  });

  try {
    await deleteDictDetail(row.detailId!);
    message.success({
      content: `字典明细 ${row.label} 已删除`,
      key: 'action_process_msg',
    });
    onRefreshDetail();
  } catch {
    hideLoading();
  }
}
</script>

<template>
  <Page
    auto-content-height
    content-class="flex min-h-0 flex-col gap-4 overflow-hidden"
  >
    <DictFormDrawer @success="onRefreshDict" />
    <DictDetailFormDrawer @success="onRefreshDetail" />
    <div
      class="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 overflow-hidden"
    >
      <div class="min-h-0 min-w-0 overflow-hidden">
        <DictGrid class="h-full min-h-0" table-title="字典列表">
          <template #toolbar-tools>
            <Button type="primary" @click="onCreateDict">
              <Plus class="size-5" />
              新增字典
            </Button>
          </template>
        </DictGrid>
      </div>
      <Card
        :bordered="false"
        :body-style="{ height: '100%', padding: '0' }"
        class="min-h-0 overflow-hidden"
        size="small"
        :title="detailTitle"
      >
        <div v-if="currentDict?.dictId" class="flex h-full min-h-0 flex-col">
          <div class="flex items-center justify-end border-b px-4 py-3">
            <Button type="primary" @click="onCreateDetail">
              <Plus class="size-5" />
              新增明细
            </Button>
          </div>
          <div class="min-h-0 flex-1 overflow-hidden p-4">
            <DetailGrid class="h-full min-h-0" />
          </div>
        </div>
        <div
          v-else
          class="flex h-full min-h-[320px] items-center justify-center p-6"
        >
          <Empty description="请选择左侧字典后查看明细" />
        </div>
      </Card>
    </div>
  </Page>
</template>
