import { beforeEach, describe, expect, it, vi } from 'vitest';

import { globalShareState } from '@vben/common-ui';

const addRenderer = vi.fn();
const setupVbenVxeTable = vi.fn(({ configVxeTable }) => {
  configVxeTable({
    renderer: {
      add: addRenderer,
      delete: vi.fn(),
      forEach: vi.fn(),
    },
    setConfig: vi.fn(),
  });
});

vi.mock('@vben/plugins/vxe-table', () => ({
  setupVbenVxeTable,
  useVbenVxeGrid: vi.fn(),
}));

describe('dict adapter integration', () => {
  beforeEach(() => {
    addRenderer.mockClear();
    setupVbenVxeTable.mockClear();
  });

  it('registers DictSelect into global component registry', async () => {
    const { initComponentAdapter } = await import('../component');

    await initComponentAdapter();

    const components = globalShareState.getComponents();

    expect(components.DictSelect).toBeDefined();
  });

  it('registers CellDictText and CellDictTag renderers', async () => {
    await import('../vxe-table');

    expect(addRenderer).toHaveBeenCalledWith(
      'CellDictText',
      expect.objectContaining({
        renderTableDefault: expect.any(Function),
      }),
    );
    expect(addRenderer).toHaveBeenCalledWith(
      'CellDictTag',
      expect.objectContaining({
        renderTableDefault: expect.any(Function),
      }),
    );
  });
});
