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
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
      value-key="showText"
    >
      <template #append><div>搜索</div></template>
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
      <div class="listTit">标签推荐</div>
      <div class="listCon">
        <div v-for="item in tagListData" :key="item.mediaId" @click="historyChange(item)">
          <span>{{ item.mediaName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="mediaSearch">
import { onMounted, ref } from "vue";
import { searchMediaApi, searchMediaHistoryApi, addMediaHistoryApi, dictListJsonApi } from "@/api/modules/media";
import router from "@/routers";
import { MEDIADETAIL } from "@/config";

const inputValue = ref("");
const historyListData = ref([] as any); // 搜索历史列表
const tagListData = ref([] as any);
const historyChange = item => {
  jumpDetail({ mediaId: item.mediaId, subUnionId: item.subUnionId, accountName: item.accountName });
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

// 选中后跳转
const handleSelect = (item: Record<string, any>) => {
  // 搜索的媒体是否存在搜索历史中， 存在不进行添加
  const isHaveMediaId = historyListData.value.some(items => items.showText === item.showText);
  if (!isHaveMediaId) {
    getAddMediaHistory(item);
  }
  jumpDetail(item);
};
onMounted(() => {
  getSearchMediaHistory();
  getDictListJson();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
