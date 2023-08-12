<template>
  <div :class="prefixCls">
    <LoginFormTitle v-show="getShow" class="enter-x" />
    <Form
      class="p-4 enter-x"
      :model="formData"
      :rules="getFormRules"
      ref="formRef"
      v-show="getShow"
      @keypress.enter="handleLogin"
    >
      <FormItem name="account" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.account"
          :placeholder="t('sys.login.userName')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>

      <Row class="enter-x">
        <Col :span="12">
          <FormItem>
            <Checkbox v-model:checked="rememberMe" />
            {{ t('sys.login.rememberMe') }}
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem class="text-right">
            <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
              {{ t('sys.login.forgetPassword') }}
            </Button>
          </FormItem>
        </Col>
      </Row>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
      </FormItem>

      <Row class="enter-x" :gutter="[16, 16]">
        <Col :md="8" :xs="24">
          <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
            {{ t('sys.login.mobileSignInFormTitle') }}
          </Button>
        </Col>
        <Col :md="8" :xs="24">
          <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
            {{ t('sys.login.qrSignInFormTitle') }}
          </Button>
        </Col>
        <Col :md="8" :xs="24">
          <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
            {{ t('sys.login.registerButton') }}
          </Button>
        </Col>
      </Row>

      <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

      <div
        class="flex justify-evenly enter-x text-6 text-gray-5"
        :class="`${prefixCls}-sign-in-way`"
      >
        <GithubFilled />
        <WechatFilled />
        <AlipayCircleFilled />
        <GoogleCircleFilled />
        <TwitterCircleFilled />
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, unref } from 'vue'
  import { Form, Input, Button, Col, Row, Checkbox, Divider } from 'ant-design-vue'
  import {
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  } from '@ant-design/icons-vue'
  import LoginFormTitle from './LoginFormTitle.vue'
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin'
  import { useI18n } from '@/hooks/web/useI18n'
  import { useUserStore } from '@/store/modules/user'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useDesign } from '@/hooks/web/useDesign'

  const FormItem = Form.Item
  const InputPassword = Input.Password

  const { prefixCls } = useDesign('login-form')
  const { t } = useI18n()
  const userStore = useUserStore()
  const { notification, createErrorModal } = useMessage()

  const { getFormRules } = useFormRules()
  const { setLoginState, getLoginState } = useLoginState()

  const formRef = ref()
  const loading = ref(false)
  const rememberMe = ref(false)

  const formData = reactive({
    account: 'vben',
    password: '123456',
  })

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

  const { validForm } = useFormValid(formRef)

  async function handleLogin() {
    const data = await validForm()
    if (!data) {
      return
    }

    try {
      loading.value = true
      const userInfo = await userStore.login({
        password: data.password,
        username: data.account,
        mode: 'none', //不要默认的错误提示
      })
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
          duration: 3,
        })
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      })
    } finally {
      loading.value = false
    }
  }
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-login-form';

  .@{prefix-cls} {
    &-sign-in-way {
      .anticon {
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    .ant-divider-inner-text {
      color: @text-color-secondary;
      font-size: 12px;
    }
  }
</style>
