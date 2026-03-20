import { beforeEach, describe, expect, it, vi } from 'vitest';

import { refreshDictCacheOnSuccess } from '../cache';

import { refreshDict } from '#/components/dict';

vi.mock('#/components/dict', () => ({
  refreshDict: vi.fn(),
}));

describe('dict cache sync', () => {
  beforeEach(() => {
    vi.mocked(refreshDict).mockReset();
  });

  it('refreshes dict cache when dictCode exists', async () => {
    await refreshDictCacheOnSuccess('enabled');

    expect(refreshDict).toHaveBeenCalledWith('enabled');
  });

  it('skips refresh when dictCode is empty', async () => {
    await refreshDictCacheOnSuccess();

    expect(refreshDict).not.toHaveBeenCalled();
  });
});
