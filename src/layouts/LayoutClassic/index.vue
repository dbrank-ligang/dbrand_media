<!-- 经典布局 -->
<template>
  <el-container class="layout">
    <el-header style="border-bottom: 1px solid #eee">
      <div class="header-lf mask-image">
        <div class="logo flx-center">
          <img class="logo-img" src="@/assets/images/navLogo.png" alt="logo" />
        </div>
      </div>

      <div class="header-ri">
        <el-select
          v-model="value"
          style="width: 200px; margin-right: 10px; display: none"
          placeholder="选择token"
          size="small"
          @change="changeToken"
        >
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span style="font-size: 16px">媒体/账号查询</span>
        <el-autocomplete
          v-model="inputValue"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          clearable
          style="width: 300px; margin-left: 10px"
          placeholder=""
          @select="handleSelect"
          @keyup.enter="handleSearch"
          value-key="showText"
        >
          <template #append><div @click="handleSearch" style="cursor: pointer">搜索</div></template>
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
          <a style="color: #000; text-decoration: none; cursor: pointer">退出登录</a>
        </div>
        <div style="margin-left: 30px">
          <a target="_blank" style="color: #000; text-decoration: none; cursor: pointer" href="https://dbrank.net">数榜首页</a>
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
import { mediaNavApi, searchMediaApi } from "@/api/modules/media";
import { deleteCookie, addMediaNotExist } from "@/utils";
import { ElNotification } from "element-plus";
// import { deleteCookie } from "@/utils";

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
const searchData = ref([] as any);

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

// --------------------搜索逻辑----------------------------
const querySearch = async (queryString: string, cb: any) => {
  const { data } = await searchMediaApi({ keyword: queryString });
  searchData.value = data;
  cb(data);
};
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

// 是否跳转详情（查询次数限制）
const getMediaNavApi = async (params: any) => {
  mediaNavApi(params)
    .then(res => {
      console.log(res);
      jumpDetail(params);
    })
    .catch(err => {
      console.log(err);
    });
};
// 搜索选中后跳转
const handleSelect = (item: Record<string, any>) => {
  console.log("input框的值", item);
  getMediaNavApi(item); //跳转详情页
};
const handleSearch = () => {
  // 阻止事件冒泡和默认行为
  console.log("搜索数据的长度", searchData.value);
  if (searchData.value.length > 0) {
    getMediaNavApi(searchData.value[0]); //跳转详情页
  } else {
    // 保存未搜索到的媒体
    addMediaNotExist(inputValue.value);
    // 4.跳转到首页
    ElNotification({
      title: "",
      message: "抱歉，您输入的媒体/账号名称不准确或未被收录",
      type: "warning",
      duration: 9000,
      offset: 80
    });
  }
};

const handleBrand = (item: any) => {
  currBrandStore.setCurrBrandObj(item);
};
const logout = () => {
  // 2.清除 Token
  userStore.setUserInfo("");
  // 清除localStorage
  window.localStorage.clear();
  window.localStorage.setItem("isLogin", false);
  deleteCookie("token");
  window.location.href = "https://dbrank.net";
};

const changeToken = value => {
  console.log(value);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
