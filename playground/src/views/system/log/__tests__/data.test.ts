import { describe, expect, it } from 'vitest';

import { useColumns } from '../data';

describe('log columns', () => {
  it('renders logType with success and fail tag colors', () => {
    const columns = useColumns();
    const logTypeColumn = columns?.find((item) => item.field === 'logType');
    const options = logTypeColumn?.cellRender?.options ?? [];

    expect(logTypeColumn?.cellRender?.name).toBe('CellTag');
    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: 'success',
          label: 'SUCCESS',
          value: 'SUCCESS',
        }),
        expect.objectContaining({
          color: 'error',
          label: 'FAIL',
          value: 'FAIL',
        }),
      ]),
    );
  });
});
