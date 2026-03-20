<script lang="ts" setup>
import { ref, watch } from 'vue';

import type { DictMatchField } from './types';

import { getDictLabel } from './use-dict';

const props = withDefaults(
  defineProps<{
    dictCode: string;
    matchField?: DictMatchField;
    value?: null | string;
  }>(),
  {
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
  <span>{{ label }}</span>
</template>
