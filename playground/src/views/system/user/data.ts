import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { $t } from '#/locales';

export function getSexOptions() {
  return [
    {
      label: $t('system.user.female'),
      value: 0,
    },
    {
      label: $t('system.user.male'),
      value: 1,
    },
  ];
}

export function getStatusOptions() {
  return [
    {
      label: $t('common.enabled'),
      value: true,
    },
    {
      label: $t('common.disabled'),
      value: false,
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
    },
    {
      component: 'Input',
      fieldName: 'mobile',
      label: $t('system.user.mobile'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getStatusOptions(),
      },
      fieldName: 'enabled',
      label: $t('system.user.status'),
    },
  ];
}

export function useColumns<T = SystemUserApi.SystemUser>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
  actionVisible?: {
    delete?: boolean;
    edit?: boolean;
    resetPassword?: boolean;
  },
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'userId',
      title: $t('system.user.id'),
      width: 100,
    },
    {
      field: 'username',
      title: $t('system.user.username'),
      width: 160,
    },
    {
      field: 'nickname',
      title: $t('system.user.nickname'),
      width: 160,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          {
            color: 'processing',
            label: $t('system.user.female'),
            value: 0,
          },
          {
            color: 'success',
            label: $t('system.user.male'),
            value: 1,
          },
        ],
      },
      field: 'sex',
      title: $t('system.user.sex'),
      width: 120,
    },
    {
      field: 'mobile',
      title: $t('system.user.mobile'),
      width: 160,
    },
    {
      field: 'email',
      minWidth: 200,
      title: $t('system.user.email'),
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          checkedValue: true,
          unCheckedValue: false,
        },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
        options: onStatusChange
          ? undefined
          : [
              {
                color: 'success',
                label: $t('system.user.enabled'),
                value: true,
              },
              {
                color: 'error',
                label: $t('system.user.disabled'),
                value: false,
              },
            ],
      },
      field: 'enabled',
      title: $t('system.user.status'),
      width: 120,
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: $t('system.user.createTime'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'username',
          nameTitle: $t('system.user.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'reset-password',
            show: actionVisible?.resetPassword ?? true,
            text: '\u91CD\u7F6E\u5BC6\u7801',
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
      title: $t('system.user.operation'),
      width: 220,
    },
  ];
}
