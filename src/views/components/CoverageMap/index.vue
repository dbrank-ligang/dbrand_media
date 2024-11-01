<template>
  <!-- 头部媒体覆盖图 -->
  <div class="mediaBox" v-for="(item, index) in props.mediaData" :key="index">
    <div class="mediaHeader">
      <div class="mediaHeader_tit">{{ index === 0 ? "头部媒体覆盖图" : "细分媒体圈层" }}</div>
      <div>
        <SelectAddPop ref="childRef" />
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
          <div v-if="!mediaTypeListArr.name" class="addCard" @click="handleAdd(index)"></div>
          <div v-else style="padding: 18px 5px">
            <!-- <div style="padding: 18px 5px"> -->
            <div class="media_lei">{{ mediaTypeListArr.pname }}</div>
            <div v-if="mediaTypeListArr.name" class="media_type">【{{ mediaTypeListArr.name }}】</div>
            <div v-else class="media_type"></div>
            <div class="media_list">
              <div
                class="media_listIner"
                v-for="(mediaListItem, mediaListItemIndex) in mediaTypeListArr.list"
                :key="mediaListItemIndex"
                @click="mediaClick(mediaListItem)"
              >
                <!-- 
              publishFlag:[1,1,0]; 数组里的1表示展示，0表示不展示
              publishFlag:[1];单个时： 显示一个红点
              publishFlag:[1];负面时： name红色字体
              publishFlag:[1，0]; 时间对比时：显示一个 红圈，红点
              publishFlag:[1，1，0]; 3个品牌时：显示三个 蓝、 黄，红
              -->
                <div style="display: inline-block">
                  <span style="line-height: 14px" v-if="flagType(mediaListItem.publishFlag) === 'brandFlag'">
                    <span
                      :title="item !== 0 ? '该媒体近期发表了与品牌相关的文章。' : ''"
                      class="circleBox"
                      :class="brandFlagBgColor[i]"
                      :style="{ opacity: item }"
                      v-for="(item, i) in mediaListItem.publishFlag"
                      :key="item + Math.random()"
                    >
                    </span>
                  </span>
                  <span style="line-height: 14px" v-if="flagType(mediaListItem.publishFlag) === 'timeFlag'">
                    <span
                      :title="item !== 0 ? '该媒体近期发表了与品牌相关的文章。' : ''"
                      class="circleBox"
                      :class="timeFlagBgColor[i]"
                      :style="{ opacity: item }"
                      v-for="(item, i) in mediaListItem.publishFlag"
                      :key="item + Math.random()"
                    >
                    </span>
                  </span>
                  <span v-if="flagType(mediaListItem.publishFlag) === 'flag'">
                    <span
                      :title="mediaListItem.publishFlag[0] !== 0 ? '该媒体近期发表了与品牌相关的文章。' : ''"
                      class="circleBox red"
                      :style="{ opacity: mediaListItem.publishFlag[0] }"
                    >
                    </span>
                  </span>
                </div>

                <span
                  :title="
                    mixedSubstring(mediaListItem.mediaName, 18, 18) !== mediaListItem.mediaName
                      ? `${mediaListItem.mediaName}`
                      : ''
                  "
                  :style="{
                    color:
                      flagType(mediaListItem.publishFlag) === 'negative' && mediaListItem.publishFlag[0] == 1
                        ? '#d40000'
                        : '#000',
                    marginLeft: flagType(mediaListItem.publishFlag) === 'negative' ? '30px' : null
                  }"
                >
                  {{ mixedSubstring(mediaListItem.mediaName, 18, 18) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mediaFooter"></div>
  </div>
</template>
<script setup lang="ts" name="CoverageMap">
import { mediaNavApi } from "@/api/modules/media";
import { MEDIADETAIL } from "@/config";
import { onUnmounted, reactive, ref, defineProps, onActivated } from "vue";
import { useRouter } from "vue-router";
import SelectAddPop from "../SelectAddPop/index.vue";
import { mixedSubstring } from "@/utils";
const router = useRouter();
const childRef = ref() as any;
const brandFlagBgColor = ref({
  0: "red",
  1: "yellow",
  2: "blue"
});
const timeFlagBgColor = ref({
  0: "ring",
  1: "red"
});

const props = defineProps({
  mediaData: Array,
  dateArr: Array
});
const handleAdd = (index?: any) => {
  if (childRef.value) {
    childRef.value[index].activeBtn({ title: "自选类别", isActive: false });
  }
  document.getElementsByClassName("mediaHeader_tit")[index].scrollIntoView({ behavior: "smooth", block: "start" });
};

// 计算属性根据数组长度返回颜色  flag/timeFlag/brandFlag
const flagType = (item: any) => {
  const length = item.length;
  // 获取当前路由对象
  let currentRoute = router.currentRoute.value;
  if (length === 1 && currentRoute.path === "/negative/index") {
    return "negative";
  } else if (length === 1 && currentRoute.path !== "/negative/index") {
    return "flag";
  } else if (length === 2 && currentRoute.path === "/home/index") {
    return "timeFlag";
  }
  if (currentRoute.path === "/brandRatio/index") {
    return "brandFlag";
  }
};
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

const mediaClick = item => {
  const params = { mediaId: item.mediaId, subUnionId: item.subMediaId, accountName: item.mediaName, platform: item.platform };
  getMediaNavApi(params);
};

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
// 跳转到媒体详情
function jumpDetail(urlQuery: any) {
  let routerUrl = router.resolve({
    path: MEDIADETAIL,
    query: {
      ...urlQuery,
      startTime: props.dateArr ? props.dateArr[0] : null,
      endTime: props.dateArr ? props.dateArr[1] : null
    }
  });
  window.open(routerUrl.href, "_blank");
}
// 监听每个滚动区域的滚动事件
// onMounted(() => {
//   setTimeout(() => {
//     scrollRefs.forEach((ref, index) => {
//       if (ref.value) {
//         (ref.value as any).addEventListener("scroll", () => updateScrollStatus(index));
//         updateScrollStatus(index);
//       }
//     });
//   }, 1000);
// });

onActivated(() => {
  setTimeout(() => {
    scrollRefs.forEach((ref, index) => {
      if (ref.value) {
        (ref.value as any).addEventListener("scroll", () => updateScrollStatus(index));
        updateScrollStatus(index);
      }
    });
  }, 1000);
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
