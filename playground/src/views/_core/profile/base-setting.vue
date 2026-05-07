<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

import { computed, onMounted, ref } from 'vue';

import { ProfileBaseSetting } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { getUserProfileApi, updateUserProfileApi } from '#/api';
import { useAuthStore } from '#/store';

const profileBaseSettingRef = ref<any>();
const userStore = useUserStore();
const authStore = useAuthStore();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'username',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      label: '登录账号',
    },
    {
      fieldName: 'nickname',
      component: 'Input',
      label: '用户昵称',
      rules: 'required',
    },
    {
      fieldName: 'email',
      component: 'Input',
      label: '邮箱',
    },
    {
      fieldName: 'mobile',
      component: 'Input',
      label: '手机号',
    },
    {
      fieldName: 'avatar',
      component: 'Input',
      label: '头像地址',
    },
    {
      fieldName: 'sex',
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: [
          { label: '女', value: 0 },
          { label: '男', value: 1 },
        ],
      },
      label: '性别',
      defaultValue: 1,
    },
  ];
});

onMounted(async () => {
  await loadProfile();
});

async function loadProfile() {
  const data = await getUserProfileApi();
  profileBaseSettingRef.value?.getFormApi().setValues(data);
}

async function handleSubmit(values: Record<string, any>) {
  const payload = {
    avatar: values.avatar || '',
    email: values.email || '',
    mobile: values.mobile || '',
    nickname: values.nickname,
    sex: values.sex,
  };

  await updateUserProfileApi(payload);
  await authStore.fetchUserInfo();
  message.success('个人资料已更新');
  userStore.setUserInfo({
    ...(userStore.userInfo || {}),
    avatar: payload.avatar,
    email: payload.email,
    mobile: payload.mobile,
    nickname: payload.nickname,
    sex: payload.sex,
    userId: userStore.userInfo?.userId || '',
    username: userStore.userInfo?.username || '',
  });
  await loadProfile();
}
</script>

<template>
  <ProfileBaseSetting
    ref="profileBaseSettingRef"
    :form-schema="formSchema"
    @submit="handleSubmit"
  />
</template>
