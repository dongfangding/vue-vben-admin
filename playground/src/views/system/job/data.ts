import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemJobApi } from '#/api';

export function getStatusOptions() {
  return [
    { label: '启用', value: true },
    { label: '禁用', value: false },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '岗位名称',
    },
    {
      component: 'Select',
      fieldName: 'enabled',
      label: '状态',
      componentProps: {
        allowClear: true,
        options: getStatusOptions(),
      },
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '岗位名称',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: '排序',
      defaultValue: 0,
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      fieldName: 'enabled',
      label: '状态',
      defaultValue: true,
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: getStatusOptions(),
      },
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemJobApi.SystemJob>,
  actionVisible?: {
    delete?: boolean;
    edit?: boolean;
  },
): VxeTableGridOptions<SystemJobApi.SystemJob>['columns'] {
  return [
    {
      field: 'jobId',
      title: '岗位ID',
      width: 100,
    },
    {
      field: 'name',
      title: '岗位名称',
      minWidth: 180,
    },
    {
      field: 'sort',
      title: '排序',
      width: 100,
    },
    {
      field: 'enabled',
      title: '状态',
      width: 120,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: '启用', value: true },
          { color: 'error', label: '禁用', value: false },
        ],
      },
    },
    {
      field: 'formatCreateTime',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'formatUpdateTime',
      title: '更新时间',
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
          nameField: 'name',
          nameTitle: '岗位',
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
