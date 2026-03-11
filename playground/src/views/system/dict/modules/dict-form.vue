<script lang="ts" setup>
import type { SystemDictApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { persistDict } from '#/api';

import { useDictFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemDictApi.SystemDict>();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useDictFormSchema(),
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
      const values = await formApi.getValues<SystemDictApi.SystemDict>();
      await persistDict({
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

    formData.value = drawerApi.getData<SystemDictApi.SystemDict>();
    formApi.resetForm();
    formApi.setValues(formData.value || {});
  },
});

const getTitle = computed(() =>
  formData.value?.dictId ? '编辑字典' : '新增字典',
);
</script>

<template>
  <Drawer class="w-full max-w-[560px]" :title="getTitle">
    <Form class="mx-4" />
  </Drawer>
</template>
