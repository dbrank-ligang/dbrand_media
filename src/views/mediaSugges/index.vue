<template>
  <div class="mediaSuggesBox">
    <div class="mediaSugges_tit">
      <div class="mediaSugges_tit1">媒体推荐：</div>
      <div class="mediaSugges_tit2">海尔集团</div>
    </div>
    <div class="searchBox">
      <div>[类别]</div>
      <div class="selectBox">
        <div>媒体大类：</div>
        <div>
          <el-select v-model="searchForm.meitidalei" class="m-2" placeholder="Select" style="width: 150px" @change="changeMedia">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="selectBox">
        <div>行业细分：</div>
        <div>
          <el-select v-model="searchForm.hangyexifen" class="m-2" placeholder="Select" style="width: 150px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <el-button style="margin-left: 10px; margin-top: 2px">我要新增</el-button>
      <div class="selectBox">
        <div>细分圈层：</div>
        <div>
          <el-select v-model="searchForm.xifenquanceng" class="m-2" placeholder="Select" style="width: 150px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="mediaSugges">
import { ref } from "vue";
import { mediaTypeApi } from "@/api/modules/media";

let searchForm = ref({
  type: 1, //推荐；0不推荐；
  num: 10, //查询top10 ；20 查询top20      必填
  brandId: 20, //品牌id              必填
  platform: "", //平台名称                 非必填
  meitidalei: null, //媒体大类名称             非必填
  hangyexifen: null, //行业细分名称            非必填
  xifenquanceng: null //细分圈层名称           非必填
});

const options = [
  {
    value: "Option1",
    label: "Option1"
  },
  {
    value: "Option2",
    label: "Option2"
  },
  {
    value: "Option3",
    label: "Option3"
  },
  {
    value: "Option4",
    label: "Option4"
  },
  {
    value: "Option5",
    label: "Option5"
  }
];
const changeMedia = () => {
  console.log(searchForm.value.meitidalei);
};
mediaTypeApi();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
