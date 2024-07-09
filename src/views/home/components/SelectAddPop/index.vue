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
          value-key="mediaName"
        />
      </div>
      <div class="tagBox">
        <el-tag
          v-for="tag in newType"
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
import { onMounted, ref } from "vue";
import { ElButton } from "element-plus";
import { ElNotification } from "element-plus";
import { userMediaTypeApi, searchMediaApi, saveUserMediaTypeApi } from "@/api/modules/media";

const newType = ref([] as any);
const visible = ref(false);
const tabArr = ref([
  { title: "自选类别", isActive: false },
  { title: "我要新增", isActive: false }
]);
const defaultProps = {
  children: "child",
  label: "name"
};
const topListArr = ref([]);
const xifenListArr = ref([]);

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
//  获取细分圈层
const getXifenTypeArr = async () => {
  const { data } = await userMediaTypeApi({ barandId: 1, type: "subdivide" });
  xifenListArr.value = data as any;
  console.log(xifenListArr.value);
};
//  获取头部媒体
const getTopArr = async () => {
  const { data } = await userMediaTypeApi({ barandId: 1, type: "top" });
  topListArr.value = data as any;
  console.log(topListArr.value);
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
  getTopArr();
  getXifenTypeArr();
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
  saveUserMediaType({
    brandId: "",
    brandName: "海尔",
    topMediaTypeIds: flattenAndCheck(topListArr.value),
    subMdiaTypeIds: flattenAndCheck(xifenListArr.value),
    newType: newType.value
  });
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
  newType.value.splice(newType.value.indexOf(tag), 1);
};

const inputValue = ref("");

const handleInputConfirm = () => {
  if (inputValue.value) {
    newType.value.push(inputValue.value);
  }
  inputValue.value = "";
};

const querySearch = async (queryString: string, cb: any) => {
  const { data } = await searchMediaApi({ keyword: queryString });
  cb(data);
};

const handleSelect = (item: Record<string, any>) => {
  console.log("input框的值", item);
};
// ---------

const saveUserMediaType = async (params: any) => {
  saveUserMediaTypeApi(params);
  await showNotificationWithImage();
};
onMounted(async () => {
  console.log(123);
});
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
