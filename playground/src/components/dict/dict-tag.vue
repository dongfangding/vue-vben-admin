<script lang="ts" setup>
import { ref, watch } from 'vue';

import { Tag } from 'ant-design-vue';

import type { DictMatchField } from './types';

import { getDictLabel } from './use-dict';

const props = withDefaults(
  defineProps<{
    color?: string;
    dictCode: string;
    matchField?: DictMatchField;
    value?: null | string;
  }>(),
  {
    color: 'default',
    matchField: 'detailCode',
    value: '',
  },
);

const label = ref(String(props.value ?? ''));

async function syncLabel() {
  label.value = await getDictLabel(props.dictCode, props.value, {
    matchField: props.matchField,
  });
}

watch(
  () => [props.dictCode, props.matchField, props.value],
  () => {
    void syncLabel();
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <Tag :color="color">
    {{ label }}
  </Tag>
</template>
