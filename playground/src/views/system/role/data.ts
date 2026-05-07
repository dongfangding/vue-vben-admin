import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.role.roleName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'description',
      label: $t('system.role.remark'),
    },
    {
      component: 'InputNumber',
      fieldName: 'level',
      label: $t('system.role.level'),
      help: $t('system.role.levelHelp'),
    },
    {
      component: 'Input',
      fieldName: 'ipLimit',
      label: $t('system.role.ipLimit'),
      help: $t('system.role.ipLimitHelp'),
    },
    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: $t('system.role.sort'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.role.roleName'),
    },
    { component: 'Input', fieldName: 'roleId', label: $t('system.role.id') },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('common.enabled'), value: 'true' },
          { label: $t('common.disabled'), value: 'false' },
        ],
      },
      fieldName: 'enabled',
      label: $t('system.role.enable'),
    },
    {
      component: 'Input',
      fieldName: 'description',
      label: $t('system.role.remark'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createTime',
      label: $t('system.role.createTime'),
    },
  ];
}

export function useColumns<T = SystemRoleApi.SystemRole>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
  actionVisible?: {
    authorize?: boolean;
    delete?: boolean;
    edit?: boolean;
  },
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'sort',
      title: $t('system.role.sort'),
      width: 100,
    },
    {
      field: 'roleId',
      title: $t('system.role.id'),
      width: 100,
    },
    {
      field: 'name',
      title: $t('system.role.roleName'),
      width: 200,
    },
    {
      field: 'level',
      title: $t('system.role.level'),
      width: 100,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          checkedValue: true,
          unCheckedValue: false,
        },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'enabled',
      title: $t('system.role.enable'),
      width: 120,
    },
    {
      field: 'description',
      minWidth: 100,
      title: $t('system.role.remark'),
    },
    {
      field: 'formatCreateTime',
      title: $t('system.role.createTime'),
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.role.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'authorize',
            show: actionVisible?.authorize ?? true,
            text: $t('system.role.setPermissions'),
          },
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
      field: 'operation',
      fixed: 'right',
      title: $t('system.role.operation'),
      width: 220,
    },
  ];
}
