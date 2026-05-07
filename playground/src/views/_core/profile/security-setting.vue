<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { ProfileSecuritySetting } from '@vben/common-ui';

import { getUserProfileApi } from '#/api';

const profile = ref<null | {
  email?: string;
  mobile?: string;
  username?: string;
}>(null);

const formSchema = computed(() => {
  const email = profile.value?.email || '未设置';
  const mobile = profile.value?.mobile || '未设置';

  return [
    {
      value: true,
      fieldName: 'accountPassword',
      label: '登录密码',
      description: '如怀疑密码泄露，请立即在“修改密码”页更新。',
    },
    {
      value: Boolean(profile.value?.mobile),
      fieldName: 'securityPhone',
      label: '绑定手机',
      description: `当前手机号：${mobile}`,
    },
    {
      value: Boolean(profile.value?.email),
      fieldName: 'securityEmail',
      label: '绑定邮箱',
      description: `当前邮箱：${email}`,
    },
    {
      value: true,
      fieldName: 'securityAudit',
      label: '操作审计',
      description: '个人资料修改和密码修改会写入系统操作日志。',
    },
  ];
});

onMounted(async () => {
  profile.value = await getUserProfileApi();
});
</script>

<template>
  <ProfileSecuritySetting :form-schema="formSchema" />
</template>
