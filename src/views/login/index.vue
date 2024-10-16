<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <!-- <SwitchDark class="dark" /> -->
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
// import SwitchDark from "@/components/SwitchDark/index.vue";
import { useUserStore } from "@/stores/modules/user";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
// import { ElNotification } from "element-plus";
// import { getTimeState } from "@/utils";
import { userInfoApi } from "@/api/modules/media";

const router = useRouter();
const userStore = useUserStore();
const currBrandStore = useCurrBrandStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
const userInfoObj = ref({});

onMounted(async () => {
  // ------------------ 线上获取cookie的token ------------------

  // 本地测试：获取token
  // userStore.setToken("aaaaaa111111");
  // userStore.setToken("bbbbbb222222");
  // userStore.setToken("cccccc");
  // userStore.setToken("46a18f8f163fed66685948f22c64e01e");
  // 3.清空 tabs、keepAlive 数据
  tabsStore.setTabs([]);
  keepAliveStore.setKeepAliveName([]);
  window.localStorage.clear(); // 先清除本地存储
  await getUserInfoObj(); // 获取个人信息
  await initDynamicRouter(); // 加载路由
  router.push(HOME_URL);
  // 4.跳转到首页
  // ElNotification({
  //   title: getTimeState(),
  //   message: "欢迎登录",
  //   type: "success",
  //   duration: 3000
  // });
});

// 查询个人信息
const getUserInfoObj = async () => {
  const { data } = await userInfoApi();
  userInfoObj.value = data as any;
  userStore.setUserInfo(data);
  currBrandStore.setCurrBrandObj((data as any).brands[0]);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
