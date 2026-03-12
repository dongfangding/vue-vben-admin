import { describe, expect, it, vi } from 'vitest';

import {
  useDictColumns,
  useDictDetailFormSchema,
  useDictFormSchema,
} from '../data';

describe('dict form schema', () => {
  it('requires dictCode when creating or editing a dict', () => {
    const schema = useDictFormSchema();
    const dictCodeField = schema.find((item) => item.fieldName === 'dictCode');

    expect(dictCodeField).toBeDefined();
    expect(dictCodeField?.rules).toBe('required');
  });

  it('requires detailCode when creating or editing a dict detail', () => {
    const schema = useDictDetailFormSchema();
    const detailCodeField = schema.find(
      (item) => item.fieldName === 'detailCode',
    );

    expect(detailCodeField).toBeDefined();
    expect(detailCodeField?.rules).toBe('required');
  });
});

describe('dict table columns', () => {
  it('does not show a separate details action button', () => {
    const columns = useDictColumns(vi.fn(), {
      delete: true,
      details: true,
      edit: true,
    });
    const operationColumn = columns?.find((item) => item.field === 'operation');
    const options = operationColumn?.cellRender?.options ?? [];

    expect(options.map((item: { code: string }) => item.code)).not.toContain(
      'details',
    );
  });
});
