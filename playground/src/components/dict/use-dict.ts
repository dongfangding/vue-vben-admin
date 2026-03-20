import { computed, ref, watch } from 'vue';

import type { DictBucket, DictMatchConfig } from './types';

import { clearDictCache, ensureDictLoaded, refreshDict } from './use-dict-store';

function resolveMatchField(config?: DictMatchConfig) {
  return config?.matchField ?? 'detailCode';
}

function getItemByMatchField(bucket: DictBucket, value: unknown, config?: DictMatchConfig) {
  const normalizedValue = String(value ?? '');
  const matchField = resolveMatchField(config);

  return matchField === 'value'
    ? bucket.valueMap.get(normalizedValue)
    : bucket.detailCodeMap.get(normalizedValue);
}

export async function getDictItem(
  dictCode: string,
  value: unknown,
  config?: DictMatchConfig,
) {
  const bucket = await ensureDictLoaded(dictCode);
  return getItemByMatchField(bucket, value, config);
}

export async function getDictLabel(
  dictCode: string,
  value: unknown,
  config?: DictMatchConfig,
) {
  const item = await getDictItem(dictCode, value, config);
  return item?.label ?? String(value ?? '');
}

export async function getDictOptions(dictCode: string, config?: DictMatchConfig) {
  const bucket = await ensureDictLoaded(dictCode);
  const matchField = resolveMatchField(config);

  return bucket.items.map((item) => ({
    label: item.label,
    value: matchField === 'value' ? item.value : item.detailCode,
  }));
}

export function useDictOptions(
  dictCode: () => string,
  config?: () => DictMatchConfig | undefined,
) {
  const loading = ref(false);
  const options = ref<Array<{ label: string; value: string | undefined }>>([]);

  async function loadOptions() {
    const currentDictCode = dictCode();
    if (!currentDictCode) {
      options.value = [];
      return;
    }

    loading.value = true;
    try {
      options.value = await getDictOptions(currentDictCode, config?.());
    } finally {
      loading.value = false;
    }
  }

  watch(
    computed(() => [dictCode(), config?.()?.matchField]),
    () => {
      void loadOptions();
    },
    {
      immediate: true,
    },
  );

  return {
    loading: computed(() => loading.value),
    options: computed(() => options.value),
    reload: loadOptions,
  };
}

export { clearDictCache, refreshDict };
