import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchDictOptionsByCode } from '#/api/system/dict';

import {
  clearDictCache,
  getDictItem,
  getDictLabel,
  getDictOptions,
} from '../use-dict';

vi.mock('#/api/system/dict', () => ({
  fetchDictOptionsByCode: vi.fn(),
}));

const mockedFetchDictOptionsByCode = vi.mocked(fetchDictOptionsByCode);

describe('use dict', () => {
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

  it('returns label by detailCode by default and raw value when not found', async () => {
    expect(await getDictLabel('enabled', 'enabled')).toBe('启用');
    expect(await getDictLabel('enabled', 'unknown')).toBe('unknown');
  });

  it('supports matching by value when matchField is value', async () => {
    expect(
      await getDictLabel('enabled', '1', {
        matchField: 'value',
      }),
    ).toBe('启用');
  });

  it('returns full dict item by match config', async () => {
    expect(
      await getDictItem('enabled', '0', {
        matchField: 'value',
      }),
    ).toMatchObject({
      detailCode: 'disabled',
      label: '禁用',
      value: '0',
    });
  });

  it('returns select options using detailCode as default value field', async () => {
    await expect(getDictOptions('enabled')).resolves.toEqual([
      {
        label: '启用',
        value: 'enabled',
      },
      {
        label: '禁用',
        value: 'disabled',
      },
    ]);
  });

  it('returns select options using value when matchField is value', async () => {
    await expect(
      getDictOptions('enabled', {
        matchField: 'value',
      }),
    ).resolves.toEqual([
      {
        label: '启用',
        value: '1',
      },
      {
        label: '禁用',
        value: '0',
      },
    ]);
  });
});
