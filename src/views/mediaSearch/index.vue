<template>
  <div class="mediaSearchBox">
    <el-autocomplete
      v-model="inputValue"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      clearable
      style="width: 800px; height: 50px; margin-top: 10%"
      placeholder=""
      @select="handleSelect"
      @keyup.enter="handleSearch"
      value-key="showText"
    >
      <template #append><div @click="handleSearch" style="cursor: pointer">搜索</div></template>
    </el-autocomplete>

    <div class="hoistryBox">
      <div class="listTit">搜索历史</div>
      <div class="listCon">
        <div v-for="item in historyListData" :key="item.mediaId" @click="historyChange(item)">
          <span>{{ item.showText }}</span>
        </div>
      </div>
    </div>
    <div class="hoistryBox">
      <div class="listTit">搜索推荐</div>
      <div class="listCon">
        <div v-for="item in tagListData" :key="item.mediaId" @click="historyChange(item)">
          <span>{{ item.mediaName }}</span>
        </div>
      </div>
    </div>
    <div style="width: 100%; position: absolute; bottom: 0">
      <BottomNav></BottomNav>
    </div>
  </div>
</template>

<script setup lang="ts" name="mediaSearch">
import { onMounted, ref } from "vue";
import { searchMediaApi, searchMediaHistoryApi, addMediaHistoryApi, dictListJsonApi, mediaNavApi } from "@/api/modules/media";
import router from "@/routers";
import BottomNav from "./../components/BottomNav/index.vue";
import { MEDIADETAIL } from "@/config";
import { ElNotification } from "element-plus";
import { addMediaNotExist } from "@/utils";

const inputValue = ref("");
const searchData = ref([] as any);
const historyListData = ref([] as any); // 搜索历史列表
const tagListData = ref([] as any);
const historyChange = item => {
  // jumpDetail({ mediaId: item.mediaId, subUnionId: item.subUnionId, accountName: item.accountName });
  getMediaNavApi({ mediaId: item.mediaId, subUnionId: item.subUnionId, accountName: item.accountName, platform: item.platform });
};
// 获取搜索历史列表
const getSearchMediaHistory = async () => {
  const { data } = await searchMediaHistoryApi();
  historyListData.value = data as any;
};
// 获取搜索历史列表
const getDictListJson = async () => {
  const { data } = await dictListJsonApi();
  tagListData.value = data as any;
};
// 添加搜索历史
const getAddMediaHistory = async (params: any) => {
  addMediaHistoryApi(params);
  getSearchMediaHistory();
};

// --------------------搜索逻辑----------------------------

const querySearch = async (queryString: string, cb: any) => {
  const { data } = await searchMediaApi({ keyword: queryString });
  searchData.value = data;
  cb(data);
};

// 跳转详情页时：
// 第一步：先判断搜索的内容是否存在搜索历史中，若存在不进行添加
// 第二部：进行跳转；
function jumpDetail(urlQuery: any) {
  const isHaveMediaId = historyListData.value.some(items => items.showText === urlQuery.showText);
  if (!isHaveMediaId) {
    getAddMediaHistory(urlQuery);
  }
  let routerUrl = router.resolve({
    path: MEDIADETAIL,
    query: {
      ...urlQuery
    }
  });
  window.open(routerUrl.href, "_blank");
  inputValue.value = "";
  // searchData.value = []; //没用
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

// 选中后跳转
const handleSelect = (item: Record<string, any>) => {
  getMediaNavApi(item); //跳转详情页
};
// 点击搜索后:
// 若检索数据为空，则弹框提示;
// 若有检索数据，则直接跳转对应第一个媒体;
const handleSearch = () => {
  console.log("搜索数据的长度", searchData.value);
  if (searchData.value.length > 0) {
    getMediaNavApi(searchData.value[0]); //跳转详情页
  } else {
    // 保存未搜索到的媒体
    addMediaNotExist(inputValue.value);
    // 4.跳转到首页
    ElNotification({
      // title: "提示",
      message: "抱歉，您输入的媒体/账号名称不准确或未被收录",
      type: "warning",
      duration: 9000,
      offset: 80
    });
  }
};
onMounted(() => {
  getSearchMediaHistory();
  getDictListJson();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
