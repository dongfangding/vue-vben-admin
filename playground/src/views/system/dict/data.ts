import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

export function useDictGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '字典名称',
    },
  ];
}

export function useDictFormSchema(): VbenFormSchema[] {
  return [
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
      fieldName: 'label',
      label: '标签',
    },
    {
      component: 'Input',
      fieldName: 'value',
      label: '值',
    },
  ];
}

export function useDictDetailFormSchema(): VbenFormSchema[] {
  return [
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
): VxeTableGridOptions<SystemDictApi.SystemDict>['columns'] {
  return [
    {
      field: 'dictId',
      title: '字典ID',
      width: 100,
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
      width: 210,
      cellRender: {
        name: 'CellOperation',
        attrs: {
          nameField: 'name',
          nameTitle: '字典',
          onClick: onActionClick,
        },
        options: [
          {
            code: 'details',
            text: '明细',
          },
          'edit',
          'delete',
        ],
      },
    },
  ];
}

export function useDictDetailColumns(
  onActionClick: OnActionClickFn<SystemDictApi.SystemDictDetail>,
): VxeTableGridOptions<SystemDictApi.SystemDictDetail>['columns'] {
  return [
    {
      field: 'detailId',
      title: '明细ID',
      width: 100,
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
      },
    },
  ];
}
