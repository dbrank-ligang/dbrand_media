<template>
  <div class="mediaDetailBox">
    <div class="mediaDetail_left">
      <div class="left_top">
        <div class="left_top_tit1" style="">[统一归类名称]</div>
        <div class="left_top_tit2">{{ oneLevelObj.unionMediaName }}</div>
        <div class="left_top_tit3" style="margin-top: 20px">网站:{{ oneLevelObj.url }}</div>
        <div class="left_top_tit3">客户端: {{ oneLevelObj.client }}</div>
        <div class="left_top_tit3">电子报: {{ oneLevelObj.epaper }}</div>
      </div>
      <ul class="left_bottom">
        <li
          v-for="item in oneLevelObj.mediaList"
          :key="item.mediaId"
          :class="{ active: oneLevelActiveId == item.mediaId }"
          @click="oneLevelClick(item)"
        >
          <div class="mediaName_nav"><span></span>{{ item.mediaName }}</div>
          <div v-if="oneLevelActiveId == item.mediaId" style="min-height: 50px; font-size: 14px">
            {{ item.beforeName }}&{{ item.anotherName }}&{{ item.includeName }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mediaDetail_right">
      <div class="mediaSource">
        <div class="mediaSource_tit">[作为媒体源]</div>
        <div class="mediaSource_listBox">
          <div class="mediaSource_listRow" v-for="(item, i) in mediaSourceArr" :key="item.name">
            <div class="mediaSource_rowTit">[{{ item.name }}]</div>
            <div class="mediaSource_rowCon">
              <div
                v-for="mediaItem in item.data"
                :key="mediaItem.name"
                @click="mediaSourceItemClick(mediaItem, i)"
                :class="{ activeMedia: activeMediaSourceIndex === i + mediaItem.name }"
              >
                {{ mediaItem.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mediaSource" style="margin-top: 10px">
        <div class="mediaSource_tit">[账号列表]</div>
        <div class="mediaSource_listBox">
          <div class="mediaSource_listRow">
            <div class="mediaSource_rowCon">
              <div
                v-for="(item, index) in numberArr"
                :key="item.id"
                @click="accountClick(index, item)"
                :class="{ activeNumber: activeNumberIndex == index }"
              >
                {{ item.accountName }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="numberDetailBox" style="margin-top: 10px">
        <div class="numberDetailBox_tit">[账号详情]</div>
        <div style="padding: 15px 0 15px 15px">
          <div class="numberDetailBox_Row">
            <div class="numberDetailBox_rowTit">label：</div>
            <div class="numberDetailBox_rowCon">value</div>
          </div>
        </div>
      </div>

      <div class="numberDetailBox" style="margin-top: 10px">
        <div class="numberDetailBox_tit">[账号标签]</div>
        <div style="padding: 15px 0 15px 15px">
          <div class="numberDetailBox_Row">
            <div class="numberDetailBox_rowTit">行业大类标签：</div>
            <div class="numberDetailBox_rowCon">{{ numberDetailObj.hangyedalei }}</div>
            <div class="numberDetailBox_rowTit">行业二级标签：</div>
            <div class="numberDetailBox_rowCon">{{ numberDetailObj.hangyeerji }}</div>
          </div>
          <div class="numberDetailBox_Row">
            <div class="numberDetailBox_rowTit">行业二级标签：</div>
            <div class="numberDetailBox_rowCon">{{ numberDetailObj.hangyeerji }}</div>
          </div>
          <div class="numberDetailBox_Row">
            <div class="numberDetailBox_rowTit">内容属性标签：</div>
            <div class="numberDetailBox_rowCon">{{ numberDetailObj.neirongshuxing }}</div>
          </div>
          <div class="numberDetailBox_Row">
            <div class="numberDetailBox_rowTit">媒体属性标签：</div>
            <div class="numberDetailBox_rowCon">{{ numberDetailObj.meitishuxing }}</div>
          </div>
          <div class="numberDetailBox_Row">
            <div class="numberDetailBox_rowTit">其他标签：</div>
            <div class="numberDetailBox_rowCon">{{ numberDetailObj.qita }}</div>
          </div>
        </div>
      </div>

      <div class="contentListBox" style="margin-top: 10px">
        <div class="contentListBox_tit">{{ oneName }}/{{ twoName }}/{{ threeName }}</div>
        <div style="margin-top: 30px">
          [内容列表]
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="small"
            @change="changeDate"
          />
        </div>
        <el-table :data="tableData" height="250" style="width: 100%" class="tableBox">
          <el-table-column prop="brandName" label="高相关品牌" />
          <el-table-column label="内容标题">
            <template #default="scope">
              <a _target="blank" :href="scope.row.docUrl">{{ scope.row.title }}</a>
            </template>
          </el-table-column>
          <el-table-column label="发表时间">
            <template #default="scope">
              {{ timestampToDate(scope.row.publishTime) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="mediaDetail">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { mediaNavApi, accountListApi } from "@/api/modules/media";
import { isArray } from "@/utils/is";
const route = useRoute();

// 左侧一级导航列表数据
const oneLevelObj = ref({
  unionMediaId: 111, //    媒体集群id
  unionMediaName: null, //    媒体集群名称
  url: null,
  client: null,
  epaper: null,
  mediaList: []
} as any);
let activeMediaSourceIndex = ref(0); // 媒体源，默认选中第一个
const activeNumberIndex = ref(0); // 账号列表，默认选中第一个
let oneName = ref("一级"); // 一级选中的
let twoName = ref("二级"); // 二级选中的
let threeName = ref("三级"); // 三级选中的
let dateArr = ref([]); // 时间选择器
const defaultObj = ref({
  mediaId: null,
  mediaName: null,
  platform: null,
  accountName: null
} as any);

//媒体源、账号列表
const mediaSourceArr = ref([] as any);
let numberArr = ref([] as any); //账号列表
// 账号详情、账号标签
let numberDetailObj = ref({
  extendFields: {
    账号名称: "第一财经",
    XXX: "XXX"
  },
  hangyedalei: "xxx", //头部媒体分类
  neirongshuxing: "xxx", //细分圈层
  meitishuxing: "xxx", //传统媒体 咨询 自媒体
  hangyeerji: "xxx", //头部媒体分类下级， 科学科普 人工智能
  qita: "xx1,xx2"
});
const tableData = ref([
  { brandName: "海尔，海信，澳柯玛", title: "title", publishTime: 1721232000000, docUrl: "www.baidu.com", docId: 111 },
  { brandName: "海尔，海信，澳柯玛", title: "title", publishTime: 1724601600000, docUrl: "www.baidu.com", docId: 111 },
  { brandName: "海尔，海信，澳柯玛", title: "title", publishTime: 1724601600000, docUrl: "www.baidu.com", docId: 111 }
]);
const oneLevelActiveId = ref(); // 左侧列表 选中的id
// // 左侧列表点击事件
function oneLevelClick(item) {
  oneLevelActiveId.value = item.mediaId;
  getMdiaSourceArr({ mediaId: item.mediaId }); //获取媒体源、账号列表
  console.log("一级菜单栏选中的：", item.mediaName);
}
// 切换媒体源
function mediaSourceItemClick(mediaItem, i) {
  activeNumberIndex.value = 0;
  activeMediaSourceIndex.value = i + mediaItem.name; // 点击时更新当前活动索引
  getAccountList(mediaItem);
  console.log(numberArr.value);
}
// 点击账号
function accountClick(index: any, item: any) {
  activeNumberIndex.value = index; // 点击时更新当前
  console.log(index, item);
}
const changeDate = () => {
  // console.log(dateArr.value[0]); // 开始时间
  // console.log(dateArr.value[1]); // 结束时间
  const startDate = dateArr.value[0];
  const endDate = dateArr.value[1];
  console.log(new Date(startDate).getTime(), new Date(endDate).getTime());
};
// 时间戳转换为日期的函数
const timestampToDate = timestamp => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
// 媒体一级列表
const getOneLevelArr = async (params: any) => {
  const { data } = await mediaNavApi(params);
  oneLevelObj.value = data as any;
  // 找到url中mediaId对应的item
  let selectItem = {};
  for (let i = 0; i < oneLevelObj.value.mediaList.length; i++) {
    let item = oneLevelObj.value.mediaList[i];
    if (item.mediaId == defaultObj.value.mediaId) {
      selectItem = item;
    }
  }
  oneLevelClick(selectItem);
};
// 获取媒体源列表
const getMdiaSourceArr = async (params: any) => {
  const { data } = await accountListApi(params);
  mediaSourceArr.value = data as any;

  let mediaSourceItem = {};
  let selectIndex = 0;

  if (defaultObj.value?.platform) {
    // 账号、媒体查询页 跳进来后，找到对应的item
    for (let i = 0; i < mediaSourceArr.value.length; i++) {
      let tempData = mediaSourceArr.value[i];
      for (let j = 0; j < tempData.data.length; j++) {
        console.log(tempData.data[j]);
        if (tempData.data[j].name === defaultObj.value.platform) {
          mediaSourceItem = tempData.data[j];
          selectIndex = i;
          defaultObj.value.platform = null;
        }
      }
    }
  } else {
    if (isArray(mediaSourceArr.value) && mediaSourceArr.value.length > 0) {
      selectIndex = 0;
      let obj = mediaSourceArr.value[0];
      if (isArray(obj.data) && obj.data.length > 0) {
        mediaSourceItem = obj.data[0];
      }
    }
  }
  mediaSourceItemClick(mediaSourceItem, selectIndex); // 传入点击的item 及 第几行
};
// 获取账户列表
const getAccountList = mediaItem => {
  numberArr.value = mediaItem.data;
  // 设置账户列表默认选中
  if (isArray(numberArr.value) && numberArr.value.length > 0) {
    if (defaultObj.value.accountName) {
      for (let i = 0; i < numberArr.value.length; i++) {
        if (defaultObj.value.accountName == numberArr.value[i].accountName) {
          accountClick(i, numberArr.value[i]);
          defaultObj.value.accountName = null;
        }
      }
    } else {
      accountClick(0, numberArr.value[0]);
    }
  }
};
onMounted(() => {
  const myParam = route.query;
  defaultObj.value = myParam;
  console.log(defaultObj.value); // 输出查询参数的值
  getOneLevelArr({ mediaId: defaultObj.value.mediaId }); // 获取左侧导航列表
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
