<template>
  <div>
    <div class="mediaSuggestBox">
      <div class="mediaSuggest_tit">
        <div class="mediaSuggest_tit1">媒体推荐：</div>
        <div class="mediaSuggest_tit2">{{ currBrandStore.currBrandObj.brandName }}</div>
      </div>
      <div class="searchBox">
        <div class="searchBox_1">
          <div>[类别]</div>
          <div class="selectBox">
            <div>媒体类别：</div>
            <div>
              <el-select
                v-model="searchForm.mediaType"
                class="m-2"
                clearable
                filterable
                placeholder="请选择"
                style="width: 130px"
                @change="handleSearch"
              >
                <el-option v-for="item in meitiTypeArr" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div class="selectBox">
            <div>媒体大类：</div>
            <div>
              <el-select
                v-model="searchForm.meitidalei"
                class="m-2"
                clearable
                filterable
                placeholder="请选择"
                style="width: 130px"
                @change="changeMedia"
                @clear="clearMedia"
              >
                <el-option v-for="item in meitidaleiArr" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div class="selectBox">
            <div>行业细分：</div>
            <div>
              <el-select
                v-model="searchForm.hangyexifen"
                clearable
                filterable
                class="m-2"
                placeholder="请选择"
                style="width: 130px"
                @change="handleSearch"
              >
                <el-option v-for="item in hangyexifenArr" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <SelectAddPop style="margin-left: 20px" />
          <div class="selectBox">
            <div>细分圈层：</div>
            <div>
              <el-select
                v-model="searchForm.xifenquanceng"
                clearable
                filterable
                class="m-2"
                placeholder="请选择"
                style="width: 130px"
                @change="handleSearch"
              >
                <el-option v-for="item in xifenquancengArr" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <SelectAddPop style="margin-left: 20px" />
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
          <!-- <el-button class="buttonStyle" @click="handleSearch">查询</el-button> -->
        </div>
      </div>
      <div class="tableBox">
        <div class="sellBox">
          <div class="tableTile">推荐名单TOP{{ isExpandSell ? 20 : 10 }}</div>
          <el-table :data="sellArr" v-loading="isSellTableLoading" style="width: 100%; margin-top: 10px; color: #000" border>
            <el-table-column align="center" type="index" width="55" label="序号">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="媒体名称">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleClick(scope.row)">{{ scope.row.mediaName }}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="mediaCluster" label="所属媒体集群" />
            <el-table-column align="center" prop="mediaType" label="媒体属性" />
          </el-table>
          <el-button type="info" size="small" @click="handleExpandSell({ type: 1 })">
            {{ isExpandSell ? "- 收起" : " + 更多" }}
          </el-button>
        </div>
        <div class="sellNoBox">
          <div class="tableTile">不推荐名单TOP{{ isExpandSellNo ? 20 : 10 }}</div>
          <el-table :data="sellNoArr" v-loading="isSellNoTableLoading" style="width: 100%; margin-top: 10px; color: #000" border>
            <el-table-column align="center" type="index" width="55" label="序号">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="媒体名称">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleClick(scope.row)">{{ scope.row.mediaName }}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="mediaCluster" label="所属媒体集群" />
            <el-table-column align="center" prop="mediaType" label="媒体属性" />
          </el-table>
          <el-button type="info" size="small" @click="handleExpandSell({ type: 0 })">
            {{ isExpandSellNo ? "- 收起" : " + 更多" }}
          </el-button>
        </div>
      </div>

      <div class="sellBox">
        <div class="tableTile">
          竞品合作媒体推测TOP{{ isExpandInfer ? 20 : 10 }}
          <el-select
            v-model="competitorBrandId"
            class="m-2"
            placeholder="请选择"
            style="width: 130px"
            @change="changeCompetitorBrand"
          >
            <el-option
              v-for="item in currBrandStore.currBrandObj.competitor"
              :key="item.competitorBrandId"
              :label="item.competitorBrandName"
              :value="item.competitorBrandId"
            />
          </el-select>
        </div>
        <el-table v-loading="isLoading" :data="inferArr" style="width: 100%; margin-top: 10px; color: #000" border>
          <el-table-column align="center" type="index" min-width="5%" label="序号">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="媒体名称" min-width="10%">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleClick(scope.row)">{{ scope.row.mediaName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="mediacluster" label="所属媒体集群" min-width="10%" />
          <el-table-column align="center" prop="positiveNum" min-width="13%">
            <template #header>
              <div style="font-size: 12px">(过去12个月内)</div>
              <div>相关正向内容条数</div>
            </template>
          </el-table-column>
          <el-table-column min-width="50%" align="center" prop="title" label="文章示例">
            <template #default="scope">
              <a target="_blank" :href="`${scope.row.docUrl}`">{{ scope.row.title }}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="可能性" min-width="10%">
            <template #default="scope"> {{ numFilter(scope.row.probability) }} </template>
          </el-table-column>
        </el-table>
        <el-button type="info" size="small" @click="handleExpandSell({ type: 2 })">
          {{ isExpandInfer ? "- 收起" : " + 更多" }}
        </el-button>
      </div>
    </div>
    <BottomNav style="margin-top: 10px"></BottomNav>
  </div>
</template>

<script setup lang="ts" name="mediaSuggest">
import { onMounted, ref, watch } from "vue";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import { mediaTypeApi, dictListApi, recommandMediaApi, competitorApi, mediaNavApi } from "@/api/modules/media";
import SelectAddPop from "./../components/SelectAddPop/index.vue";
import BottomNav from "./../components/BottomNav/index.vue";
import router from "@/routers";
import { MEDIADETAIL } from "@/config";
import { numFilter } from "@/utils/parseFloat";

const currBrandStore = useCurrBrandStore();
const isLoading = ref(false); //竞品列表loading
const isSellTableLoading = ref(false); //推荐列表-loading
const isSellNoTableLoading = ref(false); //不推荐列表-loading
const competitorBrandId = ref(""); // 竞品id
const meitiTypeArr = ref([
  {
    id: "传统媒体",
    name: "传统媒体"
  },
  {
    id: "资讯网媒",
    name: "资讯网媒"
  },
  {
    id: "自媒体",
    name: "自媒体"
  }
]);
const meitidaleiArr = ref([] as any); // 媒体大类下拉框
const hangyexifenArr = ref([] as any); // 行业细分下拉框
const xifenquancengArr = ref([] as any); // 细分媒体下拉框
const platformArr = ref([] as any); //平台
let activePlatformIndex = ref(null) as any; // 媒体源，默认选中第一个
const sellArr = ref([] as any); // 推荐列表
const isExpandSell = ref(false); // 推荐列表 fasle:收起
const sellNoArr = ref([] as any); // 推荐列表
const isExpandSellNo = ref(false); // 不推荐列表 fasle:收起
const inferArr = ref([] as any); // 竞品列表
const isExpandInfer = ref(false); // 竞品推荐推荐列表 fasle:收起
const searchForm = ref({
  type: null, //推荐；0不推荐；
  num: 10, //查询top10 ；20 查询top20      必填
  platform: null, //平台名称          非必填
  mediaType: null, // 媒体类别 非必填
  meitidalei: 1, //媒体大类名称             非必填
  hangyexifen: null, //行业细分名称         非必填
  xifenquanceng: null, //细分圈层名称        非必填
  competitorBrandId: null //竞品合作媒体推测列表
} as any);
// 下拉框根据id找到name
function findNameById(arr, id) {
  const person = arr.find(arr => arr.id === id);
  return person ? person.name : undefined;
}

// 下拉框根据id找到name并赋值
const searchValue = () => {
  return {
    ...searchForm.value,
    meitidalei: findNameById(meitidaleiArr.value, searchForm.value.meitidalei), //媒体大类名称  非必填
    hangyexifen: findNameById(hangyexifenArr.value, searchForm.value.hangyexifen), //媒体大类名称  非必填
    xifenquanceng: findNameById(xifenquancengArr.value, searchForm.value.xifenquanceng) //媒体大类名称  非必填
  };
};

//媒体大类选中事件，请求行业细分、细分圈层、清空绑定的value
const changeMedia = value => {
  console.log(value);
  if (value) {
    getHangyexifen(value);
    getXifenquancengArr(value);
  }
  searchForm.value.hangyexifen = null;
  searchForm.value.xifenquanceng = null;
  setTimeout(() => {
    handleSearch();
  }, 500);
};
const clearMedia = () => {
  hangyexifenArr.value = []; // 行业细分下拉框
  xifenquancengArr.value = []; // 细分圈层下拉框
};

// 平台列表Api
const getDictListApi = async () => {
  const { data } = await dictListApi({ code: "platform" });
  platformArr.value = data as any;
  if (platformArr.value.length > 0) {
    platformArr.value.unshift("不分平台");
  }
};
// 媒体大类Api
const getMediaType = async () => {
  const { data } = await mediaTypeApi({ brandId: currBrandStore.currBrandObj.brandId, type: "meitidalei", pId: 0 });
  meitidaleiArr.value = data as any;
};
// 行业细分Api
const getHangyexifen = async (id: any) => {
  const { data } = await mediaTypeApi({ brandId: currBrandStore.currBrandObj.brandId, type: "hangyexifen", pId: id });
  hangyexifenArr.value = data as any;
};
// 细分圈层Api
const getXifenquancengArr = async (id: any) => {
  const { data } = await mediaTypeApi({ brandId: currBrandStore.currBrandObj.brandId, type: "xifenquanceng", pId: id });
  xifenquancengArr.value = data as any;
};

// 点击平台列表
const setMediaSourceActive = (index, item) => {
  activePlatformIndex.value = index; // 点击时更新当前活动索引
  if (item === "不分平台") {
    searchForm.value.platform = null;
  } else {
    searchForm.value.platform = item;
  }
  handleSearch();
};

// 点击查询 推荐type:1, 不推荐type:0
const handleSearch = () => {
  const searchValueObj = searchValue();
  getSellArr({ ...searchValueObj, type: 1, brandId: currBrandStore.currBrandObj.brandId });
  getSellNoArr({ ...searchValueObj, type: 0, brandId: currBrandStore.currBrandObj.brandId });
  getInferArr({
    ...searchValueObj,
    competitorBrandId: competitorBrandId.value,
    type: null,
    brandId: currBrandStore.currBrandObj.brandId
  });
  // setTimeout(() => {
  //   changeCompetitorBrand(currBrandStore.currBrandObj.competitor[0].competitorBrandId); //竞品列表 初始化查询
  // }, 400);
  isExpandSell.value = false;
  isExpandSellNo.value = false;
  isExpandInfer.value = false;
  isSellTableLoading.value = true; //推荐名单列表 loading
  isSellNoTableLoading.value = true; //不推荐名单列表 loading
  isLoading.value = true; // 竞品列表loading
};
// 推荐 不推荐列表
const getSellArr = async (params: any) => {
  await recommandMediaApi(params)
    .then(res => {
      setTimeout(() => {
        isSellTableLoading.value = false;
      }, 200);
      sellArr.value = res.data as any;
    })
    .catch(() => {
      isSellTableLoading.value = false;
    });
};
const getSellNoArr = async (params: any) => {
  await recommandMediaApi(params)
    .then(res => {
      setTimeout(() => {
        isSellNoTableLoading.value = false;
      }, 200);
      sellNoArr.value = res.data as any;
    })
    .catch(() => {
      isSellNoTableLoading.value = false;
    });
};
// 竞品列表
const getInferArr = async (params: any) => {
  competitorApi(params)
    .then(res => {
      isLoading.value = false;
      inferArr.value = res.data as any;
    })
    .catch(() => {
      isLoading.value = false;
    });
};
// 競品下拉框 change事件
const changeCompetitorBrand = (value, meitidalei?: any) => {
  const searchValueObj = searchValue();
  console.log("searchValueObj", searchValueObj);
  isExpandInfer.value = false; // 展开/收起 置为false（展开） false：查询10条
  competitorBrandId.value = value;
  isLoading.value = true;
  setTimeout(() => {
    getInferArr({
      ...searchValueObj,
      meitidalei: !meitidalei ? searchValueObj.meitidalei : meitidalei,
      num: isExpandSell.value === true ? 20 : 10,
      competitorBrandId: value,
      brandId: currBrandStore.currBrandObj.brandId
    });
  }, 300);
};

// 推荐列表-展开收起  false:10,true:20; object:0/1/2(0：不推荐列表，1：推荐列表，2：竞品列表)
const handleExpandSell = (Object: any) => {
  const searchValueObj = searchValue();
  if (Object.type == 1) {
    isSellTableLoading.value = true; //推荐名单列表 loading
    isExpandSell.value = !isExpandSell.value;
    getSellArr({
      ...searchValueObj,
      type: Object.type,
      num: isExpandSell.value === true ? 20 : 10,
      brandId: currBrandStore.currBrandObj.brandId
    });
  }
  if (Object.type == 0) {
    isSellNoTableLoading.value = true; //不推荐名单列表 loading
    isExpandSellNo.value = !isExpandSellNo.value;
    getSellNoArr({
      ...searchValueObj,
      type: Object.type,
      num: isExpandSellNo.value === true ? 20 : 10,
      brandId: currBrandStore.currBrandObj.brandId
    });
  }
  // 竞品列表
  if (Object.type === 2) {
    isLoading.value = true;
    isExpandInfer.value = !isExpandInfer.value;
    getInferArr({
      ...searchValueObj,
      type: null,
      num: isExpandInfer.value === true ? 20 : 10,
      competitorBrandId: competitorBrandId.value,
      brandId: currBrandStore.currBrandObj.brandId
    });
  }
};

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
  // 初始化查询条件
  searchForm.value = {
    type: 1, //推荐；0不推荐；
    num: 10, //查询top10 ；20 查询top20      必填
    platform: null, //平台名称                 非必填
    meitidalei: null, //媒体大类名称             非必填
    hangyexifen: null, //行业细分名称            非必填
    xifenquanceng: null //细分圈层名称           非必填
  };
  activePlatformIndex.value = null;
  // 清空列表数据
  sellArr.value = []; // 推荐列表
  isExpandSell.value = false; // 推荐列表 fasle:收起
  sellNoArr.value = []; // 不推荐列表
  isExpandSellNo.value = false; // 不推荐列表fasle:收起
  inferArr.value = []; // 竞品列表
  isExpandInfer.value = false; // 竞品推荐推荐列表 fasle:收起
}
// 跳转详情页方法
function jumpDetail(urlQuery: any) {
  let routerUrl = router.resolve({
    path: MEDIADETAIL,
    query: {
      ...urlQuery
    }
  });
  window.open(routerUrl.href, "_blank");
}
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
const handleClick = (row?: any) => {
  console.log(row);
  getMediaNavApi({ mediaId: row.mediaId });
};
onMounted(() => {
  activePlatformIndex.value = 0; // 点击时更新当前活动索引
  getMediaType(); // 获取媒体大类
  getDictListApi(); // 获取平台列表
  // handleSearch(); // 推荐、不推荐名单 初始化查询
  changeMedia(1);
  setTimeout(() => {
    changeCompetitorBrand(currBrandStore.currBrandObj.competitor[0].competitorBrandId, meitidaleiArr.value[0].name); //竞品列表 初始化查询
  }, 400);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
