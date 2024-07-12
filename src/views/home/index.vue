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
          <div class="media_attention">{{ attentionlabelArr[i] }}：{{ overviewList?.percent[i] }} %</div>
          <div class="media_position">行业内排位：{{ overviewList?.order[i] }}</div>
          <div class="media_rank">
            <div>排名详情：</div>
            <div>
              <div v-for="(orderItem, index) in overviewList?.orderList[i]" :key="orderItem">
                No.{{ index + 1 }}{{ orderItem }}
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
          <div class="media_num">{{ item }}：{{ overviewList.num[i] }}</div>
          <div class="media_dec">{{ decArr[i] }}</div>
          <div class="media_attention">{{ attentionlabelArr[i] }}：{{ overviewList?.percent[i] }} %</div>
          <div class="media_position">行业内排位：{{ overviewList.order[i] }}</div>
          <div class="media_rank">
            <div>排名详情：</div>
            <div>
              <div v-for="(orderItem, index) in overviewList.orderList[i]" :key="orderItem">0{{ index + 1 }}{{ orderItem }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 头部媒体覆盖图 -->
    <div class="mediaBox" v-for="(item, index) in mediaData" :key="index">
      <div class="mediaHeader">
        <div class="mediaHeader_tit">{{ index === 0 ? "头部媒体覆盖图" : "细分媒体图层" }}</div>
        <div>
          <SelectAddPop />
        </div>
      </div>

      <div class="mediaCon" :ref="getScrollRef(index)">
        <div v-if="scrolls[index].canScrollLeft" @click="scrollLeft(index)" class="scrollButton scrollButton_left">
          <el-icon><ArrowLeft /></el-icon>
        </div>
        <div v-if="scrolls[index].canScrollRight" @click="scrollRight(index)" class="scrollButton scrollButton_right">
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div
          class="mediaCon_ul"
          v-for="(mediaTypeArr, mediaTypeArrIndex) in index === 0 ? item.top : item.subdivide"
          :key="mediaTypeArrIndex"
        >
          <div
            class="mediaCon_li"
            v-for="(mediaTypeListArr, mediaTypeListArrIndex) in mediaTypeArr.list"
            :key="mediaTypeListArrIndex"
          >
            <div class="media_type">{{ mediaTypeListArr.name }}</div>
            <div class="media_list">
              <div
                class="media_listIner"
                v-for="(mediaListItem, mediaListItemIndex) in mediaTypeListArr.list"
                :key="mediaListItemIndex"
              >
                <!-- 
              publishFlag:[1,1,0]; 数组里的1表示展示，0表示不展示
              publishFlag:[1];单个时： 显示一个红点
              publishFlag:[1];负面时： name红色字体
              publishFlag:[1，0]; 时间对比时：显示一个 红圈，红点
              publishFlag:[1，1，0]; 3个品牌时：显示三个 蓝、 黄，红
              -->
                <span class="circleBox blue"></span>
                <span class="circleBox yellow"></span>
                <span class="circleBox ring"></span>
                <span class="circleBox red"></span>
                <span>{{ mediaListItem.mediaName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mediaFooter"></div>
    </div>
    <!-- <div class="subdivideMedia"></div> -->
  </div>
</template>

<script setup lang="ts" name="home">
// export default {

// }
import { reactive, ref, onMounted, onUnmounted } from "vue";
// import dataJson from "./mediaData.json";
import SelectAddPop from "./../components/SelectAddPop/index.vue";
// import SelectAddPop from "./components/SelectAddPop/index.vue";
import moment from "moment";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import { fugaituApi, overviewApi } from "@/api/modules/media";

const currBrandStore = useCurrBrandStore();
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

  compareBrandId: null, // 对比品牌id,多个逗分割，最多两个  选填
  compareStartTime: null, //  对比开始时间                 选填
  compareEndTime: null // 对比结束时间                选填
});
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
// const overviewList = {
//   num: [10, 5, 6, 4],
//   percent: [0, 500, 23, 400, 5000],
//   order: [10, 5, 6, 4],
//   orderList: [
//     ["海尔", "海信", "格力", "海信", "格力"],
//     ["海尔", "海信", "格力", "海信", "格力"],
//     ["海尔", "海信", "格力", "海信", "格力"],
//     ["海尔", "海信", "格力", "海信", "格力"]
//   ]
// };
// 创建一个数组来存储滚动区域的状态
const scrolls = reactive(
  Array.from({ length: 2 }, () => ({
    scrollLeft: 0,
    clientWidth: 0,
    scrollWidth: 0,
    canScrollLeft: false,
    canScrollRight: false
  }))
);
const scrollRefs = Array.from({ length: 2 }, () => ref(null));

// 获取滚动区域的ref
const getScrollRef = index => el => {
  if (el) {
    scrollRefs[index].value = el;
    updateScrollStatus(index);
  }
};
// 更新横向滚动状态
const updateScrollStatus = index => {
  const scrollArea = scrollRefs[index].value;
  if (scrollArea) {
    scrolls[index].scrollLeft = (scrollArea as any).scrollLeft;
    scrolls[index].clientWidth = (scrollArea as any).clientWidth;
    scrolls[index].scrollWidth = (scrollArea as any).scrollWidth;
    scrolls[index].canScrollLeft = (scrollArea as any).scrollLeft > 0;
    scrolls[index].canScrollRight =
      (scrollArea as any).scrollWidth > Math.ceil((scrollArea as any).scrollLeft) + (scrollArea as any).clientWidth;
  }
  // console.log("scrollWidth", (scrollArea as any).scrollWidth);
  // console.log("scrollLeft", Math.ceil((scrollArea as any).scrollLeft));
  // console.log("clientWidth", (scrollArea as any).clientWidth);
};
// 滚动方法
const scrollLeft = index => {
  const scrollArea = scrollRefs[index].value;
  if (scrollArea) {
    (scrollArea as any).scrollBy({ left: -(scrollArea as any).clientWidth, behavior: "smooth" });
  }
};

const scrollRight = index => {
  const scrollArea = scrollRefs[index].value;
  if (scrollArea) {
    (scrollArea as any).scrollBy({ left: (scrollArea as any).clientWidth, behavior: "smooth" });
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
};
// 点击负面概览——跳转负面页面
const changeOverview = i => {
  console.log(i);
  console.log(dateArr.value[0], dateArr.value[1]);
};
// 点击对比按钮
const changePk = () => {
  isShowContrastTime.value = true;
};
//取消对比
const changePkNo = () => {
  isShowContrastTime.value = false;
  isShowContrast.value = false;
};
// 选择对比时段后 按确定
const searchPkTime = () => {
  isShowContrast.value = true;
};
// 获取概览数据
const getOverview = async (params: any) => {
  const { data } = await overviewApi(params);
  console.log(data);
  overviewList.value = (data as any).gailan;
};
// 获取覆盖图数据
const getFugaitu = async (params: any) => {
  const { data } = await fugaituApi(params);
  console.log(data);
  mediaData.value = data as any;
};

// 监听每个滚动区域的滚动事件
onMounted(() => {
  getOverview({
    ...paramsObj.value,
    // startTime: dateArr.value[0],
    // endTime: dateArr.value[1],
    brandId: currBrandStore.currBrandObj.brandId
  });
  console.log("开始时间", dateArr.value[0]); // 开始时间
  console.log("结束时间", dateArr.value[1]); // 结束时间
  getFugaitu({
    ...paramsObj.value,
    // startTime: dateArr.value[0],
    // endTime: dateArr.value[1],
    type: "all"
  });
  scrollRefs.forEach((ref, index) => {
    if (ref.value) {
      (ref.value as any).addEventListener("scroll", () => updateScrollStatus(index));
      updateScrollStatus(index);
    }
  });
});

onUnmounted(() => {
  scrollRefs.forEach(ref => {
    if (ref.value) {
      (ref.value as any).removeEventListener("scroll", () => updateScrollStatus(scrollRefs.indexOf(ref)));
    }
  });
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
