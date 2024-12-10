<template>
  <div class="mediaQ">
    <!-- <div style="width: 400px; height: 400px; background-color: red; margin: auto"></div> -->
    <div class="carouselBox">
      <el-carousel
        :interval="4000000"
        :loop="false"
        :card-scale="1"
        :autoplay="false"
        type="card"
        height="500px"
        indicator-position="none"
      >
        <el-carousel-item v-for="item in 5" :key="item" @click="handleIndex">
          <div class="card">
            <div style="color: red; margin-bottom: 30px" class="timebox">时间时间时间</div>
            <div class="itemBox" @click.stop="handleItem" v-for="itemName in listData" :key="itemName">
              <div>{{ item }}{{ itemName.name }}</div>
              <div>{{ item }}{{ itemName.name }}</div>
              <div>{{ item }}{{ itemName.name }}</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup lang="ts" name="mediaQ">
import { ref } from "vue";

const listData = ref([
  {
    name: "张三张三张三张三张三张三张三张三张三"
  },
  {
    name: "张三张三张三张三张三张三张三张三张三"
  },
  {
    name: "张三张三张三张三张三张三张三张三张三"
  },
  {
    name: "张三张三张三张三张三张三张三张三张三"
  },
  {
    name: "张三张三张三张三张三张三张三张三张三"
  }
] as any);
const handleItem = () => {
  console.log("handleItem");
};
const handleIndex = () => {
  console.log("handleIndex");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
<style scoped>
.el-carousel__container,
.el-carousel__item {
  overflow: visible; /* 重要：让卡片超出容器部分可见 */
}
.el-carousel__item--card {
  float: left; /* 卡片浮动并排显示 */

  width: calc(100% / 3 - 10px); /* 卡片宽度，3张卡片均分100%宽度 */
}
/* 可根据实际情况调整上面的宽度计算 */
</style>
