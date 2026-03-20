import { describe, expect, it } from 'vitest';

import {
  DICT_DEMO_CODE,
  DICT_DEMO_ROWS,
  useDictDemoColumns,
  useDictDemoFormSchema,
} from '../data';

describe('dict demo schema', () => {
  it('uses DictSelect for both detailCode and value binding examples', () => {
    const schema = useDictDemoFormSchema();
    const codeField = schema.find((item) => item.fieldName === 'statusByCode');
    const valueField = schema.find((item) => item.fieldName === 'statusByValue');
    const codeProps = (codeField?.componentProps ?? {}) as Record<string, any>;
    const valueProps = (valueField?.componentProps ?? {}) as Record<
      string,
      any
    >;

    expect(codeField?.component).toBe('DictSelect');
    expect(codeProps.dictCode).toBe(DICT_DEMO_CODE);
    expect(valueField?.component).toBe('DictSelect');
    expect(valueProps.matchField).toBe('value');
  });
});

describe('dict demo grid columns', () => {
  it('declares both text and tag renderers for code and value matching', () => {
    const columns = useDictDemoColumns() ?? [];

    expect(
      columns.filter((item) => item.cellRender?.name === 'CellDictText'),
    ).toHaveLength(2);
    expect(
      columns.filter((item) => item.cellRender?.name === 'CellDictTag'),
    ).toHaveLength(2);
    expect(
      columns.find((item) => item.field === 'statusByValueText')?.cellRender?.props
        ?.matchField,
    ).toBe('value');
  });

  it('ships demo rows covering both enabled and disabled states', () => {
    expect(DICT_DEMO_ROWS).toEqual([
      expect.objectContaining({
        statusByCode: 'enabled',
        statusByCodeTag: 'enabled',
        statusByValueText: '1',
        statusByValue: '1',
        statusByValueTag: '1',
      }),
      expect.objectContaining({
        statusByCode: 'disabled',
        statusByCodeTag: 'disabled',
        statusByValueText: '0',
        statusByValue: '0',
        statusByValueTag: '0',
      }),
    ]);
  });
});
