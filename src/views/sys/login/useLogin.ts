import type { NamePath } from 'ant-design-vue/lib/form/interface'
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

  return { getLoginState, setLoginState }
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

export function useFormRules() {
  const { t } = useI18n()

  const getAccountFormRule = computed(() => createRule(t('sys.login.accountPlaceholder')))
  const getPasswordFormRule = computed(() => createRule(t('sys.login.passwordPlaceholder')))

  const getFormRules = computed((): { [k: string]: object | object[] } => {
    const accountFormRule = unref(getAccountFormRule)
    const passwordFormRule = unref(getPasswordFormRule)

    switch (unref(cuurentState)) {
      case LoginStateEnum.REGISTER:
        return {
          account: accountFormRule,
          password: passwordFormRule,
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
