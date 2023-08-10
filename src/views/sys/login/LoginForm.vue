<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
</template>

<script lang="ts" setup>
  import { computed, unref } from 'vue'
  import LoginFormTitle from './LoginFormTitle.vue'
  import { LoginStateEnum, useLoginState } from './useLogin'

  const { getLoginState } = useLoginState()

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
</script>
