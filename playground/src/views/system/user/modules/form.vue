<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemUserApi } from '#/api/system/user';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';

import { useVbenForm, z } from '#/adapter/form';
import { getDeptList } from '#/api/system/dept';
import { getRoleList } from '#/api/system/role';
import { createUser, updateUser } from '#/api/system/user';
import { $t } from '#/locales';

import { getSexOptions, getStatusOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const roleKeyword = ref('');
const userId = ref<number>();

const isEdit = computed(() => userId.value !== undefined);
const onRoleSearch = useDebounceFn((value: string) => {
  roleKeyword.value = value;
}, 300);

function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.user.username'), 2]))
        .max(
          30,
          $t('ui.formRules.maxLength', [$t('system.user.username'), 30]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.user.nickname'), 2]))
        .max(
          30,
          $t('ui.formRules.maxLength', [$t('system.user.nickname'), 30]),
        ),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getSexOptions(),
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'sex',
      label: $t('system.user.sex'),
    },
    {
      component: 'Input',
      fieldName: 'mobile',
      label: $t('system.user.mobile'),
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
      rules: z
        .string()
        .email($t('ui.formRules.invalidEmail'))
        .or(z.literal(''))
        .optional(),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getStatusOptions(),
        optionType: 'button',
      },
      defaultValue: true,
      fieldName: 'enabled',
      label: $t('system.user.status'),
    },
    {
      component: 'ApiSelect',
      componentProps: () => {
        return {
          afterFetch: (response: any) => {
            if (Array.isArray(response)) {
              return response;
            }
            return response?.content ?? response?.list ?? [];
          },
          allowClear: true,
          api: getRoleList,
          filterOption: false,
          labelField: 'name',
          mode: 'multiple',
          notFoundContent: null,
          onSearch: onRoleSearch,
          params: {
            name: roleKeyword.value || undefined,
            pageNum: 1,
            pageSize: 999,
          },
          showSearch: true,
          valueField: 'roleId',
        };
      },
      fieldName: 'roleIds',
      label: $t('system.user.role'),
      rules: 'selectRequired',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: getDeptList,
        childrenField: 'children',
        labelField: 'name',
        maxTagCount: 'responsive',
        multiple: true,
        showSearch: true,
        treeCheckable: true,
        treeDefaultExpandAll: true,
        treeNodeFilterProp: 'label',
        valueField: 'deptId',
      },
      fieldName: 'deptIds',
      label: $t('system.user.dept'),
      rules: 'selectRequired',
    },
  ];
}

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2 md:col-span-1',
  },
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    drawerApi.lock();
    try {
      const values = await formApi.getValues<SystemUserApi.SystemUser>();
      delete values.password;
      await (userId.value === undefined
        ? createUser(values)
        : updateUser(userId.value, values));
      drawerApi.close();
      emit('success');
    } finally {
      drawerApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }

    roleKeyword.value = '';
    formApi.resetForm();

    const data = drawerApi.getData<SystemUserApi.SystemUser>();
    if (data) {
      userId.value = data.userId;
      await nextTick();
      formApi.setValues(data);
      return;
    }

    userId.value = undefined;
    await nextTick();
    formApi.setValues({
      enabled: true,
      sex: 1,
    });
  },
});

const getDrawerTitle = computed(() => {
  return isEdit.value
    ? $t('ui.actionTitle.edit', [$t('system.user.name')])
    : $t('ui.actionTitle.create', [$t('system.user.name')]);
});
</script>

<template>
  <Drawer class="w-full max-w-[720px]" :title="getDrawerTitle">
    <Form class="mx-4" />
  </Drawer>
</template>
