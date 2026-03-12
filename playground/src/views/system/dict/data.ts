import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

export function useDictGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: '关键字',
    },
  ];
}

export function useDictFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'dictCode',
      label: '字典编码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '字典名称',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '字典描述',
    },
  ];
}

export function useDictDetailGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'keyword',
      label: '关键字',
    },
  ];
}

export function useDictDetailFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'detailCode',
      label: '明细编码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'label',
      label: '标签',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'value',
      label: '值',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'dictSort',
      label: '排序',
      defaultValue: 0,
      rules: 'required',
    },
  ];
}

export function useDictColumns(
  onActionClick: OnActionClickFn<SystemDictApi.SystemDict>,
  actionVisible?: {
    delete?: boolean;
    details?: boolean;
    edit?: boolean;
  },
): VxeTableGridOptions<SystemDictApi.SystemDict>['columns'] {
  return [
    {
      field: 'dictId',
      title: '字典ID',
      width: 100,
    },
    {
      field: 'dictCode',
      title: '字典编码',
      minWidth: 160,
    },
    {
      field: 'name',
      title: '字典名称',
      minWidth: 180,
    },
    {
      field: 'description',
      title: '字典描述',
      minWidth: 220,
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: '创建时间',
      width: 180,
    },
    {
      align: 'center',
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 180,
      cellRender: {
        name: 'CellOperation',
        attrs: {
          nameField: 'name',
          nameTitle: '字典',
          onClick: onActionClick,
        },
        options: [
          {
            code: 'edit',
            show: actionVisible?.edit ?? true,
          },
          {
            code: 'delete',
            show: actionVisible?.delete ?? true,
          },
        ],
      },
    },
  ];
}

export function useDictDetailColumns(
  onActionClick: OnActionClickFn<SystemDictApi.SystemDictDetail>,
  actionVisible?: {
    delete?: boolean;
    edit?: boolean;
  },
): VxeTableGridOptions<SystemDictApi.SystemDictDetail>['columns'] {
  return [
    {
      field: 'detailId',
      title: '明细ID',
      width: 100,
    },
    {
      field: 'detailCode',
      title: '明细编码',
      minWidth: 160,
    },
    {
      field: 'label',
      title: '标签',
      minWidth: 160,
    },
    {
      field: 'value',
      title: '值',
      minWidth: 160,
    },
    {
      field: 'dictSort',
      title: '排序',
      width: 100,
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: '创建时间',
      width: 180,
    },
    {
      align: 'center',
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 140,
      cellRender: {
        name: 'CellOperation',
        attrs: {
          nameField: 'label',
          nameTitle: '字典明细',
          onClick: onActionClick,
        },
        options: [
          {
            code: 'edit',
            show: actionVisible?.edit ?? true,
          },
          {
            code: 'delete',
            show: actionVisible?.delete ?? true,
          },
        ],
      },
    },
  ];
}
