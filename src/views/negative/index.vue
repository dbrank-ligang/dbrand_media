<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div class="negative">
    <!-- 头部筛选条件 -->
    <header class="header_box">
      <div class="header_box_left">
        品牌名称：<span> {{ currBrandStore.currBrandObj.brandName }}</span>
      </div>
      <div class="header_box_right">
        <div>
          时间范围：
          <el-date-picker
            v-model="dateArr"
            width="200px"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="X"
            @change="changeTime"
          />
        </div>
      </div>
    </header>
    <!-- 正常数据 -->
    <div class="overview">
      <div class="overview_tit">媒体关注度总览</div>
      <div class="overview_numberBox overview_numberBox_1">
        <div class="overview_number" v-for="(item, i) in numlabelArr" :key="item">
          <div :class="['media_attention', `bg-${i}`]">
            <div>{{ attentionlabelArr[i] }}</div>
            <div>{{ numFilter(overviewList?.percent[i]) }}</div>
          </div>
          <div class="media_num">{{ item }}：{{ overviewList?.num[i] }}</div>
          <div class="media_dec">{{ decArr[i] }}</div>
          <div class="media_position">行业内排位：No.{{ overviewList?.order[i] }}</div>
          <div class="media_rank">
            <div>排名详情：</div>
            <div>
              <div v-for="(orderItem, index) in overviewList?.orderList[i]" :key="orderItem">
                0{{ index + 1 }} {{ orderItem }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CoverageMap :mediaData="mediaData" :dateArr="dateArr" />
    <BottomNav></BottomNav>
  </div>
</template>

<script setup lang="ts" name="home">
// export default {

// }
import { ref, onMounted, onUnmounted, watch } from "vue";
import CoverageMap from "./../components/CoverageMap/index.vue";
import BottomNav from "./../components/BottomNav/index.vue";
// import moment from "moment";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import { fugaituApi, overviewApi } from "@/api/modules/media";
import { numFilter } from "@/utils/parseFloat";
import { useRoute } from "vue-router";
const route = useRoute();
const currBrandStore = useCurrBrandStore();
let dateArr = ref([] as any); // 时间范围
const mediaData = ref({} as any); // 覆盖图数据
const paramsObj = ref({
  brandId: currBrandStore.currBrandObj.brandId, //品牌id                               必填
  type: "negative", //all 非负；negative 负面；                选填，不填，后端按非负查询
  startTime: dateArr.value[0], // 开始时间                            必填
  endTime: dateArr.value[1], // 结束时间                              必填
  compareStartTime: null, //对比开始时间                 选填
  compareEndTime: null, //对比结束时间
  compareBrandId: null // 对比品牌id,多个逗分割，最多两个  选填
} as any);
const numlabelArr = ["头部媒体触达数量", "正向曝光媒体数", "负向曝光媒体数", "整体媒体触达数量"];
const attentionlabelArr = ["头部媒体覆盖度", "正向媒体关注度", "负向媒体关注度", "整体媒体关注度"];
const decArr = [
  "（在以下各类别传统媒体/资讯网媒/自媒体TOP10中，在本时段内报道本品牌的内容为正面/中性的数量）",
  "（在本时段内，有关本品牌内容为正面/中性的传统媒体/资讯网媒/自媒体的合计数量。）",
  "（在本时段内，有关本品牌内容为负面的传统媒体/资讯网媒/自媒体的合计数量。）",
  "（在本时段内，有关本品牌所有内容的传统媒体/资讯网媒/自媒体的合计数量。）"
];
// 概览数据
const overviewList = ref({
  num: [],
  percent: [],
  order: [],
  orderList: []
} as any);

// 时间搜索
const changeTime = () => {
  paramsObj.value = {
    ...paramsObj.value,
    startTime: dateArr.value[0],
    endTime: dateArr.value[1]
  };
  getOverview({
    startTime: dateArr.value[0],
    endTime: dateArr.value[1]
  });
  getFugaitu({ ...paramsObj.value });
};

// 获取概览数据
const getOverview = async (params: any) => {
  const { data } = await overviewApi({
    ...params,
    brandId: currBrandStore.currBrandObj.brandId
  });
  console.log(data);
  overviewList.value = data;
};

// 获取覆盖图数据
const getFugaitu = async (params: any) => {
  const { data } = await fugaituApi({
    ...params,
    brandId: currBrandStore.currBrandObj.brandId
  });
  console.log(data);
  mediaData.value = data as any;
};

// 监听每个滚动区域的滚动事件
onMounted(() => {
  const urlParams = route.query;
  dateArr.value = [urlParams.startTime, urlParams.endTime];
  paramsObj.value = {
    ...paramsObj.value,
    startTime: urlParams.startTime,
    endTime: urlParams.endTime
  };
  getOverview({ ...paramsObj.value });
  getFugaitu({ ...paramsObj.value });
});

onUnmounted(() => {
  console.log(123);
});

// 使用watch来观察store中的currBrandObj状态
// 监听store中的brandId值
watch(
  () => currBrandStore.currBrandObj.brandId,
  (newValue, oldValue) => {
    // 当brandId值变化时，会执行这里的代码
    console.log(`Counter changed from ${oldValue} to ${newValue}!`);
    if (newValue !== oldValue) {
      onBrandChange();
    }
  }
);
// 监听store中选择的品牌
function onBrandChange() {
  console.log("切换了brandId!");
  getOverview({ ...paramsObj.value });
  getFugaitu({ ...paramsObj.value });
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
