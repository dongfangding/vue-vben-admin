<script lang="ts" setup>
import type { SystemDictApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { persistDictDetail } from '#/api';

import { useDictDetailFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemDictApi.SystemDictDetail>();

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useDictDetailFormSchema(),
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
      const values = await formApi.getValues<SystemDictApi.SystemDictDetail>();
      await persistDictDetail({
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

    formData.value = drawerApi.getData<SystemDictApi.SystemDictDetail>();
    formApi.resetForm();
    formApi.setValues(formData.value || { dictSort: 0 });
  },
});

const getTitle = computed(() =>
  formData.value?.detailId ? '编辑字典明细' : '新增字典明细',
);
</script>

<template>
  <Drawer class="w-full max-w-[560px]" :title="getTitle">
    <Form class="mx-4" />
  </Drawer>
</template>
