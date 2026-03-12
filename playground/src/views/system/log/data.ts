import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemLogApi } from '#/api';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: '操作用户',
    },
    {
      component: 'Input',
      fieldName: 'logType',
      label: '日志类型',
    },
    {
      component: 'Input',
      fieldName: 'description',
      label: '操作说明',
    },
    {
      component: 'RangePicker',
      fieldName: 'createTime',
      label: '操作时间',
    },
  ];
}

export function useColumns(): VxeTableGridOptions<SystemLogApi.SystemLog>['columns'] {
  return [
    {
      align: 'center',
      type: 'checkbox',
      width: 60,
    },
    {
      title: '#',
      type: 'seq',
      width: 60,
    },
    {
      field: 'username',
      title: '操作用户',
      width: 140,
    },
    {
      field: 'logType',
      title: '日志类型',
      width: 140,
      cellRender: {
        name: 'CellTag',
        options: [
          {
            color: 'success',
            label: 'SUCCESS',
            value: 'SUCCESS',
          },
          {
            color: 'error',
            label: 'FAIL',
            value: 'FAIL',
          },
        ],
      },
    },
    {
      field: 'description',
      title: '操作说明',
      minWidth: 200,
    },
    {
      field: 'requestIp',
      title: '请求IP',
      width: 140,
    },
    {
      field: 'address',
      title: '地址',
      minWidth: 220,
    },
    {
      field: 'browser',
      title: '浏览器',
      minWidth: 160,
    },
    {
      field: 'time',
      title: '耗时(ms)',
      width: 120,
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: '操作时间',
      width: 180,
    },
  ];
}
