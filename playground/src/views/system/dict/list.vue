<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { computed, ref } from 'vue';

import { useAccess } from '@vben/access';
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
import { refreshDictCacheOnSuccess } from './cache';
import DictDetailForm from './modules/dict-detail-form.vue';
import DictForm from './modules/dict-form.vue';

const { hasAccessByCodes } = useAccess();
const canCreateDict = hasAccessByCodes(['dict:add']);
const canEditDict = hasAccessByCodes(['dict:edit']);
const canDeleteDict = hasAccessByCodes(['dict:del']);
const canCreateDictDetail = hasAccessByCodes(['dict-detail:add']);
const canEditDictDetail = hasAccessByCodes(['dict-detail:edit']);
const canDeleteDictDetail = hasAccessByCodes(['dict-detail:del']);
const canViewDictDetail =
  canCreateDictDetail || canEditDictDetail || canDeleteDictDetail;

const currentDict = ref<null | SystemDictApi.SystemDict>(null);

const [DictFormDrawer, dictFormDrawerApi] = useVbenDrawer({
  connectedComponent: DictForm,
  destroyOnClose: true,
});

const [DictDetailFormDrawer, dictDetailFormDrawerApi] = useVbenDrawer({
  connectedComponent: DictDetailForm,
  destroyOnClose: true,
});

function selectDict(row: SystemDictApi.SystemDict) {
  if (!canViewDictDetail || !row.dictId) {
    return;
  }

  if (currentDict.value?.dictId === row.dictId) {
    return;
  }

  currentDict.value = row;
  onRefreshDetail();
}

const dictGridEvents: VxeGridListeners<SystemDictApi.SystemDict> = {
  cellClick: ({ column, row }) => {
    if (column.field === 'operation') {
      return;
    }
    selectDict(row);
  },
};

const [DictGrid, dictGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useDictGridFormSchema(),
    submitOnChange: true,
  },
  gridEvents: dictGridEvents,
  gridOptions: {
    columns: useDictColumns(onDictActionClick, {
      delete: canDeleteDict,
      edit: canEditDict,
    }),
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
    columns: useDictDetailColumns(onDetailActionClick, {
      delete: canDeleteDictDetail,
      edit: canEditDictDetail,
    }),
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
  currentDict.value?.name ? `${currentDict.value.name} / 字典明细` : '字典明细',
);

function onCreateDict() {
  if (!canCreateDict) {
    return;
  }
  dictFormDrawerApi.setData({}).open();
}

function onCreateDetail() {
  if (!canCreateDictDetail) {
    return;
  }

  if (!currentDict.value?.dictId) {
    message.warning('请先选择左侧字典');
    return;
  }

  dictDetailFormDrawerApi
    .setData({
      dictCode: currentDict.value.dictCode,
      dictId: currentDict.value.dictId,
      dictSort: 0,
    })
    .open();
}

async function onRefreshDict(payload?: { dictCode?: string }) {
  await refreshDictCacheOnSuccess(payload?.dictCode);
  dictGridApi.query();
}

async function onRefreshDetail(payload?: { dictCode?: string }) {
  await refreshDictCacheOnSuccess(payload?.dictCode);
  detailGridApi.query();
}

function onDictActionClick({
  code,
  row,
}: OnActionClickParams<SystemDictApi.SystemDict>) {
  switch (code) {
    case 'edit': {
      if (!canEditDict) {
        return;
      }
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
      if (!canEditDictDetail) {
        return;
      }
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
  if (!canDeleteDict) {
    return;
  }

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
  if (!canDeleteDictDetail) {
    return;
  }

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
            <Button v-if="canCreateDict" type="primary" @click="onCreateDict">
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
            <Button
              v-if="canCreateDictDetail"
              type="primary"
              @click="onCreateDetail"
            >
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
