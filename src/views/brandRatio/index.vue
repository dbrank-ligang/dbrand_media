<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div class="brandRatio">
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
            style="width: 120px; margin-left: 10px"
            @change="changeCompetitorBrand"
          >
            <el-option
              v-for="item in currBrandStore.currBrandObj.competitor"
              :key="item.competitorBrandId"
              :label="item.competitorBrandName"
              :value="item.competitorBrandId"
              :disabled="item.competitorBrandId == competitorBrandId2"
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
              :disabled="item.competitorBrandId == competitorBrandId"
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
            :disabledDate="disabledDateFun"
          />
        </div>
      </div>
    </header>
    <!-- 正常数据 -->
    <div class="overview">
      <div class="overview_tit">媒体关注度总览</div>
      <div class="overview_numberBox overview_numberBox_1">
        <div class="overview_number" v-for="(item, i) in numlabelArr" :key="item">
          <div class="media_rank">
            <div>
              {{ item }}：
              <div class="media_dec">{{ decArr[i] }}</div>
            </div>
            <div>
              <!-- <div v-for="orderItem in overviewList?.orderList[i]" :key="orderItem">
                {{ orderItem }}
              </div> -->
              <div v-for="(numItem, index) in overviewList?.num[i]" :key="numItem">
                {{ getContentBeforeChar(overviewList?.orderList[i][index]) }} {{ numItem }}
              </div>
            </div>
          </div>
          <!-- <div class="media_dec">{{ decArr[i] }}</div> -->
          <div class="media_rank">
            <div>{{ attentionlabelArr[i] }}：</div>
            <div>
              <div v-for="(percentItem, index) in overviewList?.percent[i]" :key="percentItem">
                {{ getContentBeforeChar(overviewList?.orderList[i][index]) }} {{ numFilter(percentItem) }}
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

    <CoverageMap :mediaData="mediaData" :dateArr="dateArr" />
    <BottomNav></BottomNav>
  </div>
</template>

<script setup lang="ts" name="home">
// export default {

// }
import { ref, onMounted, onBeforeMount, watch, provide } from "vue";
import CoverageMap from "./../components/CoverageMap/index.vue";
import BottomNav from "./../components/BottomNav/index.vue";
import moment from "moment";
// import { ElMessage } from "element-plus";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import { fugaituApi, overviewApi } from "@/api/modules/media";
import { numFilter } from "@/utils/parseFloat";
import { disabledDateFun } from "@/utils";

const currBrandStore = useCurrBrandStore();
// 获取上周周一
const dateStart = moment().subtract(1, "week").startOf("week").add(1, "day").format("X");
// 获取上周周日
const dateEnd = moment().subtract(1, "week").endOf("week").add(1, "day").format("X");
let dateArr = ref([dateStart, dateEnd]); // 时间范围
let competitorBrandId = ref(null); // 对比品牌
let competitorBrandId2 = ref(null); // 对比品牌
// const mediaData = ref(dataJson); // 覆盖图数据
const mediaData = ref([] as any); // 覆盖图数据
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

const getContentBeforeChar = str => {
  return str.split("N")[0];
};

const handleCustomCategoryClick = function () {
  let compareBrandId = competitorBrandId.value + (competitorBrandId2.value ? "," + competitorBrandId2.value : "");
  getFugaitu({
    ...paramsObj.value,
    compareBrandId: compareBrandId,
    type: "all"
  });
};
provide("handleCustomCategoryClick", handleCustomCategoryClick);

// 競品下拉框 change事件
const changeCompetitorBrand = value => {
  if (value) {
    // //限制 选择重复品牌
    // if (value === competitorBrandId2.value) {
    //   ElMessage.warning("竞品选择重复提醒");
    //   competitorBrandId.value = null;
    //   return;
    // }
    competitorBrandId.value = value;
    let compareBrandId = competitorBrandId.value + (competitorBrandId2.value ? "," + competitorBrandId2.value : "");
    paramsObj.value = {
      ...paramsObj.value,
      compareBrandId: compareBrandId
    };
    getOverview({
      ...paramsObj.value,
      compareBrandId: compareBrandId,
      brandId: currBrandStore.currBrandObj.brandId
    });
    getFugaitu({
      ...paramsObj.value,
      compareBrandId: compareBrandId,
      type: "all"
    });
  }
};
const changeCompetitorBrand2 = value => {
  console.log("第二个", value);
  // //限制 选择重复品牌
  // if (value === competitorBrandId.value) {
  //   ElMessage.warning("竞品选择重复提醒");
  //   competitorBrandId2.value = null;
  //   return;
  // }
  competitorBrandId2.value = value;
  let compareBrandId = competitorBrandId.value + (competitorBrandId2.value ? "," + competitorBrandId2.value : "");
  paramsObj.value = {
    ...paramsObj.value,
    compareBrandId: compareBrandId
  };
  getOverview({
    ...paramsObj.value,
    compareBrandId: compareBrandId,
    brandId: currBrandStore.currBrandObj.brandId
  });
  getFugaitu({
    ...paramsObj.value,
    compareBrandId: compareBrandId,
    type: "all"
  });
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
  // changeCompetitorBrand();
  getOverview({
    ...paramsObj.value,
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

onBeforeMount(() => {
  console.log(currBrandStore.currBrandObj.brandId);
  if (currBrandStore.currBrandObj.brandId === 1) {
    return;
  }
});
// 监听每个滚动区域的滚动事件
onMounted(() => {
  changeCompetitorBrand(currBrandStore.currBrandObj.competitor[0].competitorBrandId);
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
  competitorBrandId.value = null;
  competitorBrandId2.value = null;
  changeCompetitorBrand(currBrandStore.currBrandObj.competitor[0].competitorBrandId);
  // getOverview({ ...paramsObj.value });
  // getFugaitu({ ...paramsObj.value, type: "all" });
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
