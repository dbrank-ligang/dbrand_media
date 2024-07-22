<!-- 经典布局 -->
<template>
  <el-container class="layout">
    <el-header style="border-bottom: 1px solid #eee">
      <div class="header-lf mask-image">
        <div class="logo flx-center">
          <img class="logo-img" src="@/assets/images/logo.png" alt="logo" />
        </div>
      </div>

      <div class="header-ri">
        token：<el-select
          v-model="value"
          style="width: 200px; margin-right: 10px"
          placeholder="选择token"
          size="small"
          @change="changeToken"
        >
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        媒体/账号查询<el-autocomplete
          v-model="inputValue"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          clearable
          style="width: 300px; margin-left: 10px"
          placeholder=""
          @select="handleSelect"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
          value-key="mediaName"
        >
          <template #append><div>搜索</div></template>
        </el-autocomplete>
        <el-dropdown trigger="click" style="margin-left: 30px">
          <span class="el-dropdown-link">
            切换品牌<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in userInfo.brands" :key="item.brandId" @click="handleBrand(item)">{{
                item.brandName
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div style="margin-left: 30px">{{ userInfo.name }}</div>
        <div style="margin-left: 30px" @click="logout">
          <a style="color: #000; text-decoration: none" href="https://dbrank.net/login">退出登录</a>
        </div>
      </div>
    </el-header>
    <el-container class="classic-content">
      <el-aside>
        <div class="aside-box" style="width: 146px">
          <el-scrollbar height="100%">
            <el-menu :router="false" :default-active="activeMenu" :unique-opened="accordion" :collapse-transition="false">
              <SubMenu :menu-list="menuList" />
            </el-menu>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-container class="classic-main">
        <Main />
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="layoutClassic">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
import { useGlobalStore } from "@/stores/modules/global";
import Main from "@/layouts/components/Main/index.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";
import { useUserStore } from "@/stores/modules/user";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import router from "@/routers";
import { MEDIADETAIL } from "@/config";
import { searchMediaApi, userInfoApi } from "@/api/modules/media";

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const accordion = computed(() => globalStore.accordion);
const menuList = computed(() => authStore.showMenuListGet);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
const userStore = useUserStore();
const currBrandStore = useCurrBrandStore();
const userInfo: any = computed(() => userStore.userInfo);
const inputValue = ref("");

const value = ref("");

const options = [
  {
    value: "aaaaaa111111",
    label: "一个品牌aaaaaa111111"
  },
  {
    value: "bbbbbb222222",
    label: "非会员bbbbbb222222"
  },
  {
    value: "cccccc",
    label: "多个品牌cccccc"
  }
];

//  input搜索逻辑------------
const handleInputConfirm = () => {
  console.log(inputValue.value);
  if (inputValue.value) {
  }
};
const querySearch = async (queryString: string, cb: any) => {
  const { data } = await searchMediaApi({ keyword: queryString });
  cb(data);
};
// --------------------搜索逻辑----------------------------

// 跳转详情页方法
function jumpDetail(urlQuery: any) {
  let routerUrl = router.resolve({
    path: MEDIADETAIL,
    query: {
      ...urlQuery
    }
  });
  window.open(routerUrl.href, "_blank");
  inputValue.value = "";
}

// 搜索选中后跳转
const handleSelect = (item: Record<string, any>) => {
  console.log("input框的值", item);
  jumpDetail(item);
};
const handleBrand = (item: any) => {
  currBrandStore.setCurrBrandObj(item);
};
const logout = () => {
  // 2.清除 Token
  userStore.setToken("");
  userStore.setUserInfo("");
};

// 查询个人信息
const getUserInfoObj = async () => {
  const { data } = await userInfoApi();
  // userInfoObj.value = data as any;
  userStore.setUserInfo(data);
  currBrandStore.setCurrBrandObj((data as any).brands[0]);
};

const changeToken = value => {
  console.log(value);
  userStore.setToken(value);
};

// 使用watch来观察store中的token状态
// 监听store中的token值
watch(
  () => userStore.token,
  (newValue, oldValue) => {
    // 当token值变化时，会执行这里的代码
    console.log(`Counter changed from ${oldValue} to ${newValue}!`);
    if (newValue !== oldValue) {
      // onBrandChange()
      getUserInfoObj();
    }
  }
);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
