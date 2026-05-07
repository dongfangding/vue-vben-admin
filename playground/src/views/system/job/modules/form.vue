<script lang="ts" setup>
import type { SystemJobApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { persistJob } from '#/api';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemJobApi.SystemJob>();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    drawerApi.lock();
    try {
      const values = await formApi.getValues<SystemJobApi.SystemJob>();
      await persistJob({
        ...formData.value,
        ...values,
      });
      drawerApi.close();
      emit('success');
    } finally {
      drawerApi.unlock();
    }
  },
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }

    formData.value = drawerApi.getData<SystemJobApi.SystemJob>();
    formApi.resetForm();
    formApi.setValues(formData.value || { enabled: true, sort: 0 });
  },
});

const getTitle = computed(() =>
  formData.value?.jobId ? '编辑岗位' : '新增岗位',
);
</script>

<template>
  <Drawer class="w-full max-w-[560px]" :title="getTitle">
    <Form class="mx-4" />
  </Drawer>
</template>
