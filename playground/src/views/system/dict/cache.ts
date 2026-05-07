import { refreshDict } from '#/components/dict';

export async function refreshDictCacheOnSuccess(dictCode?: string) {
  if (!dictCode) {
    return;
  }

  await refreshDict(dictCode);
}
