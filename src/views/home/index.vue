<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div class="home">
    <!-- 头部筛选条件 -->
    <header class="header_box">
      <div class="header_box_left">
        品牌名称：<span class="tiopBg"></span> <span> {{ currBrandStore.currBrandObj.brandName }}</span>
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
        <el-button @click="changePk" class="buttonStyle" v-if="!isShowContrastTime">对比</el-button>
        <el-button @click="changePkNo" v-else>取消对比</el-button>
      </div>
    </header>
    <!-- 正常数据 -->
    <div class="overview">
      <div class="overview_tit">媒体关注度总览</div>
      <div class="overview_numberBox overview_numberBox_1">
        <div class="overview_number" v-for="(item, i) in numlabelArr" :key="item" @click="changeOverview(i)">
          <div class="media_num">{{ item }}：{{ overviewList?.num[i] }}</div>
          <div class="media_dec">{{ decArr[i] }}</div>
          <div class="media_attention">{{ attentionlabelArr[i] }}：{{ numFilter(overviewList?.percent[i]) }}</div>
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
    <!-- 对比数据 时间选择器 -->
    <header class="header_box" v-if="isShowContrastTime">
      <div class="header_box_left"></div>
      <div class="header_box_right">
        <div style="display: flex; align-items: center">
          <span class="tiopBd"></span> <span>对比时段：</span>
          <el-date-picker
            v-model="dateArrPk"
            width="200px"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </div>
        <el-button class="buttonStyle" @click="searchPkTime">确定</el-button>
      </div>
    </header>
    <!-- 对比数据-->
    <div class="overview" v-if="isShowContrast">
      <div class="overview_tit">媒体关注度总览</div>
      <div class="overview_numberBox">
        <div class="overview_number" v-for="(item, i) in numlabelArr" :key="item">
          <div class="media_num">{{ item }}：{{ overviewListTimeDuibi?.num[i] }}</div>
          <div class="media_dec">{{ decArr[i] }}</div>
          <div class="media_attention">{{ attentionlabelArr[i] }}：{{ numFilter(overviewListTimeDuibi?.percent[i]) }}</div>
          <div class="media_position">行业内排位：No.{{ overviewListTimeDuibi.order[i] }}</div>
          <div class="media_rank">
            <div>排名详情：</div>
            <div>
              <div v-for="(orderItem, index) in overviewListTimeDuibi.orderList[i]" :key="orderItem">
                0{{ index + 1 }} {{ orderItem }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CoverageMap v-if="userStore.userInfo.memberShip" :mediaData="mediaData" :dateArr="dateArr" />
    <div class="memberShipBox" v-else>
      <img src="@/assets/images/mengban.png" />
    </div>
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted, onUnmounted, watch, provide } from "vue";
import CoverageMap from "./../components/CoverageMap/index.vue";
import moment from "moment";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import { useUserStore } from "@/stores/modules/user";
import { fugaituApi, overviewApi } from "@/api/modules/media";
import { numFilter } from "@/utils/parseFloat";
import router from "@/routers";
import { NEGATIVE } from "@/config";
const handleCustomCategoryClick = function () {
  getFugaitu({ ...paramsObj.value, type: "all" });
};
provide("handleCustomCategoryClick", handleCustomCategoryClick);

const currBrandStore = useCurrBrandStore();
const userStore = useUserStore();

// 获取上周周一
const dateStart = moment().subtract(1, "week").startOf("week").add(1, "day").format("X");
// 获取上周周日
const dateEnd = moment().subtract(1, "week").endOf("week").add(1, "day").format("X");
let dateArr = ref([dateStart, dateEnd]); // 时间范围
let dateArrPk = ref([]); // 对比的时间范围

let isShowContrastTime = ref(false); // 是否显示时间对比（时间选择器组件）
let isShowContrast = ref(false); // 是否显示时间对比模块
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
  num: [],
  percent: [],
  order: [],
  orderList: []
} as any);
// 概览数据
const overviewListTimeDuibi = ref({
  num: [],
  percent: [],
  order: [],
  orderList: []
} as any);

// 时间搜索
const changeTime = () => {
  // console.log(dateArr.value[0]); // 开始时间
  // console.log(dateArr.value[1]); // 结束时间
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
// 跳转负面曝光页方法
function jumpNegative(urlQuery: any) {
  let routerUrl = router.resolve({
    path: NEGATIVE,
    query: {
      ...urlQuery
    }
  });
  window.open(routerUrl.href, "_blank");
}
// 点击负面概览——跳转负面页面
const changeOverview = i => {
  if (i === 2) {
    // console.log(dateArr.value[0], dateArr.value[1]);
    jumpNegative({ startTime: dateArr.value[0], endTime: dateArr.value[1] });
  }
};
// 点击对比按钮
const changePk = () => {
  isShowContrastTime.value = true;
};
// 选择对比时段后 按确定
const searchPkTime = () => {
  // console.log(dateArrPk);
  if (dateArrPk.value.length > 0) {
    isShowContrast.value = true;
    const startTime = new Date(dateArrPk.value[0]).getTime() / 1000;
    const endTime = new Date(dateArrPk.value[1]).getTime() / 1000;
    // console.log(startTime); // 开始时间
    // console.log(endTime); // 结束时间
    paramsObj.value = {
      ...paramsObj.value,
      compareStartTime: startTime,
      compareEndTime: endTime
    };
    getOverview_timeDuibi({
      startTime: startTime,
      endTime: endTime
    });

    getFugaitu({ ...paramsObj.value, type: "all" });
  }
};
//取消对比
const changePkNo = () => {
  isShowContrastTime.value = false;
  isShowContrast.value = false;
  paramsObj.value = {
    ...paramsObj.value,
    compareStartTime: null,
    compareEndTime: null
  };
  dateArrPk.value = []; //清空时间对比
  overviewListTimeDuibi.value = { num: [], percent: [], order: [], orderList: [] }; //清空时间对比的数据
  getFugaitu({ ...paramsObj.value, type: "all" });
};

// 获取概览数据
const getOverview = async (params: any) => {
  const { data } = await overviewApi({
    ...params,
    brandId: currBrandStore.currBrandObj.brandId
  });
  overviewList.value = data;
};
// 获取概览数据(时间段对比)
const getOverview_timeDuibi = async (params: any) => {
  const { data } = await overviewApi({
    ...params,
    brandId: currBrandStore.currBrandObj.brandId
  });
  overviewListTimeDuibi.value = data;
};
// 获取覆盖图数据
const getFugaitu = async (params: any) => {
  const { data } = await fugaituApi({
    ...params,
    brandId: currBrandStore.currBrandObj.brandId
  });
  mediaData.value = data as any;
};

// 监听每个滚动区域的滚动事件
onMounted(() => {
  getOverview({ ...paramsObj.value });
  getFugaitu({ ...paramsObj.value, type: "all" });
});

onUnmounted(() => {
  // console.log(123);
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
  changePkNo();
  getOverview({ ...paramsObj.value });
  getFugaitu({ ...paramsObj.value, type: "all" });
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
