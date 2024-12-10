<template>
  <div id="app">
    <el-carousel :interval="40000" type="card" @change="carouselChange" ref="carousel">
      <el-carousel-item v-for="item in carouseData" :key="item.id" :id="item.id" :ref="setItemRef(item.id)">
        {{ item.id }}
        <!-- <img class="element-img" alt="" :src="item.url"> -->
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup lang="ts" name="selectAddPop">
import { onMounted, ref } from "vue";
const carouseId = ref();
const carouseData = ref([{ id: 1 }, { id: 2 }, { id: 3 }]);
// 创建一个 ref 映射表，用于存储对应 item id 的 DOM 元素
const itemRefs = ref({});

// 设置函数，用于将 item ID 映射到对应的 ref 上
const setItemRef = id => {
  debugger;
  return el => {
    if (el) {
      itemRefs.value[id] = el;
    } else {
      delete itemRefs.value[id];
    }
  };
};
const carouselChange = (now, old) => {
  console.log(now + "," + old);
  carouseId.value = now;
  setPY();
};
const setPY = () => {
  let _carouseId = carouseId.value;
  console.log(_carouseId);
  // if (_carouseId == 0) {
  // 0.value.style.left
  //   $("#0").css("left", "-15%");
  //   $("#0").next().css("left", "32%");
  //   $("#0").next().next().css("left", "-62%");
  // } else if (_carouseId == 1) {
  //   $("#1").css("left", "-15%");
  //   $("#1").prev().css("left", "-62%");
  //   $("#1").next().css("left", "32%");
  // } else {
  //   $("#2").css("left", "-15%");
  //   $("#2").prev().css("left", "-62%");
  //   $("#2").prev().prev().css("left", "32%");
  // }
};

onMounted(() => {
  setPY();
  console.log(itemRefs.value);
});
</script>
<style scoped>
.el-carousel__container,
.el-carousel__item {
  overflow: visible; /* 让项目内容可见 */
  border: 1px solid #ccc;
  background: #eee;
}
.el-carousel__item {
  border-radius: 4px;
  margin-right: 100px; /* 调整项之间的距离 */
}
.el-carousel__item:last-child {
  margin-right: 0; /* 最后一项不需要右边距离 */
}
</style>
