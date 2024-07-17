<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div class="home">
    <!-- 头部筛选条件 -->
    <header class="header_box">
      <div class="header_box_left">
        品牌名称：<span class="tiopBg red"></span> <span> {{ currBrandStore.currBrandObj.brandName }}</span>
        <div style="display: inline-block; margin-left: 10px">
          Vs.<span class="tiopBg yellow" style="margin-left: 10px"></span>
          <el-select
            v-model="competitorBrandId"
            class="m-2"
            placeholder="请选择"
            clearable
            style="width: 120px; margin-left: 10px"
            @change="changeCompetitorBrand"
          >
            <el-option
              v-for="item in currBrandStore.currBrandObj.competitor"
              :key="item.competitorBrandId"
              :label="item.competitorBrandName"
              :value="item.competitorBrandId"
            />
          </el-select>
          Vs.<span class="tiopBg blue" style="margin-left: 10px"></span>
          <el-select
            v-model="competitorBrandId2"
            class="m-2"
            placeholder="请选择"
            clearable
            style="width: 120px; margin-left: 10px"
            @change="changeCompetitorBrand2"
          >
            <el-option
              v-for="item in currBrandStore.currBrandObj.competitor"
              :key="item.competitorBrandId"
              :label="item.competitorBrandName"
              :value="item.competitorBrandId"
            />
          </el-select>
        </div>
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
            :default-time="[dateStart, dateEnd]"
          />
        </div>
      </div>
    </header>
    <!-- 正常数据 -->
    <div class="overview">
      <div class="overview_tit">媒体关注度总览</div>
      <div class="overview_numberBox overview_numberBox_1">
        <div class="overview_number" v-for="(item, i) in numlabelArr" :key="item">
          <!-- <div class="media_num">{{ item }}：{{ overviewList?.num[i] }}</div> -->
          <!-- <div class="media_attention">{{ attentionlabelArr[i] }}：{{ overviewList?.percent[i] }} %</div>
          <div class="media_position">行业内排位：{{ overviewList?.order[i] }}</div> -->
          <div class="media_rank">
            <div>
              {{ item }}：
              <div class="media_dec">{{ decArr[i] }}</div>
            </div>
            <div>
              <div v-for="numItem in overviewList?.num[i]" :key="numItem">{{ numItem }}</div>
            </div>
          </div>
          <!-- <div class="media_dec">{{ decArr[i] }}</div> -->
          <div class="media_rank">
            <div>{{ attentionlabelArr[i] }}：</div>
            <div>
              <div v-for="percentItem in overviewList?.percent[i]" :key="percentItem">
                {{ numFilter(percentItem) }}
              </div>
            </div>
          </div>
          <div class="media_rank">
            <div>排名详情：</div>
            <div>
              <div v-for="orderItem in overviewList?.orderList[i]" :key="orderItem">
                {{ orderItem }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CoverageMap :mediaData="mediaData" />
  </div>
</template>

<script setup lang="ts" name="home">
// export default {

// }
import { ref, onMounted, onBeforeMount } from "vue";
import CoverageMap from "./../components/CoverageMap/index.vue";
import moment from "moment";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import { fugaituApi, overviewApi } from "@/api/modules/media";
import { numFilter } from "@/utils/parseFloat";

const currBrandStore = useCurrBrandStore();
// 获取上周周一
const dateStart = moment().subtract(1, "week").startOf("week").add(1, "day").format("X");
// 获取上周周日
const dateEnd = moment().subtract(1, "week").endOf("week").add(1, "day").format("X");
let dateArr = ref([dateStart, dateEnd]); // 时间范围
let competitorBrandId = ref(null); // 对比品牌
let competitorBrandId2 = ref(null); // 对比品牌
const competitorBrandIdArr = ref([competitorBrandId.value, competitorBrandId2.value]);

// const mediaData = ref(dataJson); // 覆盖图数据
const mediaData = ref({} as any); // 覆盖图数据
const paramsObj = ref({
  brandId: currBrandStore.currBrandObj.brandId, //品牌id                               必填
  type: null, //all 非负；negative 负面；                选填，不填，后端按非负查询
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
  "（在本时段内，有关本品牌内容为正面/中性的传统媒体/资讯网媒/自媒体的合计数量。不含个人KOL）",
  "（在本时段内，有关本品牌内容为负面的传统媒体/资讯网媒/自媒体的合计数量。不含个人KOL）",
  "（在本时段内，有关本品牌所有内容的传统媒体/资讯网媒/自媒体的合计数量。不含个人KOL）"
];
// 概览数据

const overviewList = ref({
  num: [
    [10, 10, 10],
    [5, 5, 5],
    [5, 5, 5],
    [10, 10, 10]
  ],
  percent: [
    [0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5]
  ],
  order: [
    [3, 2, 2],
    [3, 2, 2],
    [3, 2, 2],
    [3, 2, 2]
  ],
  orderList: [
    ["海尔No1", "海信No2", "格力No4"],
    ["海尔", "海信", "格力"],
    ["海尔", "海信", "格力"],
    ["海尔", "海信", "格力"]
  ]
});
// const overviewList = ref({
//   num: [],
//   percent: [],
//   order: [],
//   orderList: []
// } as any);

// 競品下拉框 change事件
const changeCompetitorBrand = value => {
  if (value) {
    competitorBrandId.value = value;
    competitorBrandIdArr.value[0] = competitorBrandId.value;
    console.log(competitorBrandIdArr.value);
    // paramsObj.value = {
    //   ...paramsObj.value,
    //   compareBrandId: competitorBrandIdArr.value
    // };
    getOverview({
      ...paramsObj.value,
      compareBrandId: competitorBrandIdArr.value.join(","),
      brandId: currBrandStore.currBrandObj.brandId
    });
    getFugaitu({
      ...paramsObj.value,
      compareBrandId: competitorBrandIdArr.value.join(","),
      type: "all"
    });
  }
};
const changeCompetitorBrand2 = value => {
  if (value) {
    competitorBrandId2.value = value;
    competitorBrandIdArr.value[1] = competitorBrandId2.value;
    console.log(competitorBrandIdArr.value);
    // paramsObj.value = {
    //   ...paramsObj.value,
    //   compareBrandId: competitorBrandIdArr.value
    // };
    getOverview({
      ...paramsObj.value,
      compareBrandId: competitorBrandIdArr.value,
      brandId: currBrandStore.currBrandObj.brandId
    });
    getFugaitu({
      ...paramsObj.value,
      compareBrandId: competitorBrandIdArr.value,
      type: "all"
    });
  }
};

// 时间搜索
const changeTime = () => {
  console.log(dateArr.value[0]); // 开始时间
  console.log(dateArr.value[1]); // 结束时间
  paramsObj.value = {
    ...paramsObj.value,
    startTime: dateArr.value[0],
    endTime: dateArr.value[1]
  };
  getOverview({
    startTime: dateArr.value[0],
    endTime: dateArr.value[1]
  });
  getFugaitu({ ...paramsObj.value, type: "all" });
};

// 获取概览数据
const getOverview = async (params: any) => {
  const { data } = await overviewApi({
    ...params,
    brandId: currBrandStore.currBrandObj.brandId
  });
  console.log(data);
  // overviewList.value = data;
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

onBeforeMount(() => {
  console.log(currBrandStore.currBrandObj.brandId);
  if (currBrandStore.currBrandObj.brandId === 1) {
    return;
  }
});
// 监听每个滚动区域的滚动事件
onMounted(() => {
  // getOverview({ ...paramsObj.value });
  // getFugaitu({ ...paramsObj.value, type: "all" });
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
