import { computed, ref } from 'vue'

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
