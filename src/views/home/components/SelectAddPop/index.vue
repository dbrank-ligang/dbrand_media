<template>
  <div class="selectAddPopBox">
    <el-popover :visible="visible" placement="bottom" :width="736" popper-class="custom-popover">
      <div class="listTitle">头部媒体类别卡片自选</div>
      <div class="treeBox">
        <el-tree
          style="margin-bottom: 20px"
          :data="topListArr"
          node-key="id"
          :expand-on-click-node="false"
          :check-strictly="true"
          :props="defaultProps"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <el-checkbox
                v-for="item in node.label"
                :key="item"
                v-show="item !== null"
                :label="item"
                v-model="data.check"
                change
              />
              <span> </span>
            </span>
          </template>
        </el-tree>
      </div>
      <div class="listTitle">细分媒体圈层卡片自选</div>
      <div class="treeBox">
        <el-tree
          style="margin-bottom: 20px"
          :data="xifenListArr"
          node-key="id"
          :expand-on-click-node="false"
          :check-strictly="true"
          :props="defaultProps"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <el-checkbox
                v-for="item in node.label"
                :key="item"
                v-show="item !== null"
                :label="item"
                v-model="data.check"
                change
              />
              <span> </span>
            </span>
          </template>
        </el-tree>
      </div>

      <div class="addListBox" style="margin-top: 10px">
        <div class="addTitle">我要新增：</div>

        <el-autocomplete
          v-model="inputValue"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          clearable
          class="inline-input w-50"
          style="width: 350px"
          maxlength="5"
          placeholder="请一次输入一个媒体类别或圈层类别，限5个字以内。s"
          @select="handleSelect"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <!-- <el-input
          ref="InputRef"
          v-model="inputValue"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
          maxlength="5"
          placeholder="请一次输入一个媒体类别或圈层类别，限5个字以内。"
        /> -->
      </div>
      <div class="tagBox">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          type="info"
          size="small"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          style="margin-right: 10px"
        >
          {{ tag }}
        </el-tag>
      </div>

      <div style="margin: 0; text-align: right">
        <el-button size="small" text @click="cancelChange" class="buttonStyle_cancel">取消</el-button>
        <el-button size="small" type="primary" @click="confirmChange" class="buttonStyle"> 确定 </el-button>
      </div>
      <template #reference>
        <div class="selectTab">
          <div v-for="item in tabArr" :key="item.title" :style="getStyle(item)" @click="activeBtn(item)">
            {{ item.title }}
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts" name="selectAddPop">
import { ref } from "vue";
import { ElButton } from "element-plus";
import { ElNotification } from "element-plus";

// import { ElInput } from "element-plus";
const dynamicTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
// const InputRef = ref<InstanceType<typeof ElInput>>();
let visible = ref(false);
// let imageSrc = "/src/assets/images/logo.png";

const tabArr = ref([
  { title: "自选类别", isActive: false },
  { title: "我要新增", isActive: false }
]);
const defaultProps = {
  children: "child",
  label: "name"
};

let topListArr = ref([
  {
    id: "1",
    name: ["传统媒体-中央级", "咨讯-中央级", null],
    check: true
  },
  {
    id: "2",
    name: ["传统媒体-IT科技大类", "咨询-科技大类", "自媒体-科技大类"],
    check: true,
    child: [
      //child没有的话返回[]
      {
        id: "3",
        name: ["传统媒体-手机通讯", "咨询-手机通讯", "自媒体-手机通讯"],
        check: false
      },
      {
        id: "5",
        name: ["传统媒体-人工智能", "咨询-人工智能"],
        check: true
      }
    ]
  }
]);
let xifenListArr = ref([
  {
    id: "6",
    name: ["传统媒体-中央级", "咨讯-中央级", null],
    check: false
  },
  {
    id: "7",
    name: ["传统媒体-IT科技大类", "咨询-科技大类", "自媒体-科技大类"],
    check: false,
    child: [
      //child没有的话返回[]
      {
        id: "8",
        name: ["传统媒体-手机通讯", "咨询-手机通讯", "自媒体-手机通讯"],
        check: false
      },
      {
        id: "9",
        name: ["传统媒体-人工智能", "咨询-人工智能"],
        check: false
      }
    ]
  }
]);

// 取出二维数组中check等于true的id 拼成数组
const flattenAndCheck = items => {
  return items.reduce((result, item) => {
    // 如果当前项有 check 属性且为 true，则添加其 id 到结果数组中
    if (item.check) {
      result.push(item.id);
    }
    // 如果当前项有 child 属性，则递归调用 flattenAndCheck
    if (Array.isArray(item.child)) {
      result.push(...flattenAndCheck(item.child));
    }
    return result;
  }, []);
};

//  tab切换样式
const getStyle = item => {
  if (item.isActive) {
    return { color: "#948000", borderBottom: "1px solid #948000" };
  }
  return {};
};
// tab切换点击事件
const activeBtn = item => {
  visible.value = true;
  let currentState = item.isActive;
  tabArr.value.forEach(el => {
    el.isActive = false;
  });
  item.isActive = !currentState;
};

// 提交完成后的弹窗 自定义组件
const showNotificationWithImage = () => {
  // 创建一个包含图片的 HTML 字符串
  // 注意：这里假设图片URL是安全的
  const htmlContent = `
    <div style="display: flex;  justify-content: space-between;">
      <img src="/src/assets/images/QRcode.jpg" alt="Notification Image" style="width: 100px; height: 100px; margin-right: 10px; vertical-align: middle; display: inline-block;">
      <span>收到您的需求！<br/>我们会尽快处理，<br/>可联系榜女郎获知更新进度</span>
    </div>
  `;
  // 显示 Notification
  ElNotification({
    dangerouslyUseHTMLString: true, // 允许使用HTML字符串
    // message: htmlContent
    duration: 0,
    message: htmlContent
  });
};
// 确认提交按钮
const confirmChange = () => {
  visible.value = false;
  console.log("topMediaIds", flattenAndCheck(topListArr.value));
  console.log("subMediaIds", flattenAndCheck(xifenListArr.value));
  // console.log(topListArr.value); //复选框选中的值
  tabArr.value = [
    { title: "自选类别", isActive: false },
    { title: "我要新增", isActive: false }
  ];
  showNotificationWithImage();
};
// 取消
const cancelChange = () => {
  visible.value = false;
  tabArr.value = [
    { title: "自选类别", isActive: false },
    { title: "我要新增", isActive: false }
  ];
};

// tag删除事件
const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const inputValue = ref("");
interface RestaurantItem {
  value: string;
  link: string;
}
const loadAll = () => {
  return [
    { value: "vue", link: "https://github.com/vuejs/vue" },
    { value: "element", link: "https://github.com/ElemeFE/element" },
    { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
    { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "vuex", link: "https://github.com/vuejs/vuex" },
    { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
    { value: "babel", link: "https://github.com/babel/babel" }
  ];
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputValue.value = "";
};

const restaurants = ref<RestaurantItem[]>([]);
const querySearch = (queryString: string, cb: any) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value;
  // call callback function to return suggestions
  cb(results);
};
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};

const handleSelect = (item: Record<string, any>) => {
  console.log("input框的值", item);
};
restaurants.value = loadAll();
</script>

<style lang="scss">
.custom-popover {
  padding: 30px !important;
  border: 1px solid #ffdd00 !important;
}
.el-notification {
  background-color: #ffdd00 !important;
}
</style>
<style scoped lang="scss">
@import "./index.scss";
</style>
