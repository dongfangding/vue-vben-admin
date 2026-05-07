import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

/**
 * 示例页默认使用的字典编码。
 * 这里沿用现有测试数据中的 enabled，方便前后端联调用同一份字典。
 */
export const DICT_DEMO_CODE = 'enabled';

export interface DictDemoRow {
  id: number;
  name: string;
  statusByCode: string;
  statusByCodeTag: string;
  statusByValueText: string;
  statusByValue: string;
  statusByValueTag: string;
}

/**
 * 静态示例数据用于表格展示，分别覆盖 detailCode 与 value 两种绑定模式。
 */
export const DICT_DEMO_ROWS: DictDemoRow[] = [
  {
    id: 1,
    name: '系统管理员',
    statusByCode: 'enabled',
    statusByCodeTag: 'enabled',
    statusByValueText: '1',
    statusByValue: '1',
    statusByValueTag: '1',
  },
  {
    id: 2,
    name: '审计账号',
    statusByCode: 'disabled',
    statusByCodeTag: 'disabled',
    statusByValueText: '0',
    statusByValue: '0',
    statusByValueTag: '0',
  },
];

/**
 * 表单 schema 演示 DictSelect 在声明式场景中的接入方式。
 */
export function useDictDemoFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'DictSelect',
      componentProps: {
        allowClear: true,
        dictCode: DICT_DEMO_CODE,
      },
      defaultValue: 'enabled',
      fieldName: 'statusByCode',
      label: '按明细编码绑定',
    },
    {
      component: 'DictSelect',
      componentProps: {
        allowClear: true,
        dictCode: DICT_DEMO_CODE,
        matchField: 'value',
      },
      defaultValue: '1',
      fieldName: 'statusByValue',
      label: '按业务值绑定',
    },
  ];
}

/**
 * 表格列演示 CellDictText 与 CellDictTag 的声明式渲染方式。
 */
export function useDictDemoColumns(): VxeTableGridOptions<DictDemoRow>['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'name',
      title: '账号名称',
      minWidth: 180,
    },
    {
      field: 'statusByCode',
      title: '编码文本',
      minWidth: 140,
      cellRender: {
        name: 'CellDictText',
        props: {
          dictCode: DICT_DEMO_CODE,
        },
      },
    },
    {
      field: 'statusByCodeTag',
      title: '编码标签',
      minWidth: 140,
      cellRender: {
        name: 'CellDictTag',
        props: {
          color: 'success',
          dictCode: DICT_DEMO_CODE,
        },
      },
    },
    {
      field: 'statusByValueText',
      title: '值文本',
      minWidth: 140,
      cellRender: {
        name: 'CellDictText',
        props: {
          dictCode: DICT_DEMO_CODE,
          matchField: 'value',
        },
      },
    },
    {
      field: 'statusByValueTag',
      title: '值标签',
      minWidth: 140,
      cellRender: {
        name: 'CellDictTag',
        props: {
          color: 'processing',
          dictCode: DICT_DEMO_CODE,
          matchField: 'value',
        },
      },
    },
  ];
}

/**
 * 页面上的说明文案统一从模块导出，避免在 .vue 文件中散落硬编码字符串。
 */
export const DICT_DEMO_SNIPPETS = {
  selectByCode: `<DictSelect dict-code="${DICT_DEMO_CODE}" />`,
  selectByValue: `<DictSelect dict-code="${DICT_DEMO_CODE}" match-field="value" />`,
  tableColumnByCode: `cellRender: { name: 'CellDictText', props: { dictCode: '${DICT_DEMO_CODE}' } }`,
  tableColumnByValue: `cellRender: { name: 'CellDictTag', props: { dictCode: '${DICT_DEMO_CODE}', matchField: 'value' } }`,
};
