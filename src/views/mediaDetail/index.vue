<template>
  <div class="mediaDetail_con">
    <!-- <div class="mediaDetail_up"> -->
    <!-- <div class="mediaDetail_text left_top">
        <div class="left_top_tit1" style="">[统一归类名称]</div>
        <div class="left_top_tit2">{{ oneLevelObj.unionMediaName }}</div>
        <div class="left_top_tit3" style="margin-top: 20px">网站:{{ oneLevelObj.url }}</div>
        <div class="left_top_tit3">客户端: {{ oneLevelObj.client }}</div>
        <div class="left_top_tit3">电子报: {{ oneLevelObj.epaper }}</div>
      </div> -->
    <!-- <div v-if="oneLevelSelectObj?.baike" class="mediaDetail_baike" v-html="oneLevelSelectObj?.baike"></div> -->
    <!-- <div class="mediaDetail_baike">{{ oneLevelSelectObj?.baike }}</div> -->
    <!-- </div> -->
    <div class="mediaDetailBox">
      <div class="mediaDetail_left">
        <div class="mediaDetail_text left_top">
          <div class="left_top_tit1" style="">[统一归类名称]</div>
          <div class="left_top_tit2">{{ oneLevelObj.unionMediaName }}</div>
          <!-- <div class="left_top_tit3" style="margin-top: 20px">网站:{{ oneLevelObj.url }}</div>
          <div class="left_top_tit3">客户端: {{ oneLevelObj.client }}</div>
          <div class="left_top_tit3">电子报: {{ oneLevelObj.epaper }}</div> -->
        </div>
        <div class="left_bottom">
          <li
            v-for="item in oneLevelObj.subUnionMediaList"
            :key="item.subUnionId"
            :class="{ active: oneLevelActiveId == item.subUnionId }"
            @click="oneLevelClick(item)"
          >
            <div
              class="mediaName_nav"
              :title="mixedSubstring(item.subUnionName, 18, 18) !== item.subUnionName ? `${item.subUnionName}` : ''"
            >
              <span></span>{{ mixedSubstring(item.subUnionName, 18, 18) }}
            </div>
            <div
              v-if="oneLevelActiveId == item.subUnionId && (item.beforeName || item.anotherName || item.includeName)"
              style="min-height: 50px; font-size: 14px"
            >
              {{
                (item.beforeName ? item.beforeName : "") +
                (item.anotherName ? "&" + item.anotherName : "") +
                (item.includeName ? "&" + item.includeName : "")
              }}
            </div>
          </li>
        </div>
      </div>
      <div class="mediaDetail_right">
        <div v-if="oneLevelSelectObj?.baike" class="mediaDetail_baike" v-html="oneLevelSelectObj?.baike"></div>
        <div v-if="oneLevelSelectObj?.baike" class="baikeTip">
          *以上信息来自百度百科，本站无法保证其内容的真实性、准确性、完整性和权威性
        </div>
        <div class="mediaSource" style="margin-top: 20px">
          <div class="mediaSource_tit">[作为媒体源]</div>
          <div class="mediaSource_listBox">
            <div class="mediaSource_listRow" v-for="(item, i) in mediaSourceArr" :key="item.name">
              <div class="mediaSource_rowTit">[{{ item.name }}]</div>
              <div class="mediaSource_rowCon">
                <div v-for="mediaItem in item.data" :key="mediaItem.name">
                  <div
                    v-if="mediaItem.data.length > 0"
                    @click="mediaSourceItemClick(mediaItem, i)"
                    style="cursor: pointer"
                    :class="{ activeMedia: activeMediaSourceIndex === i + mediaItem.name }"
                  >
                    {{ mediaItem.name }}
                  </div>
                  <div v-else style="color: #bbb">{{ mediaItem.name }}</div>
                </div>
                <!-- <div
                  v-for="mediaItem in item.data"
                  :key="mediaItem.name"
                  @click="mediaSourceItemClick(mediaItem, i)"
                  :class="{ activeMedia: activeMediaSourceIndex === i + mediaItem.name }"
                >
                  {{ mediaItem.name }}
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <div class="mediaSource" style="margin-top: 20px">
          <div class="mediaSource_tit">[账号列表]</div>
          <div class="mediaSource_listBox">
            <div class="mediaSource_listRow">
              <div class="mediaSource_rowCon">
                <div
                  v-for="(item, index) in numberArr"
                  :key="item.id"
                  @click="accountClick(index, item)"
                  style="cursor: pointer"
                  :class="{ activeNumber: activeNumberIndex == index }"
                >
                  {{ item.accountName }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="numberDetailBox" style="margin-top: 20px">
          <div class="numberDetailBox_tit">[账号详情]</div>
          <el-row :gutter="20" style="padding: 15px 0 0px 15px">
            <el-col class="numberDetailBox_Row" :span="12" v-for="item in Object.keys(numberDetailObj?.extendFields)" :key="item">
              <div class="numberDetailBox_rowTit">{{ item }}：</div>
              <div class="numberDetailBox_rowCon">{{ numberDetailObj?.extendFields[item] }}</div>
            </el-col>
          </el-row>
          <!-- <div style="padding: 15px 0 15px 15px">
            <div class="numberDetailBox_Row" v-for="item in Object.keys(numberDetailObj?.extendFields)" :key="item">
              <div class="numberDetailBox_rowTit">{{ item }}：</div>
              <div class="numberDetailBox_rowCon">{{ numberDetailObj?.extendFields[item] }}</div>
            </div>
          </div> -->
        </div>

        <div class="numberDetailBox" style="margin-top: 20px">
          <div class="numberDetailBox_tit">[账号标签]</div>
          <div style="padding: 15px 0 0px 15px">
            <div class="numberDetailBox_Row">
              <div class="numberDetailBox_rowTit">行业大类标签：</div>
              <div class="numberDetailBox_rowCon">{{ numberDetailObj?.hangyedalei || "" }}</div>
              <div class="numberDetailBox_rowTit">行业二级标签：</div>
              <div class="numberDetailBox_rowCon">{{ numberDetailObj?.hangyeerji || "" }}</div>
            </div>
            <div class="numberDetailBox_Row">
              <div class="numberDetailBox_rowTit">内容属性标签：</div>
              <div class="numberDetailBox_rowCon">{{ numberDetailObj?.neirongshuxing || "" }}</div>
              <div class="numberDetailBox_rowTit">媒体属性标签：</div>
              <div class="numberDetailBox_rowCon">{{ numberDetailObj?.meitishuxing || "" }}</div>
            </div>
            <div class="numberDetailBox_Row">
              <div class="numberDetailBox_rowTit">其他标签：</div>
              <div class="numberDetailBox_rowCon">{{ numberDetailObj?.qita || "" }}</div>
            </div>
          </div>
        </div>

        <div class="contentListBox" style="margin-top: 20px">
          <div class="contentListBox_tit">{{ oneName }} -（{{ twoName }}）{{ threeName }}</div>
          <div style="margin-top: 30px; font-size: 14px">
            [内容列表]
            <el-date-picker
              v-model="dateArr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
              value-format="X"
              @change="changeDate"
              :disabled-date="disabledDateFun"
            />
          </div>
          <el-table :data="articlesArr" height="250" style="width: 100%" class="tableBox">
            <el-table-column prop="brandName" align="center" width="220" label="高相关品牌" />
            <el-table-column label="内容标题" align="center">
              <template #default="scope">
                <a target="_blank" :href="scope.row.docUrl">{{ scope.row.title }}</a>
              </template>
            </el-table-column>
            <el-table-column label="发表时间" align="center" width="300">
              <template #default="scope">
                {{ timestampToDate(scope.row.publishTime) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <BottomNav style="margin-top: 10px"></BottomNav>
  </div>
</template>

<script setup lang="ts" name="mediaDetail">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { mediaNavApi, accountListApi, accountApi, articlesApi } from "@/api/modules/media";
import { isArray } from "@/utils/is";
import { disabledDateFun } from "@/utils";
import moment from "moment";
import BottomNav from "./../components/BottomNav/index.vue";
import { mixedSubstring } from "@/utils";

const route = useRoute();
// 左侧一级导航列表数据
const oneLevelObj = ref({
  unionMediaId: null, //    媒体集群id
  unionMediaName: null, //    媒体集群名称
  url: null,
  client: null,
  epaper: null,
  subUnionMediaList: []
} as any);
let activeMediaSourceIndex = ref(0); // 媒体源，默认选中第一个
const activeNumberIndex = ref(0); // 账号列表，默认选中第一个
const accountId = ref(null); // 账号列表选中的id
const oneName = ref(""); // 一级选中的
const twoName = ref(""); // 二级选中的
const threeName = ref(""); // 三级选中的
// 获取上周周一
const dateStart = moment().subtract(1, "week").startOf("week").add(1, "day").format("X");
// 获取上周周日
const dateEnd = moment().subtract(1, "week").endOf("week").add(1, "day").format("X");
let dateArr = ref([dateStart, dateEnd]); // 时间范围
const defaultObj = ref({
  mediaId: null,
  subUnionId: null, // 左侧选中的id
  mediaName: null,
  platform: null,
  accountName: null
} as any);

//媒体源、账号列表
const mediaSourceArr = ref([] as any);
let numberArr = ref([] as any); //账号列表
// 账号详情、账号标签
let numberDetailObj = ref({
  extendFields: {},
  hangyedalei: null,
  neirongshuxing: null,
  meitishuxing: null,
  hangyeerji: null,
  qita: null
} as any);
const articlesArr = ref([] as any);
const oneLevelActiveId = ref(); // 左侧列表 选中的id
const oneLevelSelectObj = ref(); // 左侧选中的obj
// // 左侧列表点击事件
function oneLevelClick(item) {
  oneLevelActiveId.value = item.subUnionId;
  getMdiaSourceArr({ subUnionId: item.subUnionId }); //获取媒体源、账号列表
  console.log("一级菜单栏选中的：", item);
  oneName.value = item.subUnionName;
  oneLevelSelectObj.value = item;
}
// 切换媒体源
function mediaSourceItemClick(mediaItem, i) {
  activeNumberIndex.value = 0;
  activeMediaSourceIndex.value = i + mediaItem.name; // 点击时更新当前活动索引
  getAccountList(mediaItem);
  twoName.value = mediaItem.name;
  // console.log(numberArr.value);
}
// 点击账号
function accountClick(index: any, item: any) {
  activeNumberIndex.value = index; // 点击时更新当前
  threeName.value = item.accountName; // 选中账号的name
  accountId.value = item.id; // 选中账号的id
  changeDate();
  getAccountObj(item.id);
  getAarticlesList(); // 调内容列表接口
}
const changeDate = () => {
  getAarticlesList();
};
// 时间戳转换为日期的函数
const timestampToDate = timestamp => {
  let date = new Date(timestamp * 1000); // 确保时间戳是以毫秒为单位
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份是从0开始的
  let day = ("0" + date.getDate()).slice(-2);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let seconds = ("0" + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// 媒体一级列表
const getOneLevelArr = async (params: any) => {
  const { data } = await mediaNavApi(params);
  oneLevelObj.value = data as any;
  // 找到url中mediaId对应的item
  let selectItem = {};
  if (defaultObj.value?.subUnionId) {
    for (let i = 0; i < oneLevelObj.value.subUnionMediaList.length; i++) {
      let item = oneLevelObj.value.subUnionMediaList[i];
      // console.log(item, "subUnionName");
      if (item.subUnionId == defaultObj.value.subUnionId) {
        selectItem = item;
        oneLevelClick(selectItem);
      }
    }
  } else {
    if (isArray(oneLevelObj.value.subUnionMediaList) && oneLevelObj.value.subUnionMediaList.length > 0) {
      let obj = oneLevelObj.value.subUnionMediaList[0];
      selectItem = obj;
      oneLevelClick(selectItem);
    }
  }
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
        // console.log(tempData.data[j]);
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

// 查询账号详情（根据账号列表选中的id）
const getAccountObj = async (params: any) => {
  const { data } = await accountApi({ accountId: params });
  numberDetailObj.value = data as any;
};
// 查询账号详情（根据账号列表选中的id）
const getAarticlesList = async () => {
  if (accountId.value) {
    const { data } = await articlesApi({
      startTime: dateArr.value[0],
      endTime: dateArr.value[1],
      accountId: accountId.value
    });
    articlesArr.value = data as any;
  }
};

onMounted(() => {
  const myParam = route.query;
  defaultObj.value = myParam;
  if (defaultObj.value.startTime && defaultObj.value.endTime) {
    dateArr.value = [defaultObj.value.startTime, defaultObj.value.endTime];
  }
  getOneLevelArr({
    mediaId: defaultObj.value.mediaId,
    subUnionId: defaultObj.value.subUnionId,
    accountName: defaultObj.value.accountName
  }); // 获取左侧导航列表
});
</script>
<style lang="scss">
// @import "./baike1.scss";
// @import "./baike2.scss";
@import "./baike3.scss";
</style>
<style scoped lang="scss">
@import "./index.scss";
</style>
