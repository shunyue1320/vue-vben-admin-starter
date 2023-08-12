import type { NamePath, RuleObject } from 'ant-design-vue/lib/form/interface'
import { Ref, computed, ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { FormInstance } from 'ant-design-vue'

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

const cuurentState = ref(LoginStateEnum.LOGIN)

export function useLoginState() {
  const getLoginState = computed(() => cuurentState.value)

  function setLoginState(state: LoginStateEnum) {
    cuurentState.value = state
  }

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN)
  }

  return { getLoginState, setLoginState, handleBackLogin }
}

export function useFormValid<T extends Object = any>(formRef: Ref<FormInstance>) {
  const validate = computed(() => {
    const form = unref(formRef)
    return form?.validate ?? ((_nameList?: NamePath) => Promise.resolve())
  })

  async function validForm() {
    const form = unref(formRef)
    if (!form) return
    const data = await form.validate()
    return data as T
  }

  return { validate, validForm }
}

export function useFormRules(formData?: Recordable) {
  const { t } = useI18n()

  const getAccountFormRule = computed(() => createRule(t('sys.login.accountPlaceholder')))
  const getPasswordFormRule = computed(() => createRule(t('sys.login.passwordPlaceholder')))
  const getSmsFormRule = computed(() => createRule(t('sys.login.smsPlaceholder')))
  const getMobileFormRule = computed(() => createRule(t('sys.login.mobilePlaceholder')))

  const validatePolicy = async (_: RuleObject, value: boolean) => {
    return !value ? Promise.reject(t('sys.login.policyPlaceholder')) : Promise.resolve()
  }

  const validateConfirmPassword = (password: string) => {
    return async (_: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject(t('sys.login.passwordPlaceholder'))
      }
      if (value !== password) {
        return Promise.reject(t('sys.login.diffPwd'))
      }
      return Promise.resolve()
    }
  }

  const getFormRules = computed((): { [k: string]: object | object[] } => {
    const accountFormRule = unref(getAccountFormRule)
    const passwordFormRule = unref(getPasswordFormRule)
    const smsFormRule = unref(getSmsFormRule)
    const mobileFormRule = unref(getMobileFormRule)

    const mobileRule = {
      sms: smsFormRule,
      mobile: mobileFormRule,
    }

    switch (unref(cuurentState)) {
      case LoginStateEnum.REGISTER:
        return {
          account: accountFormRule,
          password: passwordFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          policy: [{ validator: validatePolicy, trigger: 'change' }],
          ...mobileRule,
        }

      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
        }
    }
  })

  return { getFormRules }
}

function createRule(message: string) {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ]
}
