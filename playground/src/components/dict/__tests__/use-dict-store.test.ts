import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchDictOptionsByCode } from '#/api/system/dict';

import type { DictMatchConfig } from '../types';

import {
  clearDictCache,
  ensureDictLoaded,
  refreshDict,
} from '../use-dict-store';

vi.mock('#/api/system/dict', () => ({
  fetchDictOptionsByCode: vi.fn(),
}));

const mockedFetchDictOptionsByCode = vi.mocked(fetchDictOptionsByCode);

describe('dict api helper contract', () => {
  it('supports detailCode as default match field and value as optional match field', () => {
    const config: DictMatchConfig = { matchField: 'detailCode' };

    expect(config.matchField).toBe('detailCode');
  });
});

describe('dict store', () => {
  beforeEach(() => {
    clearDictCache();
    mockedFetchDictOptionsByCode.mockReset();
    mockedFetchDictOptionsByCode.mockResolvedValue([
      {
        detailCode: 'enabled',
        dictCode: 'enabled',
        dictId: 1,
        dictSort: 1,
        label: '启用',
        value: '1',
      },
      {
        detailCode: 'disabled',
        dictCode: 'enabled',
        dictId: 1,
        dictSort: 0,
        label: '禁用',
        value: '0',
      },
    ]);
  });

  it('requests dict details with dictCode and normalizes list data', async () => {
    const response = await fetchDictOptionsByCode('enabled');

    expect(mockedFetchDictOptionsByCode).toHaveBeenCalledWith('enabled');
    expect(response[0]).toMatchObject({
      detailCode: 'enabled',
      dictCode: 'enabled',
      label: '启用',
    });
  });

  it('only requests once for the same dictCode while loading', async () => {
    let resolveFetch: (value: Awaited<ReturnType<typeof fetchDictOptionsByCode>>) => void;
    const pendingFetch = new Promise<
      Awaited<ReturnType<typeof fetchDictOptionsByCode>>
    >((resolve) => {
      resolveFetch = resolve;
    });
    mockedFetchDictOptionsByCode.mockReturnValueOnce(pendingFetch);

    const promiseA = ensureDictLoaded('enabled');
    const promiseB = ensureDictLoaded('enabled');

    resolveFetch!([
      {
        detailCode: 'enabled',
        dictCode: 'enabled',
        dictId: 1,
        dictSort: 1,
        label: '启用',
        value: '1',
      },
    ]);

    const [bucketA, bucketB] = await Promise.all([promiseA, promiseB]);

    expect(mockedFetchDictOptionsByCode).toHaveBeenCalledTimes(1);
    expect(bucketA).toBe(bucketB);
    expect(bucketA.loaded).toBe(true);
  });

  it('returns cached bucket without refetching when dictCode is already loaded', async () => {
    const firstBucket = await ensureDictLoaded('enabled');
    const secondBucket = await ensureDictLoaded('enabled');

    expect(mockedFetchDictOptionsByCode).toHaveBeenCalledTimes(1);
    expect(firstBucket).toBe(secondBucket);
  });

  it('refreshes bucket data when refreshDict is called', async () => {
    await ensureDictLoaded('enabled');
    await refreshDict('enabled');

    expect(mockedFetchDictOptionsByCode).toHaveBeenCalledTimes(2);
  });

  it('clears a single bucket when clearDictCache receives dictCode', async () => {
    await ensureDictLoaded('enabled');

    clearDictCache('enabled');
    await ensureDictLoaded('enabled');

    expect(mockedFetchDictOptionsByCode).toHaveBeenCalledTimes(2);
  });
});
