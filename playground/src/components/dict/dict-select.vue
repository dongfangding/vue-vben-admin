<script lang="ts" setup>
import { computed, watch } from 'vue';

import { Select } from 'ant-design-vue';

import type { DictMatchField } from './types';

import { useDictOptions } from './use-dict';

const props = withDefaults(
  defineProps<{
    dictCode: string;
    matchField?: DictMatchField;
    modelValue?: string;
  }>(),
  {
    matchField: 'detailCode',
    modelValue: undefined,
  },
);

const emit = defineEmits<{
  optionsChange: [Array<{ label: string; value: string | undefined }>];
  'update:modelValue': [string | undefined];
}>();

const { loading, options } = useDictOptions(
  () => props.dictCode,
  () => ({
    matchField: props.matchField,
  }),
);

watch(
  options,
  (currentOptions) => {
    emit('optionsChange', currentOptions);
  },
  {
    immediate: true,
  },
);

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <Select
    v-model:value="innerValue"
    :loading="loading"
    :options="options"
    v-bind="$attrs"
  />
</template>
