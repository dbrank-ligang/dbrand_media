<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <SwitchDark class="dark" />
      <!-- <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.svg" alt="" />
          <h2 class="logo-text">Geeker-Admin</h2>
        </div>
        <LoginForm />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import { onMounted, ref } from "vue";
// import LoginForm from "./components/LoginForm.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { ElNotification } from "element-plus";
import { getTimeState } from "@/utils";
import { userInfoApi } from "@/api/modules/media";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
const userInfoObj = ref({});

onMounted(async () => {
  // 取token，并存下来
  userStore.setToken("aaaaaa111111");
  await initDynamicRouter();
  // 3.清空 tabs、keepAlive 数据
  tabsStore.setTabs([]);
  keepAliveStore.setKeepAliveName([]);
  getUserInfoObj();
  // 4.跳转到首页
  router.push(HOME_URL);
  ElNotification({
    title: getTimeState(),
    message: "欢迎登录",
    type: "success",
    duration: 3000
  });
});

// 查询个人信息
const getUserInfoObj = async () => {
  const { data } = await userInfoApi();
  userInfoObj.value = data as any;
  userStore.setUserInfo(data);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
