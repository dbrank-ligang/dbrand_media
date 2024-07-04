<template>
  <div class="mediaSearchBox">
    <el-autocomplete
      v-model="inputValue"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      clearable
      style="width: 800px; height: 50px; margin-top: 10%"
      placeholder="请一次输入一个媒体类别或圈层类别，限5个字以内。"
      @select="handleSelect"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    >
      <template #append><div>搜索</div></template>
    </el-autocomplete>

    <div class="hoistryBox">
      <div class="listTit">搜索历史</div>
      <div class="listCon">
        <div v-for="item in historyListData" :key="item.mediaId" @click="historyChange(item.mediaId)">{{ item.mediaName }}</div>
      </div>
    </div>
    <div class="hoistryBox">
      <div class="listTit">标签推荐</div>
      <div class="listCon">
        <div v-for="item in tagListData" :key="item.mediaId" @click="historyChange(item.mediaId)">{{ item.mediaName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="mediaSearch">
import { ref } from "vue";

const inputValue = ref("");
const historyListData = ref([
  { mediaId: 11, mediaName: "第一财经" },
  { mediaId: 22, mediaName: "第二财经" },
  { mediaId: 11, mediaName: "第一财经" },
  { mediaId: 22, mediaName: "第二财经" },
  { mediaId: 11, mediaName: "第一财经" },
  { mediaId: 22, mediaName: "第二财经" },
  { mediaId: 11, mediaName: "第一财经" },
  { mediaId: 22, mediaName: "第二财经" },
  { mediaId: 11, mediaName: "第一财经" },
  { mediaId: 22, mediaName: "第二财经" },
  { mediaId: 11, mediaName: "第一财经" },
  { mediaId: 22, mediaName: "第二财经" },
  { mediaId: 11, mediaName: "第一财经" },
  { mediaId: 22, mediaName: "第二财经" },
  { mediaId: 11, mediaName: "第一财经" },
  { mediaId: 22, mediaName: "第二财经" }
]);
const tagListData = ref([
  { mediaId: 11, mediaName: "第一财经" },
  { mediaId: 22, mediaName: "第二财经" }
]);
interface RestaurantItem {
  value: string;
  link: string;
}
const loadAll = () => {
  return [
    { value: "vue", link: "https://github.com/vuejs/vue" },
    { value: "element", link: "https://github.com/ElemeFE/element" },
    { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
    { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "vuex", link: "https://github.com/vuejs/vuex" },
    { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
    { value: "babel", link: "https://github.com/babel/babel" }
  ];
};
const historyChange = mediaId => {
  console.log(mediaId);
  // router.replace(MEDIADETAIL_URL);
};

//  input搜索逻辑------------
const handleInputConfirm = () => {
  console.log(inputValue.value);
  if (inputValue.value) {
  }
};
const restaurants = ref<RestaurantItem[]>([]);
const querySearch = (queryString: string, cb: any) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value;
  // call callback function to return suggestions
  cb(results);
};
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};

const handleSelect = (item: Record<string, any>) => {
  console.log("input框的值", item);
};
restaurants.value = loadAll();
// --------------------搜索逻辑----------------------------
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
