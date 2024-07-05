<template>
  <div class="mediaSuggestBox">
    <div class="mediaSuggest_tit">
      <div class="mediaSuggest_tit1">媒体推荐：</div>
      <div class="mediaSuggest_tit2">海尔集团</div>
    </div>
    <div class="searchBox">
      <div class="searchBox_1">
        <div>[类别]</div>
        <div class="selectBox">
          <div>媒体大类：</div>
          <div>
            <el-select
              v-model="searchForm.meitidalei"
              class="m-2"
              placeholder="请选择"
              style="width: 150px"
              @change="changeMedia"
            >
              <el-option v-for="item in meitidaleiArr" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
        </div>
        <div class="selectBox">
          <div>行业细分：</div>
          <div>
            <el-select v-model="searchForm.hangyexifen" class="m-2" placeholder="请选择" style="width: 150px">
              <el-option v-for="item in hangyexifenArr" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
        </div>
        <el-button style="margin-left: 10px; margin-top: 2px">我要新增</el-button>
        <div class="selectBox">
          <div>细分圈层：</div>
          <div>
            <el-select v-model="searchForm.xifenquanceng" class="m-2" placeholder="请选择" style="width: 150px">
              <el-option v-for="item in xifenquancengArr" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="searchBox_2">
        <div class="searchBox2_left">
          <div class="searchBox_2tit">[平台]</div>
          <div class="searchBox_2Con">
            <div
              :class="{ activePlatform: activePlatformIndex === index }"
              v-for="(item, index) in platformArr"
              :key="item"
              @click="setMediaSourceActive(index, item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <el-button class="buttonStyle" @click="handleSearch">查询</el-button>
      </div>
    </div>
    <div class="tableBox">
      <div class="sellBox">
        <div class="tableTile">推荐名单TOP{{ isExpandSell ? 20 : 10 }}</div>
        <el-table :data="sellArr" style="width: 100%; margin-top: 10px; color: #000" border>
          <el-table-column type="index" width="55" label="序号">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="媒体名称">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleClick(scope.row)">{{ scope.row.mediaName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="mediaCluster" label="所属媒体集群" />
          <el-table-column prop="mediaType" label="媒体属性" />
        </el-table>
        <el-button type="info" size="small" @click="handleExpandSell({ type: 1 })">
          {{ isExpandSell ? "- 收起" : " + 展开" }}
        </el-button>
      </div>
      <div class="sellNoBox">
        <div class="tableTile">不推荐名单TOP{{ isExpandSellNo ? 20 : 10 }}</div>
        <el-table :data="sellArr" style="width: 100%; margin-top: 10px; color: #000" border>
          <el-table-column type="index" width="55" label="序号">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="媒体名称">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleClick(scope.row)">{{ scope.row.mediaName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="mediacluster" label="所属媒体集群" />
          <el-table-column prop="mediatype" label="媒体属性" />
        </el-table>
        <el-button type="info" size="small" @click="handleExpandSell({ type: 0 })">
          {{ isExpandSellNo ? "- 收起" : " + 展开" }}
        </el-button>
      </div>
    </div>

    <div class="sellBox">
      <div class="tableTile">竞品合作媒体推测TOP{{ isExpandSell ? 20 : 10 }}</div>
      <el-table :data="tableData" style="width: 100%; margin-top: 10px; color: #000" border>
        <el-table-column type="index" width="55" label="序号">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="媒体名称">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleClick(scope.row)">{{ scope.row.mediaName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="mediaCluster" label="所属媒体集群" />
        <el-table-column prop="positiveNum" label="`相关正向内容条数`<br/>123" />
        <el-table-column prop="title" label="文章示例" />
        <el-table-column label="可能性">
          <template #default="scope">
            {{ scope.row.probability }}
          </template>
        </el-table-column>
      </el-table>
      <el-button type="info" size="small" @click="handleExpandSell({ type: 2 })">
        {{ isExpandInfer ? "- 收起" : " + 展开" }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="mediaSuggest">
import { onMounted, ref } from "vue";
import { mediaTypeApi, dictListApi, recommandMediaApi } from "@/api/modules/media";

const searchForm = ref({
  type: 1, //推荐；0不推荐；
  num: 10, //查询top10 ；20 查询top20      必填
  brandId: 1, //品牌id              必填
  platform: "", //平台名称                 非必填
  meitidalei: null, //媒体大类名称             非必填
  hangyexifen: null, //行业细分名称            非必填
  xifenquanceng: null //细分圈层名称           非必填
} as any);
const meitidaleiArr = ref([] as any); // 媒体大类下拉框
const hangyexifenArr = ref([] as any); // 媒体大类下拉框
const xifenquancengArr = ref([] as any); // 媒体大类下拉框
const platformArr = ref([] as any); //平台
let activePlatformIndex = ref(null); // 媒体源，默认选中第一个
const sellArr = ref([] as any); // 推荐列表
const isExpandSell = ref(false); // 推荐列表 fasle:收起
const sellNoArr = ref([] as any); // 推荐列表
const isExpandSellNo = ref(false); // 不推荐列表 fasle:收起
const isExpandInfer = ref(false); // 竞品推荐推荐列表 fasle:收起
const tableData = ref([
  {
    mediaId: 1111,
    docUrl: "XXXXXX",
    mediaName: "第一财经",
    mediacluster: "第一财经日报",
    mediatype: "传统媒体",
    positiveNum: 10,
    title: "文章标题",
    probability: 0.9
  },
  {
    mediaId: 1111,
    docUrl: "XXXXXX",
    mediaName: "第二财经",
    mediacluster: "第一财经日报",
    mediatype: "传统媒体",
    positiveNum: 10,
    title: "文章标题",
    probability: 0.5
  },
  {
    mediaId: 1111,
    docUrl: "XXXXXX",
    mediaName: "第三财经",
    mediacluster: "第一财经日报",
    mediatype: "传统媒体",
    positiveNum: 10,
    title: "文章标题",
    probability: 0.1
  }
]);
//媒体大类选中事件，请求行业细分、细分圈层、清空绑定的value
const changeMedia = value => {
  console.log(value);
  getHangyexifen(value);
  getXifenquancengArr(value);
  searchForm.value.hangyexifen = null;
  searchForm.value.xifenquanceng = null;
};

// 平台列表Api
const getDictListApi = async () => {
  const { data } = await dictListApi({ code: "platform" });
  platformArr.value = data as any;
};
// 媒体大类Api
const getMediaType = async () => {
  const { data } = await mediaTypeApi({ type: "meitidalei", pId: 0 });
  meitidaleiArr.value = data as any;
};
// 行业细分Api
const getHangyexifen = async (id: any) => {
  const { data } = await mediaTypeApi({ type: "hangyexifen", pId: id });
  hangyexifenArr.value = data as any;
};
// 细分圈层Api
const getXifenquancengArr = async (id: any) => {
  const { data } = await mediaTypeApi({ type: "xifenquanceng", pId: id });
  xifenquancengArr.value = data as any;
};

// 点击平台列表
const setMediaSourceActive = (index, item) => {
  activePlatformIndex.value = index; // 点击时更新当前活动索引
  searchForm.value.platform = item;
};
// 点击查询 推荐type:1, 不推荐type:0
const handleSearch = () => {
  console.log(searchForm.value);
  getSellArr({ ...searchForm.value, type: 1 });
  getSellArr({ ...searchForm.value, type: 0 });
  isExpandSell.value = false;
  isExpandSellNo.value = false;
};
// 推荐 不推荐列表
const getSellArr = async (params: any) => {
  const { data } = await recommandMediaApi(params);
  if (params.value.type === 1) {
    sellArr.value = data as any;
  } else {
    sellNoArr.value = data as any;
  }
};

// 推荐列表-展开收起  false:10,true:20; object:0/1/2(0：不推荐列表，1：推荐列表，2：竞品列表)
const handleExpandSell = (Object: any) => {
  if (Object.type === 1) {
    isExpandSell.value = !isExpandSell.value;
    getSellArr({
      ...searchForm.value,
      type: Object.type,
      num: isExpandSell.value === true ? 20 : 10
    });
  }
  if (Object.type === 0) {
    isExpandSellNo.value = !isExpandSellNo.value;
    getSellArr({
      ...searchForm.value,
      type: Object.type,
      num: isExpandSellNo.value === true ? 20 : 10
    });
  }
  // 竞品列表
  if (Object.type === 2) {
    isExpandInfer.value = !isExpandInfer.value;
  }
};

const handleClick = (row?: any) => {
  console.log(row);
};
onMounted(() => {
  getMediaType(); // 获取媒体大类
  getDictListApi(); // 获取平台列表
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
