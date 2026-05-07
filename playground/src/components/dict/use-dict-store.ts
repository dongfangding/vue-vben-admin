import { reactive } from 'vue';

import { fetchDictOptionsByCode } from '#/api/system/dict';

import type { DictBucket, DictOptionItem } from './types';

const dictBuckets = reactive<Record<string, DictBucket>>({});

function createBucket(): DictBucket {
  return {
    detailCodeMap: new Map(),
    error: null,
    fetchedAt: null,
    items: [],
    loaded: false,
    loading: false,
    valueMap: new Map(),
  };
}

function getOrCreateBucket(dictCode: string) {
  if (!dictBuckets[dictCode]) {
    dictBuckets[dictCode] = createBucket();
  }
  return dictBuckets[dictCode];
}

function fillBucket(bucket: DictBucket, items: DictOptionItem[]) {
  bucket.items = items;
  bucket.detailCodeMap = new Map(
    items
      .filter((item) => item.detailCode !== undefined)
      .map((item) => [String(item.detailCode), item]),
  );
  bucket.valueMap = new Map(
    items
      .filter((item) => item.value !== undefined)
      .map((item) => [String(item.value), item]),
  );
  bucket.fetchedAt = Date.now();
  bucket.loaded = true;
}

async function loadBucket(dictCode: string, bucket: DictBucket) {
  bucket.loading = true;
  bucket.error = null;

  try {
    const items = await fetchDictOptionsByCode(dictCode);
    fillBucket(bucket, items);
    return bucket;
  } catch (error) {
    bucket.error = error;
    bucket.loaded = false;
    throw error;
  } finally {
    bucket.loading = false;
    bucket.pendingPromise = undefined;
  }
}

export async function ensureDictLoaded(dictCode: string) {
  const bucket = getOrCreateBucket(dictCode);

  if (bucket.loaded) {
    return bucket;
  }

  if (bucket.pendingPromise) {
    return await bucket.pendingPromise;
  }

  bucket.pendingPromise = loadBucket(dictCode, bucket);
  return await bucket.pendingPromise;
}

export async function refreshDict(dictCode: string) {
  const bucket = getOrCreateBucket(dictCode);
  bucket.loaded = false;
  bucket.pendingPromise = undefined;

  return await ensureDictLoaded(dictCode);
}

export function clearDictCache(dictCode?: string) {
  if (dictCode) {
    delete dictBuckets[dictCode];
    return;
  }

  Object.keys(dictBuckets).forEach((key) => {
    delete dictBuckets[key];
  });
}
