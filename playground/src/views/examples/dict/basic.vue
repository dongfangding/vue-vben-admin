<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { Page } from '@vben/common-ui';

import { Alert, Card, Col, Row, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { DictSelect, DictTag, DictText } from '#/components/dict';

import {
  DICT_DEMO_CODE,
  DICT_DEMO_ROWS,
  DICT_DEMO_SNIPPETS,
  useDictDemoColumns,
  useDictDemoFormSchema,
} from './data';

/**
 * 模板渲染区域使用本地响应式状态，方便直接观察值绑定与名称渲染的关系。
 */
const previewState = reactive({
  statusByCode: 'enabled',
  statusByValue: '1',
});

/**
 * 表单示例直接复用声明式 schema，演示业务侧只配置 DictSelect 与 dictCode 的写法。
 */
const [DemoForm] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: useDictDemoFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 gap-4 md:grid-cols-2',
});

/**
 * 表格示例使用静态数据，重点展示列配置如何声明字典渲染器。
 */
const gridOptions: VxeGridProps = {
  columns: useDictDemoColumns(),
  data: DICT_DEMO_ROWS,
  pagerConfig: {
    enabled: false,
  },
};

const [Grid] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <Page
    description="通用字典组件示例页，集中演示 DictSelect、DictText、DictTag 以及表格字典渲染器的接入方式。"
    title="字典基础示例"
  >
    <Alert
      class="mb-4"
      message="默认按 detailCode 匹配，特殊场景可显式切换到 value。示例默认使用字典编码 enabled。"
      show-icon
      type="info"
    />
    <Row :gutter="[16, 16]">
      <Col :span="24" :xl="12">
        <Card title="表单 Schema 接入">
          <p class="mb-4 text-text-secondary">
            业务表单只需要声明 <code>component: 'DictSelect'</code> 与
            <code>dictCode: '{{ DICT_DEMO_CODE }}'</code>，选项会自动懒加载。
          </p>
          <DemoForm />
          <pre class="mt-4 overflow-x-auto rounded bg-muted p-3 text-xs leading-6">{{ DICT_DEMO_SNIPPETS.selectByCode }}</pre>
          <pre class="mt-3 overflow-x-auto rounded bg-muted p-3 text-xs leading-6">{{ DICT_DEMO_SNIPPETS.selectByValue }}</pre>
        </Card>
      </Col>
      <Col :span="24" :xl="12">
        <Card title="模板组件渲染">
          <Space class="w-full" direction="vertical" size="large">
            <div>
              <div class="mb-2 text-sm text-text-secondary">按明细编码绑定</div>
              <DictSelect
                v-model="previewState.statusByCode"
                :dict-code="DICT_DEMO_CODE"
                allow-clear
                class="w-full"
              />
              <div class="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span>当前值：{{ previewState.statusByCode }}</span>
                <span>
                  文本：<DictText
                    :dict-code="DICT_DEMO_CODE"
                    :value="previewState.statusByCode"
                  />
                </span>
                <span>
                  标签：<DictTag
                    :dict-code="DICT_DEMO_CODE"
                    :value="previewState.statusByCode"
                  />
                </span>
              </div>
            </div>
            <div>
              <div class="mb-2 text-sm text-text-secondary">按业务值绑定</div>
              <DictSelect
                v-model="previewState.statusByValue"
                :dict-code="DICT_DEMO_CODE"
                allow-clear
                class="w-full"
                match-field="value"
              />
              <div class="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span>当前值：{{ previewState.statusByValue }}</span>
                <span>
                  文本：<DictText
                    :dict-code="DICT_DEMO_CODE"
                    match-field="value"
                    :value="previewState.statusByValue"
                  />
                </span>
                <span>
                  标签：<DictTag
                    :dict-code="DICT_DEMO_CODE"
                    match-field="value"
                    :value="previewState.statusByValue"
                  />
                </span>
              </div>
            </div>
          </Space>
        </Card>
      </Col>
      <Col :span="24">
        <Card title="表格列渲染">
          <p class="mb-4 text-text-secondary">
            列配置中声明 <code>CellDictText</code> 或 <code>CellDictTag</code>
            后，表格会自动根据字典编码完成值到名称的映射。
          </p>
          <pre class="mb-3 overflow-x-auto rounded bg-muted p-3 text-xs leading-6">{{ DICT_DEMO_SNIPPETS.tableColumnByCode }}</pre>
          <pre class="mb-4 overflow-x-auto rounded bg-muted p-3 text-xs leading-6">{{ DICT_DEMO_SNIPPETS.tableColumnByValue }}</pre>
          <Grid table-title="字典列渲染结果" />
        </Card>
      </Col>
    </Row>
  </Page>
</template>
