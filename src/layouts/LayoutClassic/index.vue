<!-- 经典布局 -->
<template>
  <el-container class="layout">
    <el-header>
      <div class="header-lf mask-image">
        <div class="logo flx-center">
          <img class="logo-img" src="@/assets/images/logo.png" alt="logo" />
        </div>
      </div>
      <div class="header-ri">
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
        <div style="margin-left: 30px">退出登录</div>
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
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
import { useGlobalStore } from "@/stores/modules/global";
import Main from "@/layouts/components/Main/index.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";
import { useUserStore } from "@/stores/modules/user";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import router from "@/routers";
import { MEDIADETAIL } from "@/config";
import { searchMediaApi } from "@/api/modules/media";

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
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
