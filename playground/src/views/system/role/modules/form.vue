<script lang="ts" setup>
import type { SystemRoleApi } from '#/api/system/role';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createRole, updateRole } from '#/api/system/role';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<SystemRoleApi.SystemRole>();
const roleId = ref<number>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const values = await formApi.getValues();
    drawerApi.lock();
    try {
      await (roleId.value
        ? updateRole(roleId.value, values)
        : createRole(values));
      emits('success');
      drawerApi.close();
    } finally {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }

    const data = drawerApi.getData<SystemRoleApi.SystemRole>();
    formApi.resetForm();
    if (data) {
      formData.value = data;
      roleId.value = data.roleId;
      await nextTick();
      formApi.setValues({
        description: data.description,
        enabled: data.enabled,
        ipLimit: data.ipLimit,
        level: data.level,
        name: data.name,
        sort: data.sort,
      });
      return;
    }

    roleId.value = undefined;
    formData.value = undefined;
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.roleId
    ? $t('ui.actionTitle.edit', [$t('system.role.name')])
    : $t('ui.actionTitle.create', [$t('system.role.name')]);
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
