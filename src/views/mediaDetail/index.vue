<template>
  <div class="mediaDetailBox">
    <div class="mediaDetail_left">
      <div class="left_top">
        <div class="left_top_tit1" style="">[统一归类名称]</div>
        <div class="left_top_tit2">{{ oneLevelArr.unionMediaName }}</div>
        <div class="left_top_tit3" style="margin-top: 20px">网站:{{ oneLevelArr.url }}</div>
        <div class="left_top_tit3">客户端: {{ oneLevelArr.client }}</div>
        <div class="left_top_tit3">电子报: {{ oneLevelArr.epaper }}</div>
      </div>
      <ul class="left_bottom">
        <li
          v-for="item in oneLevelArr.mediaList"
          :key="item.mediaId"
          :class="{ active: activeId === item.mediaId }"
          @click="setActive(item)"
        >
          <div class="mediaName_nav"><span></span>{{ item.mediaName }}</div>
          <div v-if="activeId === item.mediaId" style="min-height: 50px; font-size: 14px">
            {{ item.beforeName }}&{{ item.anotherName }}&{{ item.includeName }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mediaDetail_right">
      <div class="mediaSource">
        <div class="mediaSource_tit">[作为媒体源]</div>
        <div class="mediaSource_listBox">
          <div class="mediaSource_listRow" v-for="item in mediaSourceArr" :key="item.name">
            <div class="mediaSource_rowTit">[{{ item.name }}]</div>
            <div class="mediaSource_rowCon">
              <div
                :class="{ activeMedia: activeMediaSourceIndex === index }"
                v-for="(mediaItem, index) in item.data"
                :key="mediaItem.name"
                @click="setMediaSourceActive(index, mediaItem)"
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
                @click="setNumberActive(index, item)"
                :class="{ activeNumber: activeNumberIndex == index }"
              >
                {{ item.name }}
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
import { ref } from "vue";
// 左侧以及列表数据
const oneLevelArr = ref({
  unionMediaId: 111, //    媒体集群id
  unionMediaName: "第一财经", //    媒体集群名称
  url: "url",
  client: "客户端",
  epaper: "电子报",
  mediaList: [
    { mediaId: 1, mediaName: "一财网", beforeName: "曾用名", anotherName: "别名", includeName: "包含名称" },
    { mediaId: 2, mediaName: "一财网", beforeName: "曾用名", anotherName: "别名", includeName: "包含名称" },
    { mediaId: 3, mediaName: "一财网", beforeName: "曾用名", anotherName: "别名", includeName: "包含名称" }
  ]
});
let activeMediaSourceIndex = ref(0); // 媒体源，默认选中第一个
const activeNumberIndex = ref(0); // 账号列表，默认选中第一个
let oneName = ref("一级"); // 一级选中的
let twoName = ref("二级"); // 二级选中的
let threeName = ref("三级"); // 三级选中的
let dateArr = ref([]); // 时间选择器

//媒体源、账号列表
const mediaSourceArr = ref([
  {
    name: "自媒体平台",
    data: [
      {
        name: "微信号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经公司与", id: 2222 }
        ] // [] 表示没有账号
      },
      {
        name: "头条号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经", id: 2222 }
        ]
      }
    ]
  },
  {
    name: "自媒体平台123",
    data: [
      {
        name: "微信号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经公司与", id: 2222 }
        ] // [] 表示没有账号
      },
      {
        name: "头条号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经", id: 2222 }
        ]
      }
    ]
  },
  {
    name: "自媒体平台",
    data: [
      {
        name: "微信号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经公司与", id: 2222 }
        ] // [] 表示没有账号
      },
      {
        name: "头条号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经", id: 2222 }
        ]
      }
    ]
  },
  {
    name: "自媒体平台",
    data: [
      {
        name: "微信号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经公司与", id: 2222 }
        ] // [] 表示没有账号
      },
      {
        name: "头条号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经", id: 2222 }
        ]
      }
    ]
  },
  {
    name: "自媒体平台",
    data: [
      {
        name: "微信号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经公司与", id: 2222 }
        ] // [] 表示没有账号
      },
      {
        name: "头条号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经", id: 2222 }
        ]
      }
    ]
  },
  {
    name: "自媒体平台",
    data: [
      {
        name: "微信号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经公司与", id: 2222 }
        ] // [] 表示没有账号
      },
      {
        name: "头条号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经", id: 2222 }
        ]
      }
    ]
  },
  {
    name: "自媒体平台",
    data: [
      {
        name: "微信号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经公司与", id: 2222 }
        ] // [] 表示没有账号
      },
      {
        name: "头条号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经", id: 2222 }
        ]
      }
    ]
  },
  {
    name: "自媒体平台",
    data: [
      {
        name: "微信号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经公司与", id: 2222 }
        ] // [] 表示没有账号
      },
      {
        name: "头条号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经", id: 2222 }
        ]
      }
    ]
  },
  {
    name: "自媒体平台",
    data: [
      {
        name: "微信号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经公司与", id: 2222 }
        ] // [] 表示没有账号
      },
      {
        name: "头条号",
        data: [
          { name: "第一财经", id: 1111 },
          { name: "第一财经", id: 2222 }
        ]
      }
    ]
  }
]);
let numberArr = ref([]); //账号列表
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
const activeId = ref(oneLevelArr.value.mediaList[0].mediaId); // 左侧列表 选中的id
// 左侧列表点击事件
function setActive(item) {
  activeId.value = item.mediaId;
  console.log("一级菜单栏选中的：", item.mediaName);
}
// 点击媒体源
function setMediaSourceActive(index, mediaItem) {
  activeMediaSourceIndex.value = index; // 点击时更新当前活动索引
  numberArr.value = mediaItem.data;
  // console.log(numberArr.value);
}
// 点击账号
function setNumberActive(index: any, item: any) {
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
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
