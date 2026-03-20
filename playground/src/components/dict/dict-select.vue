<script lang="ts" setup>
import { computed, useAttrs, watch } from 'vue';

import { Select } from 'ant-design-vue';
import type { SelectValue } from 'ant-design-vue/es/select';

import type { DictMatchField } from './types';

import { useDictOptions } from './use-dict';

const props = withDefaults(
  defineProps<{
    dictCode: string;
    matchField?: DictMatchField;
    modelValue?: string;
    value?: string;
  }>(),
  {
    matchField: 'detailCode',
    modelValue: undefined,
    value: undefined,
  },
);

const emit = defineEmits<{
  optionsChange: [Array<{ label: string; value: string | undefined }>];
  'update:modelValue': [string | undefined];
  'update:value': [string | undefined];
}>();

const attrs = useAttrs();

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
  get: () => props.value ?? props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    emit('update:value', value);
  },
});

/**
 * DictSelect 作为表单适配组件时，需要自己消费 value/update:value，
 * 否则透传给 ASelect 后会与内部双向绑定叠加，触发数组监听告警。
 */
const forwardedAttrs = computed(() => {
  const {
    'onUpdate:modelValue': _onUpdateModelValue,
    'onUpdate:value': _onUpdateValue,
    ...rest
  } = attrs;
  return rest;
});

function normalizeSelectValue(value: SelectValue) {
  if (value === null || value === undefined) {
    return undefined;
  }

  return String(value);
}
</script>

<template>
  <Select
    :value="innerValue"
    :loading="loading"
    :options="options"
    v-bind="forwardedAttrs"
    @update:value="innerValue = normalizeSelectValue($event)"
  />
</template>
