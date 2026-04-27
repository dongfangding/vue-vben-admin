<script lang="ts" setup>
import type { CaptchaPoint } from '@vben/common-ui';
import { reactive, ref, watch } from 'vue';

import { $t, i18n } from '@vben/locales';

import { PointSelectionCaptcha } from '@vben/common-ui';

import { VbenButton, VbenCheckbox } from '@vben-core/shadcn-ui';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useAuthStore } from '#/store';

import {
  checkCaptchaApi,
  generateCaptchaApi,
  type CaptchaResult,
} from '#/api/core/auth';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const captchaVerified = ref(false);
const captchaLoading = ref(false);
const captchaResult = ref<CaptchaResult | null>(null);
const selectedPoints = ref<CaptchaPoint[]>([]);
const captchaVerification = ref('');
const captchaCheckUuid = ref('');

const captchaImage = ref('');
const hintText = ref('');
const captchaWidth = ref(310);
const captchaHeight = ref(155);
const captchaWordCount = ref(0);

async function loadCaptcha() {
  try {
    captchaLoading.value = true;
    const result = await generateCaptchaApi();
    captchaResult.value = result;
    captchaImage.value = result.prefix + result.originalImageBase64;
    hintText.value = result.wordList?.join(', ') ?? '';
    captchaWidth.value = result.width || 310;
    captchaHeight.value = result.height || 155;
    captchaWordCount.value = result.wordList?.length || 0;
    selectedPoints.value = [];
    captchaVerified.value = false;
    captchaVerification.value = '';
    captchaCheckUuid.value = '';
  } catch {
    message.error($t('authentication.captchaLoadFailed'));
  } finally {
    captchaLoading.value = false;
  }
}

function handleCaptchaClick(point: CaptchaPoint) {
  selectedPoints.value.push(point);
}

async function handleCaptchaConfirm(points: CaptchaPoint[], clear: () => void) {
  if (!captchaResult.value || points.length === 0) {
    message.error($t('authentication.captchaSelectRequired'));
    return;
  }
  try {
    const checkResult = await checkCaptchaApi({
      uuid: captchaResult.value.uuid,
      verifyCode: JSON.stringify(points),
      captchaType: 'CLICK_WORDS',
      verification: false,
      captchaVerification: '',
    });
    captchaVerified.value = true;
    captchaCheckUuid.value = checkResult.uuid ?? '';
    captchaVerification.value = checkResult.captchaVerification ?? '';
    message.success({
      content: $t('authentication.captchaVerified'),
      duration: 2,
    });
  } catch {
    clear();
    selectedPoints.value = [];
    captchaVerification.value = '';
    captchaCheckUuid.value = '';
    await loadCaptcha();
  }
}

async function handleCaptchaRefresh() {
  selectedPoints.value = [];
  captchaVerification.value = '';
  captchaCheckUuid.value = '';
  captchaVerified.value = false;
  await loadCaptcha();
}

const [Form, formApi] = useVbenForm(
  reactive({
    commonConfig: {
      hideLabel: true,
      hideRequiredMark: true,
    },
    schema: [
      {
        component: 'VbenInput',
        componentProps: {
          placeholder: $t('authentication.usernameTip'),
        },
        fieldName: 'username',
        label: $t('authentication.username'),
      },
      {
        component: 'VbenInputPassword',
        componentProps: {
          placeholder: $t('authentication.passwordTip'),
        },
        fieldName: 'password',
        label: $t('authentication.password'),
      },
    ],
    showDefaultActions: false,
  }),
);

function syncFormSchemaI18n() {
  formApi.updateSchema([
    {
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
    },
    {
      componentProps: {
        placeholder: $t('authentication.passwordTip'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
    },
  ]);
}

watch(
  () => i18n.global.locale.value,
  () => {
    syncFormSchemaI18n();
  },
  { immediate: true },
);

const REMEMBER_ME_KEY = 'REMEMBER_ME_USERNAME_' + location.hostname;
const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || '';
const rememberMe = ref(!!localUsername);

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (!valid) return;

  if (!captchaVerified.value || !captchaResult.value) {
    message.error($t('authentication.verifyRequiredTip'));
    await loadCaptcha();
    return;
  }

  localStorage.setItem(
    REMEMBER_ME_KEY,
    rememberMe.value ? values?.username : '',
  );

  const loginParams = {
    ...values,
    uuid: captchaCheckUuid.value || captchaResult.value.uuid,
    code: JSON.stringify(selectedPoints.value),
    captchaVerification: captchaVerification.value,
  };

  authStore.authLogin(loginParams).catch(async () => {
    captchaVerified.value = false;
    captchaVerification.value = '';
    captchaCheckUuid.value = '';
    await loadCaptcha();
  });
}

loadCaptcha();

if (localUsername) {
  formApi.setFieldValue('username', localUsername);
}
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md" @keydown.enter.prevent="handleSubmit">
    <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="text-foreground mb-3 text-3xl font-bold leading-9 tracking-tight lg:text-4xl"
      >
        {{ $t('authentication.welcomeBack') }}
      </h2>
      <p class="text-muted-foreground lg:text-md text-sm">
        {{ $t('authentication.loginSubtitle') }}
      </p>
    </div>

    <Form />

    <div class="mb-4 mt-4">
      <div class="mb-2 text-sm font-medium">{{ $t('ui.captcha.title') }}</div>
      <div class="flex flex-col items-start gap-4">
        <PointSelectionCaptcha
          v-if="captchaImage"
          :auto-confirm-count="captchaWordCount"
          :captcha-image="captchaImage"
          :height="captchaHeight"
          :hint-text="hintText"
          :padding-x="'12px'"
          :padding-y="'16px'"
          :show-confirm="false"
          :width="captchaWidth"
          @click="handleCaptchaClick"
          @confirm="handleCaptchaConfirm"
          @refresh="handleCaptchaRefresh"
        >
          <template #title>
            <span class="text-sm">{{ $t('authentication.captchaInstruction') }}</span>
          </template>
        </PointSelectionCaptcha>
      </div>
    </div>

    <div class="mb-6 flex justify-between">
      <div class="flex-center">
        <VbenCheckbox v-model="rememberMe" name="rememberMe">
          {{ $t('authentication.rememberMe') }}
        </VbenCheckbox>
      </div>
    </div>

    <VbenButton
      :class="{ 'cursor-wait': authStore.loginLoading }"
      :loading="authStore.loginLoading"
      class="w-full"
      @click="handleSubmit"
    >
      {{ $t('common.login') }}
    </VbenButton>
  </div>
</template>
